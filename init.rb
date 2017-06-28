#*******************************************************************************
# clipboard_image_paste Redmine plugin.
#
# Authors:
# - Richard Pecl
#
# Terms of use:
# - GNU GENERAL PUBLIC LICENSE Version 2
#*******************************************************************************

require 'redmine'
require 'dispatcher' unless Rails::VERSION::MAJOR >= 3

Redmine::Plugin.register :clipboard_image_paste do
  name        'Clipboard image paste'
  author      'Richard Pecl'
  description 'Paste cropped image from clipboard as attachment'
  url         'http://www.redmine.org/plugins/clipboard_image_paste'
  version     '1.12'
  requires_redmine :version_or_higher => '1.4.0'

  configfile = File.join(File.dirname(__FILE__), 'config', 'settings.yml')
  $clipboard_image_paste_config = YAML::load_file(configfile)

  redmineVer = Redmine::VERSION.to_a
  $clipboard_image_paste_has_jquery = redmineVer[0] > 2 || (redmineVer[0] == 2 && redmineVer[1] >= 2)
  $clipboard_image_paste_remove_alpha = redmineVer[0] < 2 || (redmineVer[0] == 2 && redmineVer[1] <= 5)
end


if Rails::VERSION::MAJOR >= 3
  ActionDispatch::Callbacks.to_prepare do
    require_dependency 'clipboard_image_paste/hooks'
    require_dependency 'clipboard_image_paste/attachment_patch'
  end
else
  Dispatcher.to_prepare :clipboard_image_paste do
    require_dependency 'clipboard_image_paste/hooks'
    require_dependency 'clipboard_image_paste/attachment_patch'
  end
end

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

# Hooks
require_dependency 'clipboard_image_paste/hooks'
# Patches
require_dependency 'clipboard_image_paste/attachment_patch'

Redmine::Plugin.register :clipboard_image_paste do
  name 'Clipboard image paste'
  author 'Richard Pecl'
  description "Paste cropped image from clipboard as attachment"
  version '1.0'

  configfile = File.join(File.dirname(__FILE__), 'config', 'settings.yml')
  $clipboard_image_paste_config = YAML::load_file(configfile)
end

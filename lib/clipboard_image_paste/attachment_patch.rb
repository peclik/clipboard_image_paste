#*******************************************************************************
# clipboard_image_paste Redmine plugin.
#
# Attachment patch converting uploaded pasted image data to file object.
#
# Authors:
# - Richard Pecl
# - Alexandr Ivanov: conversion code snippet from
#   redmine_cr_img_paste plugin
#
# Terms of use:
# - GNU GENERAL PUBLIC LICENSE Version 2
#*******************************************************************************

module AttachmentPatch
  def self.included(base)
    base.send(:include, InstanceMethods)

    # Same as typing in the class
    base.class_eval do
      # Send unloadable so it will not be unloaded in development
      unloadable

      #~ alias_method_chain :attach_files, :pasted_images
      alias_method_chain :save_attachments, :pasted_images
    end
  end

  module InstanceMethods

    # go through attachments and find keys starting by 100;
    # image attachments are identified by key >= 10001, the keys should be numbers
    # 'cause acts_as_attachable is sorting them according to insertion order
    def save_attachments_with_pasted_images(attachments, author=User.current)
      if attachments && attachments.is_a?(Hash)
        attachments.each do |key,value|
          next unless key.start_with?('1000')
          value['file'] = PastedImage.new(value.delete('data'), value.delete('name'))
        end
      end
      save_attachments_without_pasted_images(attachments, author)
    end

  end

  # Mimics uploaded file field data.
  class PastedImage
    def initialize(data, name)
      @raw = StringIO.new(remove_alpha(Base64.decode64(data.to_s)))
      @name = name.to_s.strip
      @name = 'picture.png' if @name.blank?
      @name += '.png' unless @name.end_with?('.png')
    end

    def size
      @raw.size
    end

    def original_filename
      @name
    end

    def content_type
      "image/png"
    end

    def read(*args)
      @raw.read(*args)
    end

    # remove alpha channel (because PDF export doesn't support PNGs with alpha channel,
    # see https://github.com/peclik/clipboard_image_paste/issues/24)
    def remove_alpha(imgData)
      begin
        ilist = Magick::ImageList.new
        ilist.from_blob(imgData)
        ilist.each do |img|
          # border function will compose alpha channel with border color
          img.border!(0, 0, "white")
          # deactivating alpha channel ('alpha -off') will skip it during image saving
          img.alpha(Magick::DeactivateAlphaChannel)
        end
        return ilist.to_blob
      rescue
        return imgData
      end
    end if Object.const_defined?(:Magick)

    # without RMagick we cannot remove alpha channel
    def remove_alpha(imgData)
      return imgData
    end if not Object.const_defined?(:Magick)
  end

end

# Send patches - guarded against including the module multiple time
# (like in tests) and registering multiple callbacks

unless Issue.included_modules.include? AttachmentPatch
  Issue.send(:include, AttachmentPatch)
end

unless News.included_modules.include? AttachmentPatch
  News.send(:include, AttachmentPatch)
end

unless WikiPage.included_modules.include? AttachmentPatch
  WikiPage.send(:include, AttachmentPatch)
end

unless Message.included_modules.include? AttachmentPatch
  Message.send(:include, AttachmentPatch)
end

unless Document.included_modules.include? AttachmentPatch
  Document.send(:include, AttachmentPatch)
end

unless Version.included_modules.include? AttachmentPatch
  Version.send(:include, AttachmentPatch)
end

unless Project.included_modules.include? AttachmentPatch
  Project.send(:include, AttachmentPatch)
end

# KbArticle plug-in (https://github.com/alexbevi/redmine_knowledgebase)
begin
  unless KbArticle.included_modules.include? AttachmentPatch
    KbArticle.send(:include, AttachmentPatch)
  end
rescue NameError => e
  # plug-in not installed
end

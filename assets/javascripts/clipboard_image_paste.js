//******************************************************************************
// clipboard_image_paste Redmine plugin.
//
// Authors:
// - Richard Pecl
// - Joel Besada: paste handler snippet from
//   http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/
//
// Terms of use:
// - GNU GENERAL PUBLIC LICENSE Version 2
//******************************************************************************

//----------------------------------------------------------------------------
// Enclose everything inside a namespace.
(function(cbImagePaste, $, undefined) {

  // pasted image
  var pastedImage;

  // dialog object
  var dialog;

  // jcrop api
  var jcrop_api;

  // actual crop coordinates
  var cropCoords;

  // true if the browser has compatible clipboard
  var hasClipboard;


  //****************************************************************************
  //
  // paste dialog stuff:
  //
  //****************************************************************************

  //----------------------------------------------------------------------------
  // Show paste dialog.
  cbImagePaste.showPasteDialog = function() {
    if (!isBrowserSupported()) {
      alert(cbImagePaste.cbp_txt_wrong_browser);
      return false;
    }

    var fields = checkAttachFields();
    if (!fields) {
      alert(cbImagePaste.cbp_txt_too_many_files);
      return false;
    }

    // init buttons labels with translated text
    var dlg_buttons = {};
    dlg_buttons[cbImagePaste.cbp_txt_btn_ok]     = insertAttachment;
    dlg_buttons[cbImagePaste.cbp_txt_btn_cancel] = function() { $(this).dialog("close"); };

    $("#cbp_paste_dlg").dialog({
      buttons: dlg_buttons,
      closeOnEscape: true,
      modal: true,
      resizable: false,
      width: 400,
      minWidth: 400,
      height: 500,
      minHeight: 500,
      dialogClass: "cbp_drop_shadow",
      create: function(event, ui) {
        dialog = this;
      },
      open: function(event, ui) {
        initDialog();
      },
      close: function(event, ui) {
        deinitDialog();
        delete dialog;
      },
      resize: function(event, ui) {
        resizePanel();
      }
    });
  };

  //----------------------------------------------------------------------------
  // Get browser version if the browser is Internet Explorer. Otherwise the result is -1.
  function getInternetExplorerVersion() {
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    }
    else if (navigator.appName == 'Netscape')
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 );
    }
    return rv;
  }

  //----------------------------------------------------------------------------
  // Check supported browser version.
  // We support Firefox & Chrome only. Even if other browsers use the same
  // layout engine (Gecko or WebKit) thay may not support Ctrl+V properly.
  function isBrowserSupported() {
    //alert("min_firefox=" + cbImagePaste.cbp_min_firefox_ver + "\n" +
    //      "min_chrome=" + cbImagePaste.cbp_min_chrome_ver + "\n" +
    //      "agent='" + navigator.userAgent + "'\n");

    var M = navigator.userAgent.match(/(firefox|webkit)\/?\s*(\.?\d+(\.\d+)*)/i);

    if (M) {
      var browserMajor = parseInt(M[2], 10);
      M[1] = M[1].toLowerCase();

      var isCompatChrome = (M[1] == 'webkit' && typeof window.chrome === "object" && browserMajor >= cbImagePaste.cbp_min_chrome_ver);
      hasClipboard = isCompatChrome || (M[1] == 'firefox' && browserMajor >= 50);

      if (isCompatChrome ||
          (M[1] == 'firefox' && browserMajor >= cbImagePaste.cbp_min_firefox_ver))
        return true;
    }
    if (getInternetExplorerVersion() >= cbImagePaste.cbp_min_ie_ver) {
      return true;
    }
    return false;
  };

  //----------------------------------------------------------------------------
  // Show copy wiki link dialog.
  function showCopyLink(btn, name) {
    $("#cbp_image_link").val("!" + name.val() + "!");
    $("#cbp_thumbnail_link").val("{{thumbnail(" + name.val() + ")}}");

    $("#cbp_link_dlg").dialog({
      closeOnEscape: true,
      modal: true,
      resizable: false,
      dialogClass: "cbp_drop_shadow cbp_dlg_small",
      position: { my: "left top", at: "left bottom", of: btn },
      minHeight: 0,
      width: "auto"
    });
  };

  //----------------------------------------------------------------------------
  // Initialize dialog.
  function initDialog() {
    initPasteListener();
    showInstructions("print");

    $(window).bind("resize", fitDalog2Window);
    fitDalog2Window();

    $(dialog).dialog("option", "position", "center");
  };

  //----------------------------------------------------------------------------
  // Deinitialize dialog.
  function deinitDialog() {
    deinitPasteListener();
    $(window).unbind("resize", fitDalog2Window);
  };

  //----------------------------------------------------------------------------
  // Resize dialog if window is being resized.
  function fitDalog2Window() {
    if (dialog) {
      if ($(dialog).dialog("isOpen")) {
        $(dialog).dialog("option", "width",  $(window).width() - 100 );
        $(dialog).dialog("option", "height", $(window).height() - 100 );
        resizePanel();
      }
    }
  };

  //----------------------------------------------------------------------------
  // Resize canvas accoring to dialog size.
  function resizePanel() {
    // panelBox border width
    var panelBoxBorder = 5;

    $("#cbp_panel_box").css("height", $(dialog).height() -  $("#cbp_header_box").height() - 2 * panelBoxBorder - 10 + "px");

    // if some image has been pasted, create new panel with new dimensions
    if (pastedImage) {
      createPanel();
    }
  };

  //----------------------------------------------------------------------------
  // Show scaled panel with pasted image.
  function createPanel() {
    // destroy old cropping handler
    if (jcrop_api) {
      jcrop_api.destroy();
      delete jcrop_api;
    }

    // remove old canvas
    $("#cbp_panel_box").empty();

    // create and fill new canvas
    // compute scaled size
    var boxw = $("#cbp_panel_box").width();
    var boxh = $("#cbp_panel_box").height();

    if (pastedImage.width > boxw || pastedImage.height > boxh)
    {
      var imageRatio = pastedImage.height / pastedImage.width;
      var boxRatio = boxh / boxw;
      if (imageRatio <= boxRatio) {
        // based on the widths
        var scale = boxw / pastedImage.width;
        boxw = Math.round(pastedImage.width * scale);
        boxh = Math.round(pastedImage.height * scale);
      }
      else {
        // based on the heights
        var scale = boxh / pastedImage.height;
        boxw = Math.round(pastedImage.width * scale);
        boxh = Math.round(pastedImage.height * scale);
      }
    }
    else
    {
      boxw = pastedImage.width;
      boxh = pastedImage.height;
    }

    var panel = document.createElement("canvas");
    panel.width  = boxw;
    panel.height = boxh;

    var ctx = panel.getContext("2d");
    // clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw image
    ctx.drawImage(pastedImage, 0, 0, ctx.canvas.width, ctx.canvas.height);

    $("#cbp_panel_box").append(panel);

    // create cropping handler
    $(panel).Jcrop({
      onChange: showPreview,
      onSelect: showPreview,
      aspectRatio: 0,
      trueSize: [pastedImage.width, pastedImage.height]
    },
    function() {
      jcrop_api = this;
    });

    showPreview();
  };

  //----------------------------------------------------------------------------
  // printf like function
  // usage: output = printf('{1} to {2}, {1} taken first', 34, 55)
  function printf(fmt) {
    var args = arguments;
    return fmt.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };

  //----------------------------------------------------------------------------
  // Show crop box dimensions and crop preview.
  function showPreview(coords)
  {
    if (coords && coords.w != 0 && coords.h != 0)
      showInstructions("box", printf(cbImagePaste.cbp_txt_crop_box,
        Math.round(coords.x), Math.round(coords.y), Math.round(coords.w), Math.round(coords.h)));
    else {
      showInstructions("select");
      coords = {x:0, y:0, w:pastedImage.width, h:pastedImage.height};
    }
    cropCoords = coords;

    var thumbnail = document.getElementById("cbp_thumbnail");

    if (thumbnail) {

      ctx = thumbnail.getContext("2d");
      // clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // draw image
      ctx.drawImage(pastedImage, coords.x, coords.y, coords.w, coords.h, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };


  //----------------------------------------------------------------------------
  // Show crop box dimensions and crop preview.
  var prevInstructions;
  function showInstructions(what, text) {
    if (what === "box") {
      $("#cbp_instructions").html(cbImagePaste.cbp_txt_deselect + "<br>" + text);
      prevInstructions = what;
      return;
    }

    if (prevInstructions === what)
      return;

    prevInstructions = what;

    if (what === "select") {
      $("#cbp_instructions").html(cbImagePaste.cbp_txt_select);
    }
    else if (what === "print") {
      $("#cbp_instructions").html(cbImagePaste.cbp_txt_print);
    }

    $("#cbp_instructions").animate({backgroundColor: "#FF8000"}, "slow");
    $("#cbp_instructions").animate({backgroundColor: "white"}, 2000);
  };


  //****************************************************************************
  //
  // paste handler:
  //
  //****************************************************************************

  // Firefox<50 contenteditable element
  var pasteCatcher;

  function initPasteListener() {
    // We start by checking if the browser supports the
    // Clipboard object. If not, we need to create a
    // contenteditable element that catches all pasted data
    if (!hasClipboard) {
      pasteCatcher = document.createElement("div");

      // Firefox allows images to be pasted into contenteditable elements
      pasteCatcher.setAttribute("contenteditable", "");
      pasteCatcher.setAttribute("id", "cbp_paste_catcher");

      // We can hide the element and append it to the body,
      dialog.appendChild(pasteCatcher);

      // as long as we make sure it is always in focus
      document.addEventListener("click", focusCatcher, false);
      setTimeout(focusCatcher, 50);
    }
    // Add the paste event listener
    window.addEventListener("paste", pasteHandler, false);
  };

  function deinitPasteListener() {
    window.removeEventListener("paste", pasteHandler, false);

    if (pasteCatcher) {
      document.removeEventListener("click", focusCatcher, false);
      dialog.removeChild(pasteCatcher);
      delete pasteCatcher;
    }
  };

  // Handle click events for paste catcher (Firefox<50)
  function focusCatcher(e) {
    if (pasteCatcher)
      pasteCatcher.focus();
  };

  // Handle paste events
  function pasteHandler(e) {
    // We need to check if event.clipboardData is supported (Chrome and Firefox>=50)
    if (hasClipboard && e.clipboardData) {
      // Get the items from the clipboard
      var items = e.clipboardData.items;
      if (!items)
        alert(cbImagePaste.cbp_txt_empty_cb);
      else {
        // Loop through all items, looking for any kind of image
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            // We need to represent the image as a file,
            var blob = items[i].getAsFile();
            // and use a URL or webkitURL (whichever is available to the browser)
            // to create a temporary URL to the object
            var URLObj = window.URL || window.webkitURL;
            var source = URLObj.createObjectURL(blob);

            // The URL can then be used as the source of an image
            createImage(source);
            return;
          }
        }
        alert(cbImagePaste.cbp_txt_no_image_cb);
      }
    // If we can't handle clipboard data directly (Firefox<50),
    // we need to read what was pasted from the contenteditable element
    } else {
      // This is a cheap trick to make sure we read the data
      // AFTER it has been inserted.
      setTimeout(checkInput, 1);
    }
  };

  // Parse the input in the paste catcher element
  function checkInput() {
     // Store the pasted content in a variable
     var child = pasteCatcher.childNodes[0];

     // Clear the inner html to make sure we're always
     // getting the latest inserted content
     pasteCatcher.innerHTML = "";

     if (child) {
        // If the user pastes an image, the src attribute
        // will represent the image as a base64 encoded string.
        if (child.tagName === "IMG")
          createImage(child.src);
        else
          alert(cbImagePaste.cbp_txt_no_image_cb);
     }
  };

  // Creates a new image from a given source
  function createImage(source) {
    pastedImage = new Image();
    pastedImage.onload = function() {
      createPanel();
    }
    pastedImage.src = source;
  }


  //****************************************************************************
  //
  // Redmine stuff
  //
  //****************************************************************************

  // image attachment id offset
  // see attachment_patch.rb
  var imageAttachIdOfs = 10000;

  // image field counter
  var imageAttachCount = 0;

  // skeleton with input fields
  var inputSkeleton;

  //----------------------------------------------------------------------------
  // Insert attachment input tag into document.
  function insertAttachment() {
    if (!pastedImage) {
      alert(cbImagePaste.cbp_txt_no_image_pst);
      return;
    }

    var fields = checkAttachFields();
    if (!fields)
      return false;

    var dataUrl = getImageUrl();

    if (dataUrl.length > cbImagePaste.cbp_max_attach_size) {
      alert(cbImagePaste.cbp_txt_too_big_image);
      return;
    }

    // inspired by redmine/public/javascripts/application.js
    imageAttachCount++;

    // generate "unique" identifier, using "random" part cbImagePaste.cbp_act_update_id
    var attachId    = cbImagePaste.cbp_act_update_id + "-" + imageAttachCount;
    var attachInpId = "attachments[" + (imageAttachIdOfs + imageAttachCount) + "]";

    var s = inputSkeleton.clone();
    s.css("display", "block");

    // show thumbnail in attachment preview
    var elements = s.find("#cbp_attach_thumbnail");
    elements.attr("src", dataUrl);
    //elements.attr("title", "image attachment " + attachId + " preview").val("");

    dataUrl = dataUrl.substring(dataUrl.indexOf("iVBOR"));

    elements = s.children("#cbp_image_data");
    elements.attr("name", attachInpId + "[data]").val("");
    elements.attr("value", dataUrl).val(dataUrl);

    elements = s.children("input.name");
    elements.attr("name", attachInpId + "[name]").val("");
    var pictureName = "picture" + attachId + ".png";
    elements.attr("value", pictureName).val(pictureName);

    // limit user input for attachment file name
    elements.each(function() {
      $(this).blur(function() {
        this.value = this.value.replace(/^\s+|\s+$/g, '');
        if (this.value == '')
          this.value = this.defaultValue;
        else if (this.value.search(/\.png$/) < 1)
          this.value += ".png";
        this.value = this.value.replace(/[\/\\!%\?\*:'"\|<>&]/g, "-");
        this.value = this.value.replace(/ /g, "_");
      });
    });

    elements = s.children("input.description");
    elements.attr("name", attachInpId + "[description]").val("");

    // add onclick handler for copy link button
    elements = s.children("#cbp_link_btn");
    elements.each(function() {
      $(this).click(function(el) {
        showCopyLink($(this), $(this).prev());
        return false;
      });
    });

    fields.append(s);

    $(dialog).dialog("close");
  };

  //----------------------------------------------------------------------------
  // Create final image url.
  function getImageUrl() {
    // create temporary canvas
    var dst = document.createElement("canvas");
    dst.width  = Math.round(cropCoords.w);
    dst.height = Math.round(cropCoords.h);
    var ctx = dst.getContext("2d");
    // draw image
    ctx.drawImage(pastedImage,
      Math.round(cropCoords.x), Math.round(cropCoords.y), dst.width, dst.height,
      0, 0, dst.width, dst.height);

    return dst.toDataURL("image/png");
  };

  //----------------------------------------------------------------------------
  // Check maximum number of attachment fields, return fields element.
  function checkAttachFields() {
    var fileFields  = $("#attachments_fields");
    var imageFields = $("#cbp_image_fields");
    if (!fileFields || !imageFields ||
      (fileFields.children().length + imageFields.children().length) >= cbImagePaste.cbp_max_attachments)
      return;
    return imageFields;
  };

  //----------------------------------------------------------------------------
  // Remove new image attachment.
  cbImagePaste.removeImageField = function(el) {
    var s = $(el).parents('span').first();
    s.remove();
  };

  //------------------------------------------------------------------------------
  // Move image attachment block to proper place (after "add another file" link).
  // and detach element not required in DOM.
  $(document).ready(function() {
    // detach input skeleton from the form avoiding posting it
    inputSkeleton = $("#cbp_image_field");
    if (inputSkeleton)
      inputSkeleton.detach();

    // since our form is hooked to all Redmine's pages, detach it always,
    // if it is needed on the page, we will attach it below
    var imageForm = $("#cbp_images_form");
    if (imageForm)
      imageForm.detach();
    else
      return;

    // move image attachment block to proper place
    var addFile;
    var attachFields = $("#attachments_fields");

    if (attachFields && attachFields.length > 0) {
      // Redmine <= 3.3
      addFile = attachFields.next("span.add_attachment");
    }
    else {
      // Redmine >= 3.4
      addFile = $(".attachments_form");
    }

    if (!addFile || addFile.length == 0)
      return;

    addFile.after(imageForm);
  });

}(window.cbImagePaste = window.cbImagePaste || {}, jQuery));

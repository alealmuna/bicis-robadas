angular.module('app.modal', [
])

.run(function() {
  var $overlay = $('div');

  $overlay.prop('id', 'modal-overlay');

  $(window).append($overlay);
})

.factory('modal', [
  '$rootScope',
  function($rootScope)
{
  "use strict";

  var presentedModals = [],
    OVERLAY_ID = 'modal-overlay',
    modal,
    overlay = $('#'+OVERLAY_ID);

  overlay.ready(function()
  {
    overlay = $('#'+OVERLAY_ID);

    overlay
      .on('click', function(e)
      {
        if (e.target.id == OVERLAY_ID) {
          dismissAllModals();
        }
      })
      .on('click', '.modal.background', function(e)
      {
        e.preventDefault();
        e.stopPropagation();

        if ($('.modal.incentives-item').is(':visible')) {
          dismissTopModal(1);
        } else {
          dismissTopModal();
        }
      })
      .on('click', '.modal .crossbutton.close', function(e)
      {
        dismissTopModal();
      })
      .on('click', '.modal.background a', function(e)
      {
        e.preventDefault();
      });
  });

  function presentModal()
  {
    var modals_len = presentedModals.length;

    if (overlay.is(':visible')) {
      var i;

      modal.show().stop().css({
        x: 150,
        scale: 1.06,
        opacity: 0,
        'z-index': '10' + modals_len
      })
      .transition({
        x: 50,
        scale: 1.0,
        opacity: 1
      }, 600, 'easeOutQuart');

      for (i=0; i<modals_len; i++) {
        var thisModal = presentedModals[i],
          left = 100;

        if (thisModal.css('margin-left') == '0px') {
          left = 50;
        }

        var newScale = 1 - modals_len * 0.05;

        thisModal
          .stop()
          .css({'z-index': '10' + modals_len - 1})
          .transition({
            x: '-=' + left,
            scale: newScale
          }, 600, 'easeOutQuart')
          .addClass('background');
      }

      presentedModals.push(modal);

    } else {

      overlay.stop().show().transition({ opacity: 1 }, 600);
      $('#app').addClass('background');
      modal
        .show()
        .stop()
        .css({
          x: 0,
          scale: 1.06,
          opacity: 0
        })
        .transition({
          scale: 1.0,
          opacity: 1
        }, 600, 'easeOutQuart');

      presentedModals.push(modal);
    }
  }

  function dismissTopModal(prevent_broadcast, callback)
  {
    var modals_len = presentedModals.length, i;
    callback = callback || function(){};

    if (!modals_len) {
      callback(false);
      return;
    }

    if (modals_len == 1) {
      _dismissAllModals(prevent_broadcast === true ? 0 : 1, callback);
      return;
    }

    var poppedModal = presentedModals[modals_len - 1],
      nextTopModal = presentedModals[modals_len - 2];

    poppedModal
      .stop()
      .transition({
        x: '+=100',
        scale: 1.06,
        opacity: 0
      }, 600, 'easeOutQuart',
      function() {
        poppedModal.hide().removeAttr('style');
        callback(true);
      });

    presentedModals.pop();
    modals_len = presentedModals.length;

    nextTopModal.removeClass('background');

    for (i=0; i<modals_len; i++) {

      var thisModal = presentedModals[i],
        left = '+=100',
        thisOpacity = 0.9;

      if (modals_len == 1) {
        left = 0;
      }

      if (!thisModal.hasClass('background')) {
        thisOpacity = 1;
      }

      var newScale = 1 - (modals_len - 1) * 0.05;

      thisModal.stop().transition({
        x: left,
        opacity: thisOpacity,
        scale: newScale
      }, 600, 'easeOutQuart');

    }

    if (!prevent_broadcast) {
      $rootScope.$broadcast('modal.close', 1);
    }
  }

  function dismissAllModals()
  {
    _dismissAllModals(true);
  }

  function _dismissAllModals(broadcast, callback)
  {
    callback = callback || function(){};

    if (!presentedModals.length) {
      callback(false);
      return;
    }

    $('.modal')
      .stop()
      .transition({ opacity: 0, scale: '-=0.005' }, 400, 'easeOutQuart', function()
      {
        $('.modal')
          .hide()
          .removeAttr('style')
          .removeClass('background');
          callback(true);
      });
    overlay.stop().transition({ opacity: 0 }, 500, function() {
      overlay.hide();
    });
    $('#app').removeClass('background');

    if (broadcast) {
      $rootScope.$broadcast('modal.close', presentedModals.length);
    }

    presentedModals = [];
  }

  return {
    open: function(classCSS)
    {
      modal = $('.modal.' + classCSS);
      console.log('modal', modal);
      if (!modal.is(':visible')) {
        presentModal();
      }
    },
    close: function(prevent_broadcast, callback)
    {
      dismissTopModal(prevent_broadcast, callback);
    },
    closeAll: function()
    {
      dismissAllModals();
    },
    _closeAll: function()
    {
      _dismissAllModals();
    }
  };
}])

.factory('dialog', [
  '$rootScope',
  '$timeout',
  function($rootScope, $timeout)
{
  "use strict";

  var queuedDialogs = [],
    closing = false,
    dialog,
    overlay = $('#dialog-overlay'),
    offEnterListener;

  function presentDialog() {

    if ($('#dialog-overlay').is(':visible')) {
      // add to queue and then stfu

      if (closing) {
        $timeout(presentDialog, 100);
      } else {
        queuedDialogs.push(dialog);
      }

    } else {
      $('#app').addClass('background');
      $('#modal-overlay').addClass('background');
      overlay.removeAttr('style').show().transition({ opacity: 1 }, 500);
      dialog
        .show()
        .stop()
        .css({
          scale: 0.7,
          opacity: 0
        })
        .transition({
          scale: 1.0,
          opacity: 1
        }, 500, 'easeOutQuart');

      offEnterListener = $rootScope.$on('key.enter', function()
      {
        $('.dialog:visible .default').click();
      });
    }
  }

  function dismissDialog(callback) {

    if (queuedDialogs.length > 0) {
      dialog = queuedDialogs[0];
      queuedDialogs.shift();

      dialog
        .show()
        .stop()
        .css({
          scale: 0.7,
          opacity: 0
        })
        .transition({
          scale: 1.0,
          opacity: 1
        }, 500, 'easeOutQuart');

      // have queue, dismiss top, present next
    } else if ($('.dialog').is(':visible')) {
      closing = true;
      // dismiss overlay and all
      $('.dialog').stop().transition({opacity:0, scale:1.10}, 200, function() {
        $('.dialog').hide().removeAttr('style');
      });

      offEnterListener();
      overlay.transition({ opacity: 0 }, 500, function() {
        callback();
        overlay.hide().removeAttr('style');
        closing = false;
      });
      $('#modal-overlay').removeClass('background');

      if (!$('#modal-overlay').is(':visible')) {
        $('#app').removeClass('background');
      }
    }
  }

  return {
    open: function(classCSS)
    {
      dialog = $('.dialog.' + classCSS);
      if (!dialog.is(':visible')) {
        presentDialog();
      }
    },
    close: function(cb)
    {
      dismissDialog(function(){
        if (cb) {
          cb();
        }
      });
    },
    cancel: function()
    {
      dismissDialog(function()
      {
        $rootScope.$broadcast('dialog.close');
      });
    }
  };
}])

.factory('photoStage', [
  '$rootScope',
  '$window',
  function($rootScope, window)
{
  var stage, $window = $(window),
    overlay = $('#photo-overlay'),
    on = false;

  overlay.ready(function()
  {
    overlay = $('div#photo-overlay.overlay');
    stage = $('#photo-stage');

    overlay
      .on('click', function(e)
      {
        if (e.target.id == 'photo-overlay') {
          dismissPhoto();
        }
      });
  });

  function adjustPhotoStage() {
    var newLineHeight = $window.height() - 40;
    stage.css({ 'line-height' : newLineHeight + 'px' });
  }

  function dismissPhoto() {
    _dismissPhoto(true);
  }

  function _dismissPhoto(broadcast) {
    if (!on) {
      return;
    }

    overlay.hide();
    on = false;

    if (broadcast) {
      $rootScope.$broadcast('photoStage.close');
    }
    $window.unbind('resize');
  }

  function presentPhoto() {
    adjustPhotoStage();
    $window.resize(function()
    {
      adjustPhotoStage();
    });
    overlay.show();
    on = true;
  }

  return {
    open: function()
    {
      presentPhoto();
    },
    close: function()
    {
      dismissPhoto();
    },
    _close: function()
    {
      _dismissPhoto();
    }
  };
}])

.factory('customDialog', [
  'dialog',
  function(dialog)
  {
    var container;

    function getButton(button) {
      var html = $('<a class="textbutton"></a>');

      if (!button || !button.text) {
        return '';
      }

      html.html(button.text);

      if (button.class) {
        html.addClass(button.class);
      }

      if (button.callback) {
        html.on('click', button.callback);
      }

      return html;
    }

    return {
      open: function(options)
      {
        var html = '';

        if (!container) {
          container = $('#customDialog');
        }

        if (options.title) {
          html += '<h3>'+options.title+'</h3>';
        }

        if (options.message) {
          html += '<p>'+options.message+'</p>';
        }

        container.html(html);

        if (options.buttons) {
          var len = options.buttons.length, i;

          for (i=0; i<len; i++) {
            container.append(getButton(options.buttons[i]));
          }
        }

        dialog.open('customDialog');
      },
      close: function()
      {
        dialog.close();
      }
    };
  }
])

.factory('Confirm', [
  '$q',
  'dialog',
  function($q, dialog)
{
  "use strict";

  var $confirm, $okButton, $cancelButton,

  default_options = {
    ok: 'OK',
    cancel: 'cancel',
    title: 'Confirm',
    message: 'Are you sure?'
  },

  Confirm = {
    open: function(options) {
      getElements();

      if ($confirm.is(':visible')) {
        // show error
        return;
      }

      var deferred = $q.defer();
      options = $.extend({}, default_options, options);

      // replace text
      replaceText(options);

      // listen buttons
      $okButton.on('click', '', function(e)
      {
        deferred.resolve();
        dialog.close(function() {
          replaceText(default_options);
        });
      });

      $cancelButton.on('click', '', function(e)
      {
        deferred.reject(e);
        dialog.close(function() {
          replaceText(default_options);
        });
      });

      dialog.open('confirm');

      return deferred.promise;
    }
  };

  function replaceText(opts) {
    getElements();

    $okButton.text(opts.ok);
    $cancelButton.text(opts.cancel);
    $('#confirm-title', $confirm).text(opts.title);
    $('#confirm-message', $confirm).text(opts.message);
  }

  function getElements()
  {
    $confirm = $confirm || $('#confirm');
    $okButton = $okButton || $('#confirm-ok', $confirm);
    $cancelButton = $cancelButton || $('#confirm-cancel', $confirm);
  }

  getElements();
  return Confirm;

}])

.factory('GhostFeedback', function()
{
  "use strict";

  var $ghostFeedback,

  timer,

  default_options = {
    title: 'Something happened',
    message: '',
    timeout: 2500,
    parentElement: $('body')
  },

  GhostFeedback = {
    open: function(options) {
      getElements();

      if ($ghostFeedback.is(':visible')) {
        // show error
        return;
      }

      options = $.extend({}, default_options, options);

      // replace text
      replaceText(options);

      $ghostFeedback.on('click', '', function(e)
      {
        $ghostFeedback.fadeOut();
      }).fadeIn();

      setTimer(options);

      $ghostFeedback.hover(function()
      {
        clearTimeout(timer);
      }, function() {
        setTimer(options);
      });
    }
  };

  function setTimer(options) {
    timer = setTimeout(function() {
      $ghostFeedback.fadeOut();
    }, options.timeout);
  }

  function replaceText(opts) {
    getElements();

    $('#ghost-feedback p.title').text(opts.title);

    if (opts.message !== '') {
      $('#ghost-feedback p.message').show().text(opts.message);
    } else {
      $('#ghost-feedback p.message').hide();
    }
  }

  function getElements()
  {
    $ghostFeedback = $ghostFeedback || $('#ghost-feedback');
  }

  getElements();
  return GhostFeedback;

});

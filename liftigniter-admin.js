
(function($) {
  Drupal.behaviors.liftIgniterAdmin = {
    attach: function liftIgniterAdmin(context, settings) {

      /**
       * Use API within Drupal admin form. TEMPORARY.
       */
      $p('getWidgetNames', {
        callback: function(widgets) {
          $elm = $('.form-item-liftigniter-widget-blocks .description').append(
            widgets.join(', ')
          );
        }
      });

    }
  };
})(jQuery);

/**
 * Admin behavior for LiftIgniter.
 */

/* globals jQuery, $p */

(function($) {
  Drupal.behaviors.liftIgniterAdmin = {
    attach: function liftIgniterAdmin(context) {

      // Ajax protection.
      if (context !== document) {
        return;
      }

      /**
       * Use API within Drupal admin form. TEMPORARY.
       */
      $p('getWidgetNames', {
        callback: function(widgets) {
          $('.form-item-liftigniter-widget-blocks .description').append(
            widgets.join(', ')
          );
        }
      });

    }
  };
})(jQuery);

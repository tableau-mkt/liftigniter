/**
 * Access the Lift Igniter API for widgets in Drupal.
 *
 * Resources:
 *   http://www.liftigniter.com/liftigniter-javascript-sdk-docs-1-1
 *   https://github.com/janl/mustache.js
 */

/* jshint loopfunc:true, forin:false */
/* globals $p */

(function($) {
  Drupal.behaviors.liftIgniter = {
    attach: function liftIgniter(context, settings) {

      var prefix = '#li-recommendation-',
          widgets = (settings.liftIgniter) ? settings.liftIgniter.widgets : [],
          fetched;

      // Ajax protection.
      if (context !== document) {
        return;
      }

      // Register all widgets for API fetching.
      for (var i in widgets) {
        (function(index) {

          $p('register', {
            // @todo Per widget item number setting within block admin.
            max: 5,
            widget: widgets[index],
            callback: function(responseData) {
              var template = $('script' + prefix + widgets[index])[0].innerHTML,
                  $element = $('div' + prefix + widgets[index]);

              if (responseData.items && responseData.items.length) {
                $element[0].style.visibility = 'hidden';
                $element[0].innerHTML = $p('render', template, responseData);
                $element.css('visibility','visible').hide().fadeIn("slow");
              }
            }
          });

          // Execute all the registered widgets, possible scroll delay.
          if (typeof $.waypoints !== 'undefined' && settings.liftIgniter.useWaypoints) {
            $('#block-liftigniter-' + widgets[index]).waypoint(function() {
                if (!fetched) {
                  $p('fetch');
                  fetched = true;
                }
              }, {
              offset:'100%',
              triggerOnce:true
            });
          }
          else {
            $p('fetch');
          }

        })(i);
      }

    },

    /**
     * Obtain a list of available widgets, for admin.
     *
     * @return {array}
     */
    getWidgets: function getWidgets() {
      $p('getWidgetNames', {
        callback: function(widgets) {
          return widgets;
        }
      });
    }
  };
})(jQuery);

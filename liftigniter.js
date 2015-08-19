/**
 * Access the Lift Igniter API for widgets in Drupal.
 *
 * Resources:
 *   http://www.liftigniter.com/liftigniter-javascript-sdk-docs-1-1
 *   https://github.com/janl/mustache.js
 */

(function($) {
  Drupal.behaviors.liftIgniter = {
    attach: function liftIgniter(context, settings) {

      var prefix = '#li-recommendation-',
          widgets = settings.liftIgniter.widgets,
          waypoints = [];

      // Ajax protection.
      if (context !== document) return;

      // Register all widgets for API fetching.
      for (var i in widgets) {
        $p('register', {
          // @todo Per widget item number setting within block admin.
          max: 5,
          widget: widgets[i],
          callback: function(responseData) {
            var template = $('script' + prefix + widgets[i])[0].innerHTML,
                $element = $('div' + prefix + widgets[i]);

            $element[0].style.display = 'none';
            $element[0].innerHTML = $p('render', template, responseData);
            $element.fadeIn();
          }
        });

    //
    //  if (typeof Waypoint !== 'undefined') {
    //    waypoint.push(new Waypoint({
    //      element: $('#block-liftigniter-' + widgets[i]),
    //      handler: function(direction) {
    //        console.log('Waypoint reached. Getting recommendations.');

        $p('fetch');

    //      }
    //    }));
    //  }
      }

      if (typeof Waypoint === 'undefined') {
        // Execute all the registered widgets.
        $p('fetch');
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
  }
})(jQuery);

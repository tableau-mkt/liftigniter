/**
 * Access the Lift Igniter API for widgets in Drupal.
 *
 * Resources:
 *   http://www.liftigniter.com/liftigniter-javascript-sdk-docs-1-1
 *   https://github.com/janl/mustache.js
 */

(function($, $p) {
  Drupal.behaviors.liftIgniter = {
    attach: function liftIgniterDrupal(context, settings) {

      var listPrefix = '#li-recommendation-',
          waypoint;

      // Ajax protection.
      if (context !== document) return;

      /**
       * Render API return results for display.
       */
      function render(delta, response) {
        var el = $(listPrefix + delta);
            template = $(listPrefix + delta).innerHTML;
        // Basically Mustache.render(template, resp);
        el.innerHTML = $p('render', template, response);

console.log(JSON.stringify(response, null, 2));

      }

      // Register all widgets for API fetching.
      for (w in settings.liftIgniter.widgets) {
        $p('register', {
          // @todo Per widget item number setting within block admin.
          max: 5,
          widget: settings.liftIgniter.widgets[w],
          callback: render(settings.liftIgniter.widgets[w], response)
        );
      }

      if (typeof Waypoint !== 'undefined') {
        waypoint = new Waypoint({
          element: $('#block-liftigniter-' + settings.liftIgniter.widgets[w]),
          handler: function(direction) {

console.log('Waypoint reached. Getting recommendations.');

            $p('fetch');

          }
        })
      }
      else {
        // Execute the registered widgets just once.
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
})(jQuery, $p);

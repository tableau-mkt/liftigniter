/**
 * Access the Lift Igniter API for widgets in Drupal.
 *
 * Resources:
 *   http://www.liftigniter.com/liftigniter-javascript-sdk-docs-1-1
 *   https://github.com/janl/mustache.js
 */

(function($, $p) {
  Drupal.behaviors.liftIgniter = {
    attach: function liftIgniter(context, settings) {

      var prefix = '#li-recommendation-',
          widgets = settings.liftIgniter.widgets,
          waypoints = [];

      // Ajax protection.
      if (context !== document) return;

      // Register all widgets for API fetching.
      for (w in widgets) {
        $p('register', {
          // @todo Per widget item number setting within block admin.
          max: 5,
          widget: widgets[w],
          callback: function(response) {
            var template = $('script' + prefix + widgets[w])[0].innerHTML;

response.master = 'craps';
console.log(template);
console.log(response);
console.log($p('render', "<h1>{{master}}</h1>", {master: 'thing'}));

            $('div' + prefix + widgets[w])[0].innerHTML = $p('render', template, response);
          }
        });
      }

      // if (typeof Waypoint !== 'undefined') {
        // waypoint.push(new Waypoint({
        //   element: $('#block-liftigniter-' + settings.liftIgniter.widgets[w]),
        //   handler: function(direction) {

// console.log('Waypoint reached. Getting recommendations.');

      $p('fetch');

        //   }
        // }));
      // }
      // else {
        // Execute the registered widgets just once.
      //   $p('fetch');
      // }
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

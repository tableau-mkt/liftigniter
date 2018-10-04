/**
 * Access the LiftIgniter API for widgets in Drupal.
 *
 * Resources:
 *   http://www.liftigniter.com/liftigniter-javascript-sdk-docs-1-1
 *   https://github.com/janl/mustache.js
 */

/* jshint loopfunc:true, forin:false */
/* globals $p */

(function($, Drupal) {

  var listIdPrefix = 'li-recommendation-',
      blockIdPrefix = 'block-liftigniter-widget-';

  /**
   * Page load behavior.
   */
  drupalSettings.liftIgniter = {
    attach: function liftIgniter(context, settings) {
      // Ajax protection.
      if (context !== document) {
        return;
      }

      var config = settings.liftIgniter,
          widgets = (config && config.widgets) ? config.widgets : {},
          langData = (settings.dataLayer) ? settings.dataLayer.languages : {},
          defaultLang = (settings.dataLayer) ? settings.dataLayer.defaultLang : false,
          langPrefix = settings.pathPrefix.match(/^\w+-\w+\/$/),
          options = {},
          fetched;

      // Add main transform callback, allow external.
      settings.liftIgniter.transformCallbacks.push(
        drupalSettings.liftIgniter.basicTransforms
      );

      /**
       * Register widget request and render results.
       *
       * @param {string} key
       * @param {object} widget
       * @param {object} options
       */
      function widgetRequestRender(key, widget, options) {
        var configs = drupalSettings.liftIgniter;

        $p('register', {
          max: parseInt(widget.max, 10) || 5,
          widget: key,
          opts: options,
          callback: function(responseData) {
            var template = $('script#' + listIdPrefix + key).html(),
                $element = $('div#' + listIdPrefix + key);

            // Items to work with.
            if ($element.length && responseData.items && responseData.items.length) {
              // Perform transformations.
              for (var t in configs.transformCallbacks) {
                configs.transformCallbacks[t](responseData, key);
              }

              // Render the data.
              $element.css('visibility','hidden');
              $element.html($p('render', template, responseData));
              $element.css('visibility','visible').hide().fadeIn('fast');

              // Add standard tracking. Helps improve quality.
              $p('track', {
                elements: document.querySelectorAll('#' + listIdPrefix + key + ' .recommended__item'),
                name: key,
                source: 'LI',
                _debug: false
              });
            }
          }
        });
      }

      // Cross widget details.
      if (widgets && config.fields) {
        $p('setRequestFields', config.fields);
        // Require that requested fields are present.
        $p('setRequestFieldsAON', true);
      }

      // Use language options.
      if (config.useLang) {
        // Prefix is present.
        if (langPrefix !== null) {
          // Find language code.
          langPrefix = langPrefix[0].slice(0, settings.pathPrefix.length -1);
          for (var lang in langData) {
            if (langData.hasOwnProperty(lang) && langData[lang].prefix && langData[lang].prefix === langPrefix) {
              options = {'rule_language': langData[lang].language};
              break;
            }
          }
        }
        else if (config.langDefaultNoPrefix && defaultLang) {
          // Use default language.
          options = {'rule_language': defaultLang};
        }
      }

      // Register all widgets for API fetching.
      for (var i in widgets) {
        if (widgets.hasOwnProperty(i)) {

          (function(widgetKey) {
            var widget = widgets[widgetKey];

            // Register widget request and render results.
            widgetRequestRender(widgetKey, widget, options);

            // Execute all the registered widgets, possible scroll delay.
            if (typeof $.fn.waypoint !== 'undefined' && config.useWaypoints) {
              $('#' + blockIdPrefix + widgetKey).waypoint(function() {
                if (!fetched) {
                  $p('fetch');
                  fetched = true;
                }
              }, {offset: '100%', triggerOnce: true});
            }
            else {
              $p('fetch');
            }
          })(i);

        }
      }
    },

    /**
     * Obtain a list of available widgets, for admin.
     *
     * @return {array}
     */
    getWidgets: function() {
      $p('getWidgetNames', {
        callback: function(widgets) {
          return widgets;
        }
      });
    },

    /**
     * Allow adjusting data after response, proxy function.
     *
     * @param {object} data
     * @return {object}
     */
    basicTransforms: function(data, key) {
      // Force current protocol.
      if (drupalSettings.liftIgniter.forceSameProtocol) {
        for (var i in data.items) {
          data.items[i].url = data.items[i].url.replace(/http(s*):/, window.location.protocol);
        }
      }

      // @todo Add option to force baseUrl.
    }

  };

})(jQuery, Drupal);

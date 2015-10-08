/**
 * Access the LiftIgniter API for widgets in Drupal.
 *
 * Resources:
 *   http://www.liftigniter.com/liftigniter-javascript-sdk-docs-1-1
 *   https://github.com/janl/mustache.js
 */

/* jshint loopfunc:true, forin:false */
/* globals $p */

(function($) {

  var listIdPrefix = 'li-recommendation-',
      blockIdPrefix = 'block-liftigniter-widget-';

  /**
   * Page load behavior.
   */
  Drupal.behaviors.liftIgniter = {
    attach: function liftIgniter(context, settings) {
      // Ajax protection.
      if (context !== document) {
        return;
      }

      var config = settings.liftIgniter,
          widgets = (config && config.widgets) ? config.widgets : {},
          langData = (settings.dataLayer) ? settings.dataLayer.languages : {},
          options = {},
          langPrefix,
          fetched;

      // Add main transform callback, allow external.
      settings.liftIgniter.transformCallbacks.push(
        Drupal.behaviors.liftIgniter.basicTransforms
      );

      /**
       * Register widget request and render results.
       *
       * @param {string} key
       * @param {object} widget
       * @param {object} options
       */
      function widgetRequestRender(key, widget, options) {
        var configs = Drupal.settings.liftIgniter,
            transComplete = [];

        $p('register', {
          max: parseInt(widget.max) || 5,
          widget: key,
          opts: options,
          callback: function(responseData) {
            var template = $('script#' + listIdPrefix + key).html(),
                $element = $('div#' + listIdPrefix + key);

            // Things to work with.
            if ($element.length && responseData.items && responseData.items.length) {
              // Collect a list of promises.
              for (var t in configs.transformCallbacks) {
                transComplete.push(configs.transformCallbacks[t](responseData, key));
              }
              // Allow any number of post-response transforms.
              $.when.apply($, transComplete).then(function render(data) {
                // Render the data.
                $element.css('visibility','hidden');
                $element.html($p('render', template, data));
                $element.css('visibility','visible').hide().fadeIn('fast');

              }, function failed() {
                if (window.console && console.log) {
                  console.log(Drupal.t('Problem processing liftIgniter data'));
                }
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

      // Setup language option.
      if (config.useLang && settings.pathPrefix) {
        langPrefix = settings.pathPrefix.match(/^\w+-\w+\/$/)[0].slice(0, settings.pathPrefix.length -1);
        // Find language code.
        for (var lang in langData) {
          if (langData.hasOwnProperty(lang) && langData[lang].prefix && langData[lang].prefix === langPrefix) {
            options = {'rule_language': langData[lang].language};
            break;
          }
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
            if (typeof $.waypoints !== 'undefined' && config.useWaypoints) {
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
    getWidgets: function getWidgets() {
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
    basicTransforms: function basicTransforms(data, key) {
      var def = $.Deferred(),
          links = data.items,
          n;

      // Force current protocol.
      if (Drupal.settings.liftIgniter.forceSameProtocol) {
        for (n in links) {
          links[n].url = links[n].url.replace(/http(s*):/, window.location.protocol);
        }
      }

      // @todo Add option to force baseUrl.

      // Add analysis params to links.
      for (n in links) {
        links[n].url = links[n].url + '?__src=liftigniter&__widget=' + key;
        // Hand data off to next transform.
        if (parseInt(n) === links.length - 1) {
          def.resolve(data);
        }
      }
      return def.promise();
    }

  };

})(jQuery);

/**
 * Access the LiftIgniter API for widgets in Drupal.
 *
 * Resources:
 *   http://www.liftigniter.com/liftigniter-javascript-sdk-docs-1-1
 *   https://github.com/janl/mustache.js
 */

/* jshint loopfunc:true, forin:false */
/* globals $p */

if (typeof $igniter_var === 'undefined') {
  // Ensures that our client code is updated.
  (function(w,d,s,p,v,e,r) {"use strict";w.$ps = (w.performance && w.performance.now && typeof(w.performance.now) == "function") ? w.performance.now() : undefined;
    w['$igniter_var']=v;w[v]=w[v]||function(){(w[v].q=w[v].q||[]).push(arguments)};
    w[v].l=1*new Date();e=d.createElement(s),r=d.getElementsByTagName(s)[0];e.async=1;
  e.src=p+'?ts='+(+new Date()/3600000|0);
  r.parentNode.insertBefore(e,r)})(window,document,'script','//' + drupalSettings.liftIgniter.jsURL,'$p');

  $p("init", drupalSettings.liftIgniter.apiKey);
  $p("send", "pageview");
}

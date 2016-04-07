/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
  });

  app.import("vendor/bootstrap.css");
  app.import("vendor/AdminLTE.css");
  app.import("vendor/skin-purple-light.min.css");

  return app.toTree();
};

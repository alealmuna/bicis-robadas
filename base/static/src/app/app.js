angular.module('app', [
  // Required
  'ui.router',
  'templates-app',
  'app.mapbox',

  // Application
  'app.models',
  'app.map',
  'app.info',
  'app.report',

  // Utilities
  'app.utils'
])

.config(function($locationProvider, $stateProvider)
{
  "use strict";

  $stateProvider.state('home', {
    url: "/"
  });

  $locationProvider.html5Mode(true);
})

.controller('AppCtrl', [
function()
{
  "use strict";
}]);

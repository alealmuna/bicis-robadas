angular.module('app.report', [])

.config(function($stateProvider)
{
  "use strict";

  $stateProvider.state('report', {
    url: "/report",
    views: {
      'modal': {
        templateUrl: 'report/report.tpl.html',
        controller: 'ReportCtrl'
      }
    }
  });
})

.controller('ReportCtrl', [
'$scope',
'$stateParams',
'$location',
'$timeout',
'Report',
function($scope, $stateParams, $location, $timeout, Report)
{
  "use strict";
}]);

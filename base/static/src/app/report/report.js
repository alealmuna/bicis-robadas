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
'$state',
'$timeout',
'Report',
'$modal',
function($scope, $stateParams, $state, $timeout, Report, $modal)
{
  "use strict";

  $modal.open();
  $scope.report = {};
  $scope.map_options = {
    code: 'radutzan.hc57i6lj',
    center: {
      lat: -33.44,
      lng: 289.34
    },
    zoom: 17,
    locate: 'auto',
    onMarkerDrop: function(marker, latLng) {
      console.log('onMarkerDrop', latLng);
    }
  };

  $scope.$on('$modal.close', function(e) {
    $state.go('home');
  });

  $scope.$on('$destroy', function() {
    $modal.close();
  });

  $scope.save = function() {
    $scope.loading = true;
    console.log('tu reporte:', $scope.report);
  };
}]);

angular.module('app.info', [])

.config(function($stateProvider)
{
  "use strict";

  $stateProvider.state('info', {
    url: "/report/:id",
    templateUrl: 'info/info.tpl.html',
    controller: 'InfoCtrl'
  });
})

.controller('InfoCtrl', [
'$scope',
'$state',
'$stateParams',
'$timeout',
'Report',
function($scope, $state, $stateParams, $timeout, Report)
{
  "use strict";

  // Controller's variables ----------------------------------------------------
  var offInclude,
    ACTIVE_CLASS = 'active',
    $aside = $('aside');

  // $scope's variables --------------------------------------------------------
  $scope.report = false;
  $scope.error = false;

  // Initialize ----------------------------------------------------------------
  function init() {
    show();

    Report.getById($stateParams.id).then(function(report) {
      $scope.report = report;
    }, function(e) {
      $scope.error = e;
    });
  }

  // Listeners -----------------------------------------------------------------
  $scope.$on('$destroy', hide);

  offInclude = $scope.$on('$viewContentLoaded', function() {
    $aside = $('aside');
    show();
    offInclude();
  });

  // $scope's Functions --------------------------------------------------------
  $scope.close = function(e) {
    e.preventDefault();
    hide();

    $timeout(function() {
      $state.go('home');
    }, 500);
  };

  // Controller's functions ----------------------------------------------------
  function hide() {
    $aside.removeClass(ACTIVE_CLASS);
  }

  function show() {
    $timeout(function() {
      if (!$aside.hasClass(ACTIVE_CLASS)) {
        $aside.addClass(ACTIVE_CLASS);
      }
    });
  }

  init();
}]);

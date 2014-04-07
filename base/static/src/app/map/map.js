angular.module('app.map', [])

.controller('MapCtrl', [
'$scope',
'$state',
'Marker',
function($scope, $state, Marker)
{
  "use strict";

  $scope.tpl = 'map/map.tpl.html';
  $scope.map_options = {
    //code:  'eseceve.hhdjp6g6',
    code: 'radutzan.hc57i6lj',
    center: {
      lat: -33.44,
      lng: 289.34
    },
    zoom: 12,
    locate: true,
    marker_icon: L.mapbox.marker.icon({
      'marker-symbol': 'post',
      'marker-color': '0044FF'
    }),
    onChangeView: function(e, bounds) {
      //getMarkers();
    },
    onMarkerClick: function(a) {
      $state.go('info', {id: a.target.$id});
    }
  };

  getMarkers();

  function getMarkers(southWest, northEast)
  {
    if (southWest && southWest.getSouthWest) {
      var NE = southWest.getNorthEast(),
        SW = southWest.getSouthWest();

      northEast = [NE.lat, NE.lng];
      southWest = [SW.lat, SW.lng];
    }

    Marker.get(southWest, northEast).then(function(markers) {
      $scope.markers = markers;
    });
  }
}]);

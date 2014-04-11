angular.module('app.directives', [
  'app.modal'
])

.directive('mapBox', function() {
  return {
    restrict: 'A',
    controller: 'MapBoxCtrl',
    scope: true
  };
})

.directive('mapBoxLocation', function(){
  return {
    restrict: 'A',
    controller: 'MapBoxLocationCtrl',
    scope: true
  };
})

.controller('MapBoxCtrl', [
'$scope',
'$element',
'$attrs',
'$timeout',
function($scope, $element, $attrs, $timeout)
{
  "use strict";

  // Controller's variables ----------------------------------------------------
  var map, config, last_zoom_level, markers;

  config = {
    code: 'examples.map-9ijuk24y',
    map_options: {
      detectRetina: true,
      // retinaVersion: 'examples.map-zswgei2n'
      format: 'jpg70'
      // scrollWheelZoom: false
    },
    center: {
      lat: -37.82,
      lng: 175.215
    },
    zoom: 14,
    id: $element.attr('id') || 'map',
    marker_icon: L.mapbox.marker.icon({
      //'marker-symbol': 'post',
      'marker-color': '0044FF'
    }),
    locate: false,

    // callbacks
    onReady: angular.noop,
    onChangeView: angular.noop,
    onMarkerClick: angular.noop,

    emptyIcon: L.icon({
      iconUrl: 'emptyMarker.png',
      iconRetinaUrl: 'emptyMarker.png',
      iconSize: [1, 1],
      iconAnchor: [0, 0],
      popupAnchor: [0, -10],
      shadowUrl: 'emptyMarker.png',
      shadowRetinaUrl: 'emptyMarker.png',
      shadowSize: [0, 0],
      shadowAnchor: [0, 0]
    })
  };

  // Listeners -----------------------------------------------------------------
  $scope.$watch($attrs.mapBox, function (new_options) {
    if (new_options && !map) {
      config = $.extend({}, config, new_options);
      last_zoom_level = config.zoom;

      map = L.mapbox.map(config.id, config.code, config.map_options)
        .setView([config.center.lat, config.center.lng], config.zoom);

      map.whenReady(function(e) {
        config.onReady(e, map.getBounds());

        map
          .on('zoomend', function(e){
            var current_zoom = map.getZoom();

            if (last_zoom_level < current_zoom) {
              config.onChangeView(e, map.getBounds());
            }
            last_zoom_level = current_zoom;
          })
          .on('dragend', function(e){
            config.onChangeView(e, map.getBounds());
          });

          markers = new L.MarkerClusterGroup();
          map.addLayer(markers);
      });

      if (config.locate) {
        L.control.locate().addTo(map);

        if (config.locate === 'auto') {
          map.locate({
            setView: true,
            maxZoom: config.zoom
          });
        }
      }
    }
  });

  $scope.$watch($attrs.mapBoxMarkers, function (new_markers) {
    if (new_markers && new_markers.length && map) {
      setMarkers(new_markers);
    }
  });

  // Controller's functions ----------------------------------------------------
  function setMarkers(list) {

    var marker, icon_type;
    markers.clearLayers();

    _.each(list, function(item, i) {
      icon_type = 'camera';

      marker = L.marker(new L.LatLng(item.lat, item.lng), {
        icon: L.mapbox.marker.icon({
          'marker-symbol': icon_type, 'marker-color': '6139B8'
        }),
        title: ''
      });

      marker.$id = item.id;
      marker.on('click', config.onMarkerClick);
      markers.addLayer(marker);
    });
  }
}])

.controller('MapBoxLocationCtrl', [
'$scope',
'$element',
'$attrs',
'$timeout',
function($scope, $element, $attrs, $timeout) {

  "use strict";

  // Controller's variables ----------------------------------------------------
  var map, config, marker;

  config = {
    code: 'examples.map-9ijuk24y',
    map_options: {
      detectRetina: true,
      // retinaVersion: 'examples.map-zswgei2n'
      format: 'jpg70'
      // scrollWheelZoom: false
    },
    center: {
      lat: -37.82,
      lng: 175.215
    },
    zoom: 14,
    id: $element.attr('id') || 'map-location',
    marker_icon: L.mapbox.marker.icon({
      'marker-color': '0044FF'
    }),
    locate: true,

    // callbacks
    onReady: angular.noop,
    onMarkerDrop: angular.noop
  };

  // Listeners -----------------------------------------------------------------
  $scope.$watch($attrs.mapBoxLocation, function (new_options) {
    if (new_options && !map) {
      config = $.extend({}, config, new_options);

      map = L.mapbox.map(config.id, config.code, config.map_options)
        .setView([config.center.lat, config.center.lng], config.zoom);

      map.whenReady(function(e) {
        config.onReady(e, map.getBounds());

        marker = L.marker(new L.LatLng(config.center.lat, config.center.lng),
        {
          icon: config.marker_icon,
          draggable: true
        });

        map.on('locationfound', function(e) {
          marker.setLatLng(e.latlng);
          config.onMarkerDrop(marker, marker.getLatLng());
        });

        marker.addTo(map);
        marker.on('dragend', function() {
          config.onMarkerDrop(marker, marker.getLatLng());
        });
      });

      if (config.locate) {
        L.control.locate().addTo(map);

        if (config.locate === 'auto') {
          map.locate({
            setView: true,
            maxZoom: config.zoom
          });
        }
      }
    }
  });
}]);

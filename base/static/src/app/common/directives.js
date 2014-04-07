angular.module('app.mapbox', [
])

.controller('MapBoxCtrl', [
  '$scope',
  '$element',
  '$attrs',
  '$timeout',
  '$interpolate',
  '$templateCache',
  '$compile',
  function MapBoxCtrl($scope, $element, $attrs, $timeout, $interpolate, $templateCache, $compile)
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
      'marker-symbol': 'post',
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

  // $scope's variables --------------------------------------------------------

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
        //L.control.locate().addTo(map);

        if (config.locate === 'auto') {
          $timeout(function() {
            console.log('DONDE ESTAS?');
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

  // $scope's Functions --------------------------------------------------------

  // Controller's functions ----------------------------------------------------
  function getHTML(template, data)
  {
    return $interpolate($templateCache.get(template))(data);
  }

  function setMarkers(list) {

    var marker, html, icon_type;
    html = $templateCache.get(config.markerPopupTemplate);
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

.directive('mapBox', function() {
  return {
    restrict: 'A',
    controller: 'MapBoxCtrl',
    scope: true
  };
});

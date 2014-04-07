angular.module('app.models', [

])

.factory('Report', [
  '$q',
  '$timeout',
  function($q, $timeout)
{
  "use strict";

  var Report = {
    getById: function(id)
    {
      var deferred = $q.defer();

      $timeout(function() {

        if (id > 20) {
          deferred.reject('500');
        } else {
          deferred.resolve(fake_report[0]);
        }
      }, 1000);

      return deferred.promise;
    },
    getAll: function(coords)
    {

    }
  };

  var fake_report = [{
    pk: 1,
    model: "thefts.report",
    fields: {
      bike_specs: "mini azul bien azikalá",
      police_report_filled: false,
      lock_type: 1,
      created_at: "2014-01-22T14:52:23.666Z",
      updated_at: null,
      found_details: 'Vino un señor a mi casa y me dijo: "Buenos días, buenas tardes, aquí está su bicicleta"',
      unseen_time: 30,
      circumstances: "Estaba comiendome un melón con cerdo y me la pelaron",
      location: "POINT (-70.6537735363792478 -33.4429281728110155)",
      date: "2014-01-20T14:52:23.666Z",
      found: true,
      bike_price: 350000,
      with_violence: false,
      user: 1
    }
  }];

  return Report;
}])

.factory('Marker', [
'$q',
'$timeout',
function($q, $timeout) {

  var Marker = {
    get: function(southWest, northEast) {
      var deferred = $q.defer();

      $timeout(function() {
        deferred.resolve(FAKE);
      }, 1000);
      // deferred.resolve();
      // deferred.reject();

      return deferred.promise;
    }
  };

  var FAKE = [{
    lat: -33.44456,
    lng: 289.3487,
    id: 1
  }, {
    lat: -33.44456,
    lng: 289.348457,
    id: 2
  }, {
    lat: -33.44657,
    lng: 289.34987,
    id: 3
  }, {
    lat: -33.44656,
    lng: 289.349,
    id: 4
  }, {
    lat: -33.44987,
    lng: 289.34765,
    id: 5
  }, {
    lat: -33.4412,
    lng: 289.34321,
    id: 6
  }, {
    lat: -33.4432,
    lng: 289.34123,
    id: 7
  }, {
    lat: -33.451431,
    lng: 289.34123,
    id: 8
  }, {
    lat: -33.443213,
    lng: 289.34123,
    id: 9
  }, {
    lat: -33.4454,
    lng: 289.34765,
    id: 10
  }];

  return Marker;
}]);

'use strict';

//Ciudades service used for communicating with the ciudades REST endpoints
angular.module('ciudades').factory('Ciudades', ['$resource',
  function ($resource) {
    return $resource('api/ciudades/:ciudadId', {
      ciudadId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

// Setting up route
angular.module('ciudades').config(['$stateProvider',
  function ($stateProvider) {
    // Ciudades state routing
    $stateProvider
      .state('ciudades', {
        abstract: true,
        url: '/ciudades',
        template: '<ui-view/>'
      })
      .state('ciudades.list', {
        url: '',
        templateUrl: 'modules/ciudades/client/views/list-ciudades.client.view.html'
      })
      .state('ciudades.create', {
        url: '/create',
        templateUrl: 'modules/ciudades/client/views/create-ciudad.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('ciudades.view', {
        url: '/:ciudadId',
        templateUrl: 'modules/ciudades/client/views/view-ciudad.client.view.html'
      })
      .state('ciudades.edit', {
        url: '/:ciudadId/edit',
        templateUrl: 'modules/ciudades/client/views/edit-ciudad.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

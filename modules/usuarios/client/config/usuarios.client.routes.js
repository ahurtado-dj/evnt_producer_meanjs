'use strict';

// Setting up route
angular.module('usuarios').config(['$stateProvider',
  function ($stateProvider) {
    // Usuarios state routing
    $stateProvider
      .state('usuarios', {
        abstract: true,
        url: '/usuarios',
        template: '<ui-view/>'
      })
      .state('usuarios.list', {
        url: '',
        templateUrl: 'modules/usuarios/client/views/list-usuarios.client.view.html'
      })
      .state('usuarios.create', {
        url: '/create',
        templateUrl: 'modules/usuarios/client/views/create-usuario.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('usuarios.view', {
        url: '/:usuarioId',
        templateUrl: 'modules/usuarios/client/views/view-usuario.client.view.html'
      })
      .state('usuarios.edit', {
        url: '/:usuarioId/edit',
        templateUrl: 'modules/usuarios/client/views/edit-usuario.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

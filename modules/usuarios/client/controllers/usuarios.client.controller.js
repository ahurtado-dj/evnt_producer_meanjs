'use strict';

// Usuarios controller
angular.module('usuarios').controller('UsuariosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Usuarios','UsuariosForm',
  function ($scope, $stateParams, $location, Authentication, Usuarios, UsuariosForm) {
    $scope.authentication = Authentication;

    $scope.usuario = {};
    //$scope.tableParams = TableSettings.getParams(Ciudades);

    $scope.setFormFields = function(disabled) {
      $scope.formFields = UsuariosForm.getFormFields(disabled);
		};


    // Create new Usuario
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'usuarioForm');

        return false;
      }

      // Create new Usuario object
      var usuario = new Usuarios($scope.usuario);

      // Redirect after save
      usuario.$save(function (response) {
        $location.path('usuarios'); // + '/' + response._id);

        // Clear form fields
        // $scope.title = '';
        // $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Usuario
    $scope.remove = function (usuario) {
      if (usuario) {

        usuario = Usuarios.get({usuarioId:usuario._id}, function(){
          usuario.$remove();
					// $scope.tableParams.reload();
        });
        /*
        usuario.$remove();

        for (var i in $scope.usuarios) {
          if ($scope.usuarios[i] === usuario) {
            $scope.usuarios.splice(i, 1);
          }
        }
        */

      } else {
        $scope.usuario.$remove(function () {
          $location.path('usuarios');
        });
      }
    };

    // Update existing Usuario
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'usuarioForm');

        return false;
      }

      var usuario = $scope.usuario;

      usuario.$update(function () {
        $location.path('usuarios'); // + "/' + usuario._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Usuarios
    $scope.find = function () {
      $scope.usuarios = Usuarios.query();
    };

    // Find existing Usuario
    $scope.findOne = function () {
      $scope.usuario = Usuarios.get({
        usuarioId: $stateParams.usuarioId
      });
      $scope.setFormFields(false);
    };
  }
]);

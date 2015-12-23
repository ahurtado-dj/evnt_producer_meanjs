'use strict';

// Ciudades controller
angular.module('ciudades').controller('CiudadesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ciudades', 'CiudadesForm', /*'TableSettings',*/
  function ($scope, $stateParams, $location, Authentication, Ciudades, CiudadesForm /*, TableSettings*/) {
    $scope.authentication = Authentication;

    $scope.ciudad = {};
    //$scope.tableParams = TableSettings.getParams(Ciudades);

    $scope.setFormFields = function(disabled) {
      $scope.formFields = CiudadesForm.getFormFields(disabled);
		};

    // Create new Ciudad
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ciudadForm');

        return false;
      }

      // Create new Ciudad object
      var ciudad = new Ciudades($scope.ciudad); //this

      // Redirect after save
      ciudad.$save(function (response) {
        $location.path('ciudades' ); // + '/' +  response._id);

        // Clear form fields
        // $scope.nombre = '';
        // $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Ciudad
    $scope.remove = function (ciudad) {
      if (ciudad) {

        ciudad = Ciudades.get({ciudadId:ciudad._id}, function() {
					ciudad.$remove();
					// $scope.tableParams.reload();
				});

        /*
        ciudad.$remove();

        for (var i in $scope.ciudades) {
          if ($scope.ciudades[i] === ciudad) {
            $scope.ciudades.splice(i, 1);
          }
        }
        */

      } else {
        $scope.ciudad.$remove(function () {
          $location.path('ciudades');
        });
      }
    };

    // Update existing Ciudad
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'ciudadForm');

        return false;
      }

      var ciudad = $scope.ciudad;

      ciudad.$update(function () {
        $location.path('ciudades');  // + "/" + ciudad._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Ciudades
    $scope.find = function () {
      $scope.ciudades = Ciudades.query();
    };

    // Find existing Ciudad
    $scope.findOne = function () {
      $scope.ciudad = Ciudades.get({
        ciudadId: $stateParams.ciudadId
      });
      $scope.setFormFields(false);
    };
  }
]);

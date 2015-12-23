(function() {
    'use strict';

    angular
        .module('ciudades')
        .factory('CiudadesForm', factory);

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'nombre',
  					type: 'input',
  					templateOptions: {
  			      label: 'Nombre:',
  						disabled: disabled
  			    }
  				},
          {
  					key: 'rj_codigo',
  					type: 'input',
  					templateOptions: {
  			      label: 'Codigo de Rama:',
  						disabled: disabled
  			    }
  				}

  			];

        return fields;

      };

      var service = {
        getFormFields: getFormFields
      };

      return service;

  }

})();

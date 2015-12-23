(function() {
    'use strict';

    angular
        .module('usuarios')
        .factory('UsuariosForm', factory);

    function factory() {

      var getFormFields = function(disabled) {

        var fields = [
  				{
  					key: 'nombre',
  					type: 'input',
  					templateOptions: {
  			      label: 'Nombre:',
              placeholder: 'Su nombre',
  						disabled: disabled
  			    }
  				},
          {
  					key: 'documento_tipo',
  					type: 'select',
  					templateOptions: {
  			      "label": 'Tipo Documento:',
              "placeholder": "Su tipo doc, Try: \"CC\"",
              "options" : [
                  { "name": "Cedula",
                    "value": "CC"
                  },
                  { "name": "Tarjeta",
                    "value": "TI"
                  },
                  { "name": "Pasaporte",
                    "value": "PA"
                  }
              ]
  			    }
  				},
          {
  					key: 'documento_nro',
  					type: 'input',
  					templateOptions: {
  			      label: 'Nro Documento:',
              placeholder: 'Su # de documento',
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

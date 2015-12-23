'use strict';

// Configuring the Ciudades module
angular.module('ciudades').run(['Menus',
  function (Menus) {
    // Add the ciudades dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Administración',
      state: 'administracion',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'administracion', {
      title: 'Ciudades',
      state: 'ciudades.list'
    });

    // Add the dropdown create item
    /*
    Menus.addSubMenuItem('topbar', 'ciudades', {
      title: 'Create Ciudades',
      state: 'ciudades.create',
      roles: ['user']
    });
    */
  }
]);

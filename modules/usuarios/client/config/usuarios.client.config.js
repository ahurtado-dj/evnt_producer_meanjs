'use strict';

// Configuring the Usuarios module
angular.module('usuarios').run(['Menus',
  function (Menus) {
    // Add the usuarios dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Administración',
      state: 'administracion',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'administracion', {
      title: 'Usuarios',
      state: 'usuarios.list'
    });

    // Add the dropdown create item
    /*
    Menus.addSubMenuItem('topbar', 'usuarios', {
      title: 'Create Usuarios',
      state: 'usuarios.create',
      roles: ['user']
    });
    */
  }
]);

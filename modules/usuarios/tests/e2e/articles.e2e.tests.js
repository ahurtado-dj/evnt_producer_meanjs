'use strict';

describe('Usuarios E2E Tests:', function () {
  describe('Test usuarios page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/usuarios');
      expect(element.all(by.repeater('usuario in usuarios')).count()).toEqual(0);
    });
  });
});

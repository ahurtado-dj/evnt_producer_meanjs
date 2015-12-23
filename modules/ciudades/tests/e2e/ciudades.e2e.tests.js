'use strict';

describe('Ciudades E2E Tests:', function () {
  describe('Test ciudades page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ciudades');
      expect(element.all(by.repeater('ciudad in ciudades')).count()).toEqual(0);
    });
  });
});

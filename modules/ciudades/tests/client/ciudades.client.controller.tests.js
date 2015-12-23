'use strict';

(function () {
  // Ciudades Controller Spec
  describe('Ciudades Controller Tests', function () {
    // Initialize global variables
    var CiudadesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Ciudades,
      mockArticle;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Articles_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Ciudades = _Articles_;

      // create mock ciudad
      mockArticle = new Ciudades({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Ciudad about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Ciudades controller.
      CiudadesController = $controller('CiudadesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one ciudad object fetched from XHR', inject(function (Ciudades) {
      // Create a sample ciudades array that includes the new ciudad
      var sampleArticles = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/ciudades').respond(sampleArticles);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.ciudades).toEqualData(sampleArticles);
    }));

    it('$scope.findOne() should create an array with one ciudad object fetched from XHR using a ciudadId URL parameter', inject(function (Ciudades) {
      // Set the URL parameter
      $stateParams.ciudadId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/ciudades\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.ciudad).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample ciudad object
        sampleArticlePostData = new Ciudades({
          title: 'An Ciudad about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Ciudad about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Ciudades) {
        // Set POST response
        $httpBackend.expectPOST('api/ciudades', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the ciudad was created
        expect($location.path.calls.mostRecent().args[0]).toBe('ciudades/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/ciudades', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock ciudad in scope
        scope.ciudad = mockArticle;
      });

      it('should update a valid ciudad', inject(function (Ciudades) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/ciudades\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/ciudades/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Ciudades) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/ciudades\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(ciudad)', function () {
      beforeEach(function () {
        // Create new ciudades array and include the ciudad
        scope.ciudades = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/ciudades\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid ciudadId and remove the ciudad from the scope', inject(function (Ciudades) {
        expect(scope.ciudades.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.ciudad = mockArticle;

        $httpBackend.expectDELETE(/api\/ciudades\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to ciudades', function () {
        expect($location.path).toHaveBeenCalledWith('ciudades');
      });
    });
  });
}());

'use strict';

(function () {
  // Usuarios Controller Spec
  describe('Usuarios Controller Tests', function () {
    // Initialize global variables
    var UsuariosController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Usuarios,
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
      Usuarios = _Articles_;

      // create mock usuario
      mockArticle = new Usuarios({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Usuario about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Usuarios controller.
      UsuariosController = $controller('UsuariosController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one usuario object fetched from XHR', inject(function (Usuarios) {
      // Create a sample usuarios array that includes the new usuario
      var sampleArticles = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/usuarios').respond(sampleArticles);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.usuarios).toEqualData(sampleArticles);
    }));

    it('$scope.findOne() should create an array with one usuario object fetched from XHR using a articleId URL parameter', inject(function (Usuarios) {
      // Set the URL parameter
      $stateParams.usuarioId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/usuarios\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.usuario).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample usuario object
        sampleArticlePostData = new Usuarios({
          title: 'An Usuario about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Usuario about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Usuarios) {
        // Set POST response
        $httpBackend.expectPOST('api/usuarios', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the usuario was created
        expect($location.path.calls.mostRecent().args[0]).toBe('usuarios/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/usuarios', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock usuario in scope
        scope.usuario = mockArticle;
      });

      it('should update a valid usuario', inject(function (Usuarios) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/usuarios\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/usuarios/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Usuarios) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/usuarios\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(usuario)', function () {
      beforeEach(function () {
        // Create new usuarios array and include the usuario
        scope.usuarios = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/usuarios\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid articleId and remove the usuario from the scope', inject(function (Usuarios) {
        expect(scope.usuarios.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.usuario = mockArticle;

        $httpBackend.expectDELETE(/api\/usuarios\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to usuarios', function () {
        expect($location.path).toHaveBeenCalledWith('usuarios');
      });
    });
  });
}());

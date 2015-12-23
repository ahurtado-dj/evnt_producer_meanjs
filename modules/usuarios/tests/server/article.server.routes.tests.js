'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Usuario = mongoose.model('Usuario'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, usuario;

/**
 * Usuario routes tests
 */
describe('Usuario CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new usuario
    user.save(function () {
      usuario = {
        title: 'Usuario Title',
        content: 'Usuario Content'
      };

      done();
    });
  });

  it('should be able to save an usuario if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new usuario
        agent.post('/api/usuarios')
          .send(usuario)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle usuario save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get a list of usuarios
            agent.get('/api/usuarios')
              .end(function (articlesGetErr, articlesGetRes) {
                // Handle usuario save error
                if (articlesGetErr) {
                  return done(articlesGetErr);
                }

                // Get usuarios list
                var usuarios = articlesGetRes.body;

                // Set assertions
                (usuarios[0].user._id).should.equal(userId);
                (usuarios[0].title).should.match('Usuario Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an usuario if not logged in', function (done) {
    agent.post('/api/usuarios')
      .send(usuario)
      .expect(403)
      .end(function (articleSaveErr, articleSaveRes) {
        // Call the assertion callback
        done(articleSaveErr);
      });
  });

  it('should not be able to save an usuario if no title is provided', function (done) {
    // Invalidate title field
    usuario.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new usuario
        agent.post('/api/usuarios')
          .send(usuario)
          .expect(400)
          .end(function (articleSaveErr, articleSaveRes) {
            // Set message assertion
            (articleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle usuario save error
            done(articleSaveErr);
          });
      });
  });

  it('should be able to update an usuario if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new usuario
        agent.post('/api/usuarios')
          .send(usuario)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle usuario save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Update usuario title
            usuario.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing usuario
            agent.put('/api/usuarios/' + articleSaveRes.body._id)
              .send(usuario)
              .expect(200)
              .end(function (articleUpdateErr, articleUpdateRes) {
                // Handle usuario update error
                if (articleUpdateErr) {
                  return done(articleUpdateErr);
                }

                // Set assertions
                (articleUpdateRes.body._id).should.equal(articleSaveRes.body._id);
                (articleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of usuarios if not signed in', function (done) {
    // Create new usuario model instance
    var articleObj = new Usuario(usuario);

    // Save the usuario
    articleObj.save(function () {
      // Request usuarios
      request(app).get('/api/usuarios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single usuario if not signed in', function (done) {
    // Create new usuario model instance
    var articleObj = new Usuario(usuario);

    // Save the usuario
    articleObj.save(function () {
      request(app).get('/api/usuarios/' + articleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', usuario.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single usuario with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/usuarios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Usuario is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single usuario which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent usuario
    request(app).get('/api/usuarios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No usuario with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an usuario if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new usuario
        agent.post('/api/usuarios')
          .send(usuario)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle usuario save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Delete an existing usuario
            agent.delete('/api/usuarios/' + articleSaveRes.body._id)
              .send(usuario)
              .expect(200)
              .end(function (articleDeleteErr, articleDeleteRes) {
                // Handle usuario error error
                if (articleDeleteErr) {
                  return done(articleDeleteErr);
                }

                // Set assertions
                (articleDeleteRes.body._id).should.equal(articleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an usuario if not signed in', function (done) {
    // Set usuario user
    usuario.user = user;

    // Create new usuario model instance
    var articleObj = new Usuario(usuario);

    // Save the usuario
    articleObj.save(function () {
      // Try deleting usuario
      request(app).delete('/api/usuarios/' + articleObj._id)
        .expect(403)
        .end(function (articleDeleteErr, articleDeleteRes) {
          // Set message assertion
          (articleDeleteRes.body.message).should.match('User is not authorized');

          // Handle usuario error error
          done(articleDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Usuario.remove().exec(done);
    });
  });
});

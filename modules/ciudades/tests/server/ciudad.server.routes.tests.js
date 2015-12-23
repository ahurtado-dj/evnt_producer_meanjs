'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ciudad = mongoose.model('Ciudad'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, ciudad;

/**
 * Ciudad routes tests
 */
describe('Ciudad CRUD tests', function () {

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

    // Save a user to the test db and create new ciudad
    user.save(function () {
      ciudad = {
        title: 'Ciudad Title',
        content: 'Ciudad Content'
      };

      done();
    });
  });

  it('should be able to save an ciudad if logged in', function (done) {
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

        // Save a new ciudad
        agent.post('/api/ciudades')
          .send(ciudad)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle ciudad save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get a list of ciudades
            agent.get('/api/ciudades')
              .end(function (articlesGetErr, articlesGetRes) {
                // Handle ciudad save error
                if (articlesGetErr) {
                  return done(articlesGetErr);
                }

                // Get ciudades list
                var ciudades = articlesGetRes.body;

                // Set assertions
                (ciudades[0].user._id).should.equal(userId);
                (ciudades[0].title).should.match('Ciudad Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an ciudad if not logged in', function (done) {
    agent.post('/api/ciudades')
      .send(ciudad)
      .expect(403)
      .end(function (articleSaveErr, articleSaveRes) {
        // Call the assertion callback
        done(articleSaveErr);
      });
  });

  it('should not be able to save an ciudad if no title is provided', function (done) {
    // Invalidate title field
    ciudad.title = '';

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

        // Save a new ciudad
        agent.post('/api/ciudades')
          .send(ciudad)
          .expect(400)
          .end(function (articleSaveErr, articleSaveRes) {
            // Set message assertion
            (articleSaveRes.body.message).should.match('Title cannot be blank');

            // Handle ciudad save error
            done(articleSaveErr);
          });
      });
  });

  it('should be able to update an ciudad if signed in', function (done) {
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

        // Save a new ciudad
        agent.post('/api/ciudades')
          .send(ciudad)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle ciudad save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Update ciudad title
            ciudad.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing ciudad
            agent.put('/api/ciudades/' + articleSaveRes.body._id)
              .send(ciudad)
              .expect(200)
              .end(function (articleUpdateErr, articleUpdateRes) {
                // Handle ciudad update error
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

  it('should be able to get a list of ciudades if not signed in', function (done) {
    // Create new ciudad model instance
    var articleObj = new Ciudad(ciudad);

    // Save the ciudad
    articleObj.save(function () {
      // Request ciudades
      request(app).get('/api/ciudades')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single ciudad if not signed in', function (done) {
    // Create new ciudad model instance
    var articleObj = new Ciudad(ciudad);

    // Save the ciudad
    articleObj.save(function () {
      request(app).get('/api/ciudades/' + articleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', ciudad.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single ciudad with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ciudades/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ciudad is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single ciudad which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent ciudad
    request(app).get('/api/ciudades/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No ciudad with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an ciudad if signed in', function (done) {
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

        // Save a new ciudad
        agent.post('/api/ciudades')
          .send(ciudad)
          .expect(200)
          .end(function (articleSaveErr, articleSaveRes) {
            // Handle ciudad save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Delete an existing ciudad
            agent.delete('/api/ciudades/' + articleSaveRes.body._id)
              .send(ciudad)
              .expect(200)
              .end(function (articleDeleteErr, articleDeleteRes) {
                // Handle ciudad error error
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

  it('should not be able to delete an ciudad if not signed in', function (done) {
    // Set ciudad user
    ciudad.user = user;

    // Create new ciudad model instance
    var articleObj = new Ciudad(ciudad);

    // Save the ciudad
    articleObj.save(function () {
      // Try deleting ciudad
      request(app).delete('/api/ciudades/' + articleObj._id)
        .expect(403)
        .end(function (articleDeleteErr, articleDeleteRes) {
          // Set message assertion
          (articleDeleteRes.body.message).should.match('User is not authorized');

          // Handle ciudad error error
          done(articleDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Ciudad.remove().exec(done);
    });
  });
});

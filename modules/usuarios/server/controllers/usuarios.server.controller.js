'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Usuario = mongoose.model('Usuario'),
  kafka = require('kafka-node'),
  Producer = kafka.Producer,
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


var notifyEvent = function( msg ) {

  var client = new kafka.Client('192.168.90.30:2181');
  var producer = new Producer(client);

  var payloads = [
      //{ topic: 'my-topic-test', messages: [msg], partition: 0 },
      { topic: 'my-topic-test', messages: JSON.stringify(msg), partition: 0 },
  ];
  console.log("notifyEvent.req=");
  console.log(msg);

  producer.on('ready', function() {
    producer.send(payloads, function(err, data){
		    console.log('notifyEventOk_Sending');
        console.log(data);
     });
  });
  producer.on('error', function(error) {
    console.log('notifyEventError', error);
  });

};

/**
 * Create a usuario
 */
exports.create = function (req, res) {
  var usuario = new Usuario(req.body);
  usuario.user = req.user;

  usuario.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // TODO: concatenar promises?
      console.log("+usuario.create");
      console.log(usuario);

      console.log("+usuario.create.sendMsg");
      notifyEvent({
        'eventType':'usuario.create',
        'eventDate': new Date(),
        'payload': usuario
      });

      res.json(usuario);
    }
  });
};

/**
 * Show the current usuario
 */
exports.read = function (req, res) {
  res.json(req.usuario);
};

/**
 * Update a usuario
 */
exports.update = function (req, res) {
  var usuario = req.usuario;

  usuario = _.extend(usuario, req.body);
  // usuario.title = req.body.title;
  // usuario.content = req.body.content;

  usuario.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(usuario);
    }
  });
};

/**
 * Delete an usuario
 */
exports.delete = function (req, res) {
  var usuario = req.usuario;

  usuario.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(usuario);
    }
  });
};

/**
 * List of Usuarios
 */
exports.list = function (req, res) {
  Usuario
  .find()
  .sort('-created')
  .populate('user', 'displayName')
  .exec(function (err, usuarios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(usuarios);
    }
  });
};

/**
 * Usuario middleware
 */
exports.usuarioByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Usuario is invalid'
    });
  }

  Usuario.findById(id).populate('user', 'displayName').exec(function (err, usuario) {
    if (err) {
      return next(err);
    } else if (!usuario) {
      return res.status(404).send({
        message: 'No usuario with that identifier has been found'
      });
    }
    req.usuario = usuario;
    next();
  });
};

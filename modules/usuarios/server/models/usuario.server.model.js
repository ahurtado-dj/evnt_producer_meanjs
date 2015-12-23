'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Usuario Schema
 */
var UsuarioSchema = new Schema({
  nombre: {
    type: String,
    default: '',
    trim: true,
    required: 'Nombre no puede ser nulo'
  },
  documento_tipo: {
    type: String,
    default: '',
    trim: true,
    required: 'Tipo no puede ser nulo'
  },
  documento_nro: {
    type: String,
    default: '',
    trim: true,
    required: 'NroDocumento no puede ser vacio'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Usuario', UsuarioSchema);

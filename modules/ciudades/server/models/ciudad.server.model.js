'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ciudad Schema
 */
var CiudadSchema = new Schema({
  nombre: {
    type: String,
    default: '',
    trim: true,
    required: 'Nombre no puede ser vacio'
  },
  rj_codigo: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Ciudad', CiudadSchema);

'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Ciudad = mongoose.model('Ciudad'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a ciudad
 */
exports.create = function (req, res) {

  var ciudad = new Ciudad(req.body);
  ciudad.user = req.user;

  ciudad.save(function (err) {
    if (err) {
      console.log("+ciudad.create");
      console.log(req.body);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ciudad);
    }
  });
};

/**
 * Show the current ciudad
 */
exports.read = function (req, res) {
  res.json(req.ciudad);
};

/**
 * Update a ciudad
 */
exports.update = function (req, res) {
  var ciudad = req.ciudad;

  ciudad = _.extend(ciudad , req.body);

  //ciudad.title = req.body.title;
  //ciudad.content = req.body.content;

  ciudad.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ciudad);
    }
  });
};

/**
 * Delete an ciudad
 */
exports.delete = function (req, res) {
  var ciudad = req.ciudad;

  ciudad.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ciudad);
    }
  });
};

/**
 * List of Ciudades
 */
exports.list = function (req, res) {

  // add metadata for query parameters
  var sort;
	var sortObject = {};
	var count = req.query.count || 10;
	var page = req.query.page || 1;


	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}
	else {
		sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};

  // then execute the query
  /*
  Ciudad
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, ciudades){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(ciudades);
			}
		});
*/
  Ciudad
    .find()
    .sort('-created')
    .populate('user', 'displayName')
    .exec(function (err, ciudades) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(ciudades);
      }
    });


};

/**
 * Ciudad middleware
 */
exports.ciudadByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ciudad is invalid'
    });
  }

  Ciudad.findById(id).populate('user', 'displayName').exec(function (err, ciudad) {
    if (err) {
      return next(err);
    } else if (!ciudad) {
      return res.status(404).send({
        message: 'No ciudad with that identifier has been found'
      });
    }
    req.ciudad = ciudad;
    next();
  });
};

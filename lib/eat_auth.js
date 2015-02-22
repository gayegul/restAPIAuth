'use strict';

var eat = require('eat');
var User = require('../models/User');

module.exports = function(appSecret) {
	return function(req, res, next) {
		var token = req.headers.eat || req.body.eat;
		if(!token) return res.status(403).send({msg: 'could not authenticate - no token'});

		eat.decode(token, appSecret, function(err, decoded) {
			if (err) return res.status(403).send({msg: 'could not authenticate - decoding error:' + err});

			User.findOne({_id: decoded.id}, function(err, user) {
				if (err) return res.status(403).send({msg: 'could not authenticate - db error:' + err});

				if (!user) return res.status(403).send({msg: 'could not authenticate - user not found'});

				req.user = user;
				next();
			});
		});
	};
};
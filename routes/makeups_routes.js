'use strict';
var Makeup = require('../models/Makeup');
var eat_auth = require('../lib/eat_auth');
var bodyparser = require('body-parser');

module.exports = function(app, appSecret) {
	app.use(bodyparser.json());

	app.get('/makeups', eat_auth(appSecret), function(req, res) {
		Makeup.find({username: req.user.username}, function(err, data) {
			if (err) return res.status(500).send({'msg': 'could not retrieve makeup'});

			res.json(data);
		});
	});

	app.get('/makeups/:id', eat_auth(appSecret), function(req, res) {
		Makeup.find({_id: req.params.id}, function(err, data) {
			if (err) return res.status(500).send({'msg': 'could not retrieve makeup'});

			res.json(data);
		});
	});

	app.post('/makeups', eat_auth(appSecret), function(req, res) {
		var newMakeup = new Makeup({
			username: req.user.username,
			brand: req.body.brand,
			type: req.body.type
		});
		newMakeup.save(function(err, makeup) {
			if (err) return res.status(500).send({'msg': 'could not save brand'});
		
			res.json(makeup);
		});
	});

	app.put('/makeups/:id', eat_auth(appSecret), function(req, res) {
		var updatedMakeup = req.body;
		delete updatedMakeup._id;
		Makeup.update({_id: req.params.id, username: req.user.username}, updatedMakeup, function(err) {
			user.generateToken(appSecret, function(err, token) {
				if (err) return res.status(500).send({'msg': 'could not update makeup'});
				
				res.json(req.body);
			});
		});
	});

	app.delete('/makeups/:id', eat_auth(appSecret), function(req, res) {
		Makeup.findOneAndRemove({_id: req.params.id, username: req.user.username}, function(err, makeup) {
			if (err) return res.status(500).send({'msg': 'could not delete makeup'});

			res.json(null);
		});
	});
};
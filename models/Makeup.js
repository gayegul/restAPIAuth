'use strict';

var mongoose = require('mongoose');

var makeupSchema = new mongoose.Schema({
	username: String,
	brand: String,
	type: {type: String, default: 'Chanel'}
});

module.exports = mongoose.model('Makeup', makeupSchema);
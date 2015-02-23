'use strict';

process.env.MONGO_URI = 'mongodb://localhost/makeupapp_test';
require('../server.js');
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect;

describe('authentication testing', function() {
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	it('should fail auth without token', function(done) {
		chai.request('localhost:3000/api/v1')
		.get('/makeups')
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(403);
			expect(res.body).to.eql({msg: 'could not authenticate - no token'});
			done();
		});
	});

	it('should fail auth with a bad token', function(done) {
		chai.request('localhost:3000/api/v1')
		.get('/makeups')
		.set('eat', 'bad token')
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(403);
			expect(res.body).to.eql({msg: 'could not authenticate - decoding error'});
			done();
		});
	});

	var token;
	it('should create a user and create a token', function(done) {
		chai.request('localhost:3000/api/v1')
		.post('/create_user')
		.send({"email":"abc@x.com","password":"1234"})
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			console.dir(res.body);
			expect(res.body).to.have.property('eat');
			token = res.body.eat;
			done();
		});
	});

	it('should retrieve makeup with the token', function(done) {
		chai.request('localhost:3000/api/v1')
		.get('/makeups')
		.set('eat', token)
		.end(function(err, res) {
			expect(err).to.eql(null);
			expect(res).to.have.status(200);
			done();
		});
	});

});



















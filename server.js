'use strict';

var express = require('express');
var mongoose = require('mongoose');
var makeupsRoutes = require('./routes/makeups_routes');
var passport = require('passport');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/makeupsapp_development');

var app = express();
app.set('appSecret', process.env.SECRET || 'changethischangethis!');
app.use(passport.initialize());
require('./lib/passport_strat')(passport);

var makeupsRouter = express.Router();
var userRouter = express.Router();

makeupsRoutes(makeupsRouter, app.get('appSecret'));
require('./routes/user_routes')(userRouter, passport, app.get('appSecret'));

app.use('/api/v1', makeupsRouter);
app.use('/api/v1', userRouter);

app.listen(process.env.PORT || 3000, function() {
	console.log('server listening on port ' + (process.env.PORT || 3000));
});
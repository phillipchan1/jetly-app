/*jslint node: true */

'use strict';
var express = require('express');
var parser = require('body-parser');
var passport = require('passport');

// create instance of the server to variable app
var app = express();

// passport serialization
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
// get method for parsing body
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// connect to database
require('./database/database.js');

// app.use('/', express.static('client/dist'));

// set up routes
var routes = require('./app.routes.js');

app.use('/api', routes);


// direct all other routes to client-side app
// app.all('/*', function ( req, res ) {
//     res
//         .status( 200 )
//         .set( { 'content-type': 'text/html; charset=utf-8' } )
//         .sendFile(process.cwd() + '/client/dist/index.html');
// });

// // direct all other routes to client-side app
// app.get('/*', (req, res) => {
//     res.sendFile('/client/dist/index.html');
// });

app.listen(process.env.PORT || 3000, function() {
	console.log('Service on running on 3000');
});
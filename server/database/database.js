'use strict';
var mongoose = require('mongoose');
var config = require('../config.js');
var db = process.env.MLAB_DB || config.localDB;

mongoose.connect(db, function(err) {
	if (err) {
		console.log("Failed to connect to mongodb at " + db);
	} else {
		console.log("Successfully connected to mongodb at " + db);
	}
});
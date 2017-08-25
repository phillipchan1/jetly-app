var express = require('express');
var app = express();
var router = express.Router();

var user = require('./models/user/user.api.js');

// auth
router.use('/auth', user);

module.exports = router;
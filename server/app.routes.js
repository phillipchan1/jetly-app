var express = require('express');
var app = express();
var router = express.Router();

var auth = require('./auth/auth.api.js');

// auth
router.use('/auth', auth);

module.exports = router;
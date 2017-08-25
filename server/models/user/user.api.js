var express = require('express');
var router = express.Router();
var User = require('./user');
var userUtils = require('./userUtils.js')
var jwt = require('jsonwebtoken');
var config = require('../../config');

// registering new user
router.post('/register', function(req, res, next) {
    var passwordResult = userUtils.checkPassword(req.body.password);

    // Check appropriateness of password
    if (passwordResult.success === false) {
        res.json({
            success: false,
            message: passwordResult.message
        });
    }

    else {
        userUtils.findUserByEmail(req.body.email)

        // if user already exists, don't create a new account
        .then(function(user) {
            res.json({
                success: false,
                message: 'User already exists'
            });
        }, function(err) {
            return userUtils.createNewUser(req.body.email, req.body.password);
        })

        // if user is created successfully
        .then(function(user) {
             res.json({
                success: true,
                message: 'User succesfully created'
            });
        }, function(err) {
            res.json({
                success: false,
                message: 'Unable to create user'
            });
        });
    }
});

// logging in
router.post('/login', function(req, res, next) {
    userUtils.findUserByEmail(req.body.email)

        //authenticate user
        .then(function(user) {
            if (user) {
                return userUtils.authenticate(req.body.email, req.body.password);
            }
        }, function(err) {
            res.json({
                success: false,
                message: 'Incorrect Email/Password'
            });

            return Promise.reject(err);
        })

        // report login
        .then(function(user) {
            return userUtils.saveUserData({
                user: user,
                category: 'reports',
                data: {
                    lastLoggedIn: Date.now()
                }
            });
        }, function(err) {
            res.json({
                success: false,
                message: 'Incorrect Email/Password'
            });
        })

        // if successful, sign them in
        .then(function(user) {
            var token = jwt.sign(
                user,
                config.secret, {
                    expiresIn: "7d"
                }
            );

            user.save(function(err, user) {
                if (!err) {
                    res.json({
                        success: true,
                        token: token,
                        user: user
                    });
                }
            });

            return user;
        });
});

// verify a json web token
router.get('/verify', function(req, res, next) {
    var token = req.headers.token;

    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Authentication Error: Invalid/No JWtoken Provided',
                });
            } else {

                // make sure user still exists
                User.findOne({email: decoded._doc.email}, function(err, user) {
                    if (!user) {
                        res.json({
                            success: false,
                            message: 'User not found'
                        });
                    } else {
                        // User exists, JWtoken valid: Success
                        res.json({
                            success: true,
                            message: 'Success! JWtoken Valid',
                            user: user
                        });
                    }
                });
            }
        });
    } else {
        res.json({
            success: false,
            message: 'Authentication Error: Invalid/No JWtoken Provided'
        });
    }
});

module.exports = router;
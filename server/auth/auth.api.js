var express = require('express');
var router = express.Router();
var User = require('./user');
var userUtils = require('./userUtils.js');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var config = require('../config');
var url = require('url');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
		clientID: '1027177071681-sfncplgtv4d9v26lvbo82mtg4378onsr.apps.googleusercontent.com',
		clientSecret: 'tJi-WQg1KSx7_Qb1OlzYDpLJ',
		callbackURL: "http://localhost:3000/api/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, next) {
		User.findOne({
			provider: 'google',
			profileId: profile.id
		}, function(err, user) {

			// if user doesn't exist create a new one
			if (!user) {
				var err = new Error("User already exists");

				User.create({
					provider: 'google',
					profileId: profile.id,
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
				}, function(err, user) {
					return next(err, user);
				});
			}

			// else return the user
			else {
				next(null, user);
			}
		});
	}
));

router.get('/google',
	passport.authenticate('google', { scope: ['profile'] }));

router.get(
	'/google/callback',
	passport.authenticate(
		'google',
		{
			failWithError: true
		}
	),
	function(req, res, next) {
		var user = req.user;

		User.findOne({
			provider: 'google',
			profileId: user.profileId
		}, function(err, user) {
			var token = jwt.sign(
				user,
				config.secret, {
					expiresIn: "7d"
				}
			);

			user.save(function(err, user) {
				// success!
				if (!err) {
					res.redirect(
						url.format(
							{
								pathname: '/login',
								query: {
									token: token
								}
							}
						)
					);
				}

				// fail
				else {
					res.redirect('/login');
				}


			});
		});
	}
);

// verify a json web token
router.get('/verify', function(req, res, next) {
	console.log(req.headers);
	var token = req.headers.authorization;
	console.log('token:');
	console.log(token);

	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				res.json({
					success: false,
					message: 'Authentication Error: Invalid/No JWtoken Provided',
				});
			} else {

				// make sure user still exists
				User.findOne({ email: decoded._doc.email }, function(err, user) {
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

// protected routes middleware
// everything below is protected
router.use(function(req, res, next) {
    var token = req.headers.Authorization || req.query.token || req.headers['x-access-token'] || req.headers.token;

    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error: JWtoken invalid for route'
                });
            }
            // success:
            else {
                let decoded = jwt.decode(token);

                // find the user and pass the entire user for the rest of the routes
                User.findOne({email: decoded._doc.email}, function(err, user) {
                    if (!user) {
                        res.json({
                            success: false,
                            message: 'User not found'
                        });
                    } else {
                        req.user = user;
                        next();
                    }
                });
            }
        });
    } else {
        res.status(403).json({
            succes: false,
            message: 'Authorization Fail: No Token Provided'
        });
    }
});

module.exports = router;
var User = require('./user');

var authenticate = function(email, password) {
	return new Promise(function(resolve, reject) {
		User.authenticate(email, password, function(err, user) {
			console.log(err);
			if (err || !user) {
				reject(err);
			} else {
				resolve(user);
			}
		});
	});
};

var checkCredentialsPresent = function(email, password) {
	if (email && password) {
		return true;
	} else {
		return false;
	}
};

var checkPassword = function(password) {
	var response = {
		success: false,
		message: ''
	};

	if (password.length < 8) {
		response.message = 'Password should be 8 characters long';
	}

	else if (password.search(/[a-z]/i) < 0) {
		response.message = 'Password must contain at least one letter';
	}

	else if (password.search(/[0-9]/) < 0) {
		response.message = 'Password must contain at least one number';
	}

	else {
		response.success = true;
	}

	return response;
};

var checkEmail = function(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var createNewUser = function(email, password) {
	return new Promise(function(resolve, reject) {
		User.create({
			email: email,
			password: password,
			config: {
                apiSetup: false,
                userType: 'user',
                shopifyApi: {}
            },
            reports: {
                createdOn: Date.now()
            }
		}, function(err, user) {
			if (err) {
				reject(err);
			} else {
				resolve(user);
			}
		});
	});
};

var findUserById = function(id) {
	return new Promise(function(resolve, reject) {
		User.findById(id, function(err, user) {
			if (err) {
				reject(err);
			} else {
				resolve(user);
			}
		});
	});
};

var findUserByEmail = function(email) {
	return new Promise(function(resolve, reject) {
		User.findOne({ email: email }, function(err, user) {
			if (user) {
				resolve(user);
			} else {
				reject(err);
			}
		});
	});
};

var removeUserByEmail = function(email) {
	return new Promise(function(resolve, reject) {
		User.findOneAndRemove({
			email: email
		}, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve('success');
			}
		});
	});
};

// saves user Data, based on a category
var saveUserData = function(options) {
	return new Promise(function(resolve, reject) {
		var category = options.category;
		var data = options.data;
		var user = options.user;

		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				user[category][key] = data[key];
			}
		}

		user.markModified(options.category);

		user.save(function (err, user) {
			if (err) {
				reject(err);
			} else {
				resolve(user);
			}
		});
	});
};

module.exports = {
	authenticate: authenticate,
	checkCredentialsPresent: checkCredentialsPresent,
	checkPassword: checkPassword,
	checkEmail: checkEmail,
	createNewUser: createNewUser,
	findUserById: findUserById,
	findUserByEmail: findUserByEmail,
	removeUserByEmail: removeUserByEmail,
	saveUserData: saveUserData
};
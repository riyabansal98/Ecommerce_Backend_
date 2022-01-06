const User = require("../models/user");
const {
	httpCodes, userType
} = require("../constants/backendConfig");

module.exports = {
	login: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for login"
		};
		if (data.username && data.password) {
			User.login(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in login";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				if (result.length === 0) {
					responseData.msg = "Invalid Email or Password";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg ="Successfully Logged In";
				responseData.data = {
					username: result[0].Username,
					userId: result[0].UserId
				};
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	signup: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for signup"
		};
		if (data.username && data.password) {
			User.getUserSignupDetails(data, function(err, result){
				if (err) {
					responseData.msg = "Error in signup";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				if(result.length > 0) {
					responseData.msg = "User already exists";
					return res.status(httpCodes.internalServerError).send(responseData);
				} else {
					User.signup(data, function (err1) {
						if (err1) {
							responseData.msg = "Error in signup";
							return res.status(httpCodes.internalServerError).send(responseData);
						}
						responseData.success = true;
						responseData.msg ="Successfully Signup Up";
						responseData.data = {
							username: data.username,
							userId: result.insertId
						};
						return res.status(httpCodes.success).send(responseData);
					});
				}
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	getVendorDetails: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching vendor details"
		};
		if (data.userId) {
			User.getVendorDetails(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in fetching vendor details";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg ="Successfully fetched vendor details";
				responseData.vendorDetails = {
					username: result[0].username,
					gstin: result[0].gstin,
					pan: result[0].pan
				};
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	getVendorPayments: function (req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching vendor payments"
		};
		if (data.userId) {
			User.getVendorPayments(data, function (err, result) {
				if (err) {
					responseData.msg = "Error in fetching vendor payments";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg ="Successfully fetched vendor payments";
				responseData.vendorPayments = [];
				result.forEach((item) => {
					let foundOrder = false;
					responseData.vendorPayments.forEach((item1) => {
						if(item1.orderId == item.orderId) {
							foundOrder = true;
						}
					});
					if(!foundOrder) {
						const orderObj = {
							orderId: item.orderId,
							total: item.total,
							products: []
						};
						result.forEach((item2) => {
							const productObj = {
								price: item2.price,
								name: item2.productName,
								quantity: item2.quantity,
								productId: item2.productId
							};
							orderObj.products.push(productObj);
						});
						responseData.vendorPayments.push(orderObj);
					}
				});
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	getUserDetails: function(req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for fetching user details"
		};
		if (data.userId) {
			User.getUserDetails(data, function(err, result){
				if (err) {
					responseData.msg = "Error in signup";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				responseData.success = true;
				responseData.msg = "Successfully fetched user details";
				if(result[0].name) {
					responseData.userDetails = {
						name: result[0].name,
						email: result[0].email,
						phone: result[0].phone,
						address: result[0].address,
						username: result[0].username
					}
				} else {
					responseData.userDetails = {
						name: '',
						email: '',
						phone: '',
						address: '',
						username: result[0].username
					}
				}
				return res.status(httpCodes.success).send(responseData);
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	},

	updateUserDetails: function(req, res) {
		var data = req.body;
		var responseData = {
			success: false,
			msg: "Invalid params for updating user details"
		};
		if (data.userId) {
			User.getUserDetails(data, function(err, result){
				if (err) {
					responseData.msg = "Error in updating user details";
					return res.status(httpCodes.internalServerError).send(responseData);
				}
				if(result.length > 0 && result[0].name) {
					User.updateUserDetails(data, function(err1, result1){
						if (err1) {
							responseData.msg = "Error in updating user details";
							return res.status(httpCodes.internalServerError).send(responseData);
						}
						responseData.success = true;
						responseData.msg = "Successfully updated user details";
						return res.status(httpCodes.success).send(responseData);
					});
				} else {
					User.addUserDetails(data, function(err1, result1){
						if (err1) {
							responseData.msg = "Error in updating user details";
							return res.status(httpCodes.internalServerError).send(responseData);
						}
						responseData.success = true;
						responseData.msg = "Successfully updated user details";
						return res.status(httpCodes.success).send(responseData);
					});
				}
			});
		} else {
			return res.status(httpCodes.badRequest).send(responseData);
		}
	}
};
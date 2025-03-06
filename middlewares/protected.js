const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

//////////////////////////////////////////////
//// PROTECTED USER MIDDLEWARE  ////
//////////////////////////////////////////////

exports.isAuthProtected = async function (req, res, next) {
	try {
		// CHECK TOKEN AND GET TOKEN
		let token = req.headers.authorization && req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1] : null;
		if (!token) {
			return res.status(401).json({
				message: "You are not logged in! Please log in to get access.",
			});
		}

		// VERIFY THE TOKEN
		const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_TOKEN);
		req.user = {
			_id: decoded.id,
		};

		// CHECK IF THE USER EXIST
		const currentUser = await User.findById(decoded.id);
		if (!currentUser || !currentUser.isActive) {
			return res.status(401).json({
				message: "The user belonging to this token does not exist or is inactive.",
			});
		}

		// AT THIS POINT GRANT ACCESS TO PROTECTED ROUTE
		req.user = currentUser;
		res.locals.user = currentUser;

		return next();
	} catch (err) {
		if (err.message.includes("Internet Error")) 
			return res.status(503).json({
				status: "fail",
				message: err.message,
			});
		else
			return res.status(401).json({
				status: "fail",
				message: err.message,
			});
	}
};


exports.isRestricted = function(role=["admin"]) {
	return function(req, res, next) {
		if (!req.user || !role.includes(req.user.role)) {
			return res.status(403).json({ message: "Access denied." });
		}
		return next();
	};
};
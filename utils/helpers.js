const moment = require("moment");
const jwt = require("jsonwebtoken");

// FORMAT NUMBER
exports.formatNumber = function(amount) {
	return Number(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

exports.formatDate = function(givenDate) {
    const date = moment(givenDate);
    return date.format('DD/MM/YYYY');
}

// FORMAT DATE, BUT FOR LATER FORMAT
exports.formatDateLater = function(givenDate) {
    const date = moment(givenDate);
    return date.format('MMMM D, YYYY');
}

exports.formatfutureDate = function(hours) {
    const currentDate = moment();
    const futureDate = currentDate.add(hours, 'hours');
    return futureDate.format('YYYY-MM-DD HH:mm:ss');
}
  
// GENERATE 5-DIGIT RANDOM OTP CODE
exports.generateOtp = function() {
	const otp = Math.floor(10000 + Math.random() * 90000);
	return otp
};


// SIGN JWT ACCESS TOKEN
exports.signToken = function(id) {
	const token = jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	return token
}


// CAPITALIZE FIRST LETTER
exports.FirstCap = function(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}

// FILTER ACCEPTABLE OBJECT
exports.filterObj = function(obj, ...allowedFields) {
	const newObj = {};
	Object.keys(obj).forEach(el => {
	  if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};


exports.countNum = function(val) {
	const num = Number(val);

	if (num >= 1000000) {
		return currency + (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
	} else if (num >= 1000) {
		return currency + (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
	} else {
		return currency + num.toFixed(0);
	}
}
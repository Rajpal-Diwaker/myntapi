const statusCode = require('../config/config').statusCode;
const statusMessage = require('../config/config').statusMessage;

exports.successResponse = function (res, msg) {
	var data = {
		status: statusCode.EVERYTHING_IS_OK,
		message: msg
	};
	return res.status(statusCode.EVERYTHING_IS_OK).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
	var resData = {
		status: statusCode.EVERYTHING_IS_OK,
		message: msg,
		data: data
	};
	return res.status(statusCode.EVERYTHING_IS_OK).json(resData);
};
exports.successResponseWithDataAndToken = function (res, msg, data,accessToken) {
	var resData = {
		status: statusCode.EVERYTHING_IS_OK,
		message: msg,
		data: data,
		accessToken:accessToken
	};
	return res.status(statusCode.EVERYTHING_IS_OK).json(resData);
};

exports.ErrorResponse = function (res, msg) {
	var data = {
		status: statusCode.SOMETHING_WENT_WRONG,
		message: msg,
	};
	return res.status(statusCode.SOMETHING_WENT_WRONG).json(data);
};
exports.ErrorResponseWithData = function (res, msg, data) {
	var data = {
		status: statusCode.SOMETHING_WENT_WRONG,
		message: msg,
		data:data
	};
	return res.status(statusCode.SOMETHING_WENT_WRONG).json(data);
};
exports.ALREADY_EXIST = function (res, msg) {
	var data = {
		status: statusCode.ALREADY_EXIST,
		message: msg,
	};
	return res.status(statusCode.ALREADY_EXIST).json(data);
};
exports.notFoundResponse = function (res, msg) {
	var data = {
		status: statusCode.NOT_FOUND,
		message: msg,
	};
	return res.status(statusCode.NOT_FOUND).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
	var resData = {
		status: statusCode.FORBIDDEN,
		message:data[0].msg,
		//data: data
	};
	return res.status(statusCode.FORBIDDEN).json(resData);
};
exports.INTERNAL_SERVER_ERROR = function (res, msg, err) {
	var resData = {
		status: statusCode.INTERNAL_SERVER_ERROR,
		message: msg,
		err: err
	};
	return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: statusCode.FORBIDDEN,
		message: msg,
	};
	return res.status(statusCode.FORBIDDEN).json(data);
};
exports.sessionExpired = function (res, msg) {
	var data = {
		status: statusCode.SESSION_EXPIRED,
		message: msg,
	};
	return res.status(statusCode.SESSION_EXPIRED).json(data);
};
exports.refundResponse = function (res, msg, data = []) {
	var data = {
		status: statusCode.REFUND,
		message: msg,
		data:data
	};
	return res.status(statusCode.REFUND).json(data);
};
exports.errHandler = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next))
		.catch(err => {
			console.log("anand",err);
			 res.status(401).json({ "message": "error aa gya hai" })
		});
	
}; 
exports.timeSlotNotAvailResponse = function (res, msg, data = []) {
	var data = {
		status: statusCode.TIME_SLOT_NOT_AVAIL,
		message: msg,
		data:data
	};
	return res.status(statusCode.TIME_SLOT_NOT_AVAIL).json(data);
};
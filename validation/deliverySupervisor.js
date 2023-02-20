const { body, validationResult, check, checkSchema } = require("express-validator");
const { sanitizeBody } = require("express-validator");

const userSchema = require("../models/userModel/userSchema");
const productSchema = require("../models/productModel/productSchema"); 
const apiResponse = require("../helpers/apiResponse");

let response = (req, res, next )=>{
	const errors = validationResult(req);
		  if(!errors.isEmpty()) {
			return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
		  }
		next();
}

let login = [
    body("userName").trim().isLength({ min: 1 }).withMessage("userName is required."),
    body("password").trim().isLength({ min: 1 }).withMessage("password is required."),
	(req, res, next)=>response(req, res, next)
]

let changePassword = [
    body("oldPassword").trim().isLength({ min: 1 }).withMessage("oldPassword is required."),
    body("newPassword").trim().isLength({ min: 1 }).withMessage("newPassword is required."),
	(req, res, next)=>response(req, res, next)
]
module.exports = {
   login,
   changePassword
}
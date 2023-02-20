const { body, validationResult, check, checkSchema, param } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const userSchema = require("../models/userModel/userSchema");
const apiResponse = require("../helpers/apiResponse");

let response = (req, res, next )=>{
  const errors = validationResult(req);
        if(!errors.isEmpty()) {
          return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
        }
      next();
}

let login = 
[
  body("userName").trim().isLength({ min: 1 }).withMessage("userName is required"),
  body('password').trim().isLength({min: 1}).withMessage("password is required"),

  (req, res, next)=>response(req, res, next)
]

let logout = 
[
  body("hubBalanceId").trim().isLength({ min: 1 }).withMessage("hubBalanceId is required"),

  (req, res, next)=>response(req, res, next)
]

//rechargeUserWalet
let rechargeUserWalet = [
  body("userId").trim().isLength({ min: 1 }).withMessage("userId is required").custom((value) => {
    return userSchema.findOne({$and :[{ _id: value }, {userType:"CUSTOMER"}, {status:"ACTIVE"}]}).then((user) => {
      if (!user) {
        return Promise.reject("please provide a valid userId.");
      }
    });
  }),
  body("amount").isInt({gt : 0}).withMessage("amount must be Intiger and greater than 0"),

  (req, res, next)=>response(req, res, next)
]

//insertTransaction
let insertTransaction = [
  checkSchema({
		"paymentMode": {
		  in: 'body',
		  matches: {
			options: [/\b(?:CASH|PAYTM)\b/],
			errorMessage: "Invalid account status"
		  }
		}
    }),
  body("senderId").trim().isLength({ min: 1 }).withMessage("senderId is required"),
  body("amountAdd").isInt({gt : 0}).withMessage("amountAdd must be Intiger and greater than 0"),
    
]

//updateDeviceToken
let updateDeviceToken = [
	checkSchema({
		"deviceType": {
		  in: 'body',
		  matches: {
			options: [/\b(?:ios|android|web)\b/],
			errorMessage: "Invalid deviceType"
		  }
		}
	  }),
	(req, res, next)=>response(req, res, next)
]

//createDemand
let createDemand = [
	(req, res, next)=>response(req, res, next)
]
//--------------------------------------------//

module.exports = {
   login,
   logout,
   rechargeUserWalet,
   insertTransaction,
   updateDeviceToken,
   createDemand

}
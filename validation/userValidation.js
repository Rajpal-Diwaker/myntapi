const { body, validationResult, check, checkSchema } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require('../helpers/apiResponse')

const userSchema = require("../models/userModel/userSchema");



let response = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		errors.errors = errors.errors.map(ele => { 
			if(ele.param ==='phone' && ele.msg =='phone already in use'){	
				ele.msg = req.headers.lang ==='el'? 'Το τηλέφωνο χρησιμοποιείται ήδη':'Phone already in use';		
			}
			if(ele.param ==='email' && ele.msg =='E-mail already in use'){	
				ele.msg = req.headers.lang ==='el'? 'Email already in use':'Email ήδη σε χρήση';		
			}
			return ele;
		})
		return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
	}
	next();
}

let addAddress = [
	/* address,city,state,zipcode,latitude and longitude?? */
	body("address").trim().isLength({ min: 1 }).withMessage("address is required."),

	// body("latitude").trim().isLength({ min: 1 }).withMessage("latitude is required."),
	// body("longitude").trim().isLength({ min: 1 }).withMessage("longitude is required."),
]
let addAreaRequest = [
	body("areaName").trim().isLength({ min: 1 }).withMessage("areaName  is required.")
]
let verfiyOtp = [
	body("otp").trim().isLength({ min: 5 }).withMessage("OTP  is required of length FIVE.")
]

let register = [
	// Validate fields.
	body("fullName").trim().isLength({ min: 1 }).withMessage("Full name must be specified."),
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
			return userSchema.findOne({ $and: [{ email: value }, { userType: 'USER' }] }).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	check('countryCode').isLength({ min: 1 }).trim().withMessage('country Code is require'),
	check('phone').isLength({ min: 1 }).trim().withMessage('phone is require').isNumeric().withMessage('phone should be number').custom((value) => {
		return userSchema.findOne({ $and: [{ phone: value }, { userType: 'USER' }] }).then((user) => {
			if (user) {
				return Promise.reject("phone already in use");
			}
		});
	}),
	check('usedReferralCode').optional().custom((value) => {
		return userSchema.findOne({ myReferralCode: value }).then((user) => {
			if (!user) {
				return Promise.reject("Invalid referral code.");
			}
		});
	}),
	sanitizeBody("fullName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("phone").escape(),
	sanitizeBody("countryCode").escape(),
	(req, res, next) => response(req, res, next)
]

/* mynt social */
let socialSignup = [
	body("fullName").optional().trim().isLength({ min: 1 }).withMessage("Full name must be specified."),
	// body("email").optional().isLength({ min: 1 }).trim().withMessage("Email must be specified.")
	// 	.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
	// 		return userSchema.findOne({ $and: [{ email: value }, { userType: 'USER' }] }).then((user) => {
	// 			if (user) {
	// 				return Promise.reject("E-mail already in use");
	// 			}
	// 		});
	// 	}),
	check('phone').optional().trim().custom((value) => {
		if(!value) return true;
		return userSchema.findOne({ $and: [{ phone: value }, { userType: 'USER' }] }).then((user) => {
			if (user) {
				return Promise.reject("phone already in use");
			}
		});
	}),
	check('usedReferralCode').optional().custom((value) => {
		return userSchema.findOne({ myReferralCode: value }).then((user) => {
			if (!user) {
				return Promise.reject("Invalid referral code.");
			}
		});
	}),
	sanitizeBody("fullName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("phone").escape(),
	sanitizeBody("countryCode").escape(),
	(req, res, next) => response(req, res, next)
]




let accountStatus = [
	checkSchema({
		"status": {
			in: 'body',
			matches: {
				options: [/\b(?:ACTIVE|BLOCK|DELETED|INACTIVE)\b/],
				errorMessage: "Invalid account status"
			}
		}
	})
]

let updatePrimaryAddress = [
	body("addressId").trim().isLength({ min: 1 }).withMessage("addressId must be specified."),
	(req, res, next) => response(req, res, next)
]

let addToCart = [
	body("qty").isInt({ gt: 0 }).withMessage("qty must be Intiger and greater than 1"),
	body("productId").trim().isLength({ min: 1 }).withMessage("productId must be specified.").custom((value) => {
		return productSchema.findOne({ $and: [{ _id: value }, { status: "ACTIVE" }] }).then((user) => {
			if (!user) {
				return Promise.reject("Please provide a valid productId");
			}
		});
	}),
	checkSchema({
		"productType": {
			in: 'body',
			matches: {
				options: [/\b(?:OFFER|GYANSTAR|REGULAR)\b/],
				errorMessage: "Invalid productType"
			}
		}
	}),
	(req, res, next) => response(req, res, next)
]

let subscribeProduct = [
	body("productId").trim().isLength({ min: 1 }).withMessage("productId must be specified."),
	body("fromDate").trim().isLength({ min: 1 }).withMessage("fromDate must be specified."),
	// body("toDate").trim().isLength({ min: 1 }).withMessage("toDate must be specified."),
	checkSchema({
		"deliveryType": {
			in: 'body',
			matches: {
				options: [/\b(?:PICKUP|DELIVERY)\b/],
				errorMessage: "Invalid deliveryType"
			}
		}
	}),
	body("deliveryCharges").trim().isLength({ min: 1 }).withMessage("deliveryCharges must be specified."),
	body("flatNo").trim().isLength({ min: 1 }).withMessage("flatNo must be specified."),
	body("area").trim().isLength({ min: 1 }).withMessage("area must be specified."),
	body("city").trim().isLength({ min: 1 }).withMessage("city must be specified."),
	body("subscriptionDaysType").trim().isLength({ min: 1 }).withMessage("subscriptionDaysType must be specified."),
	// body("subscriptionType").trim().isLength({ min: 1 }).withMessage("subscriptionType must be specified."),
	// body("zipcode").trim().isLength({ min: 1 }).withMessage("zipcode must be specified."),
	//weeklyData

	(req, res, next) => response(req, res, next)
]

let updateSubscriptionData = [
	body("productId").trim().isLength({ min: 1 }).withMessage("productId must be specified."),
]

let updateAccountStatus = [
	checkSchema({
		"status": {
			in: 'body',
			matches: {
				options: [/\b(?:ACTIVE|BLOCK|DELETED|INACTIVE)\b/],
				errorMessage: "Invalid account status"
			}
		}
	}),
	(req, res, next) => response(req, res, next)
]

let login = [
	check('phone').isLength({ min: 1 }).trim().withMessage('phone is require'),//.isNumeric().withMessage('phone should be number'),
	sanitizeBody("phone").escape(),
	(req, res, next) => response(req, res, next)
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
	(req, res, next) => response(req, res, next)
]

//updateDeliveryOptions
let updateDeliveryOptions = [
	checkSchema({
		"deliveryOption": {
			in: 'body',
			matches: {
				options: [/\b(?:DTD|HTH)\b/],
				errorMessage: "Invalid deliveryOption"
			}
		}
	}),
	(req, res, next) => response(req, res, next)
]

//buyOnce
let buyOnce = [
	checkSchema({
		"deliveryType": {
			in: 'body',
			matches: {
				options: [/\b(?:DELIVERY|PICKUP)\b/],
				errorMessage: "Invalid deliveryType"
			}
		}
	}),
	// body("subtotal").isInt({gt : 0}).withMessage("subtotal must be Intiger and greater than 0"),
	// body("GrandTotal").isInt({gt : 0}).withMessage("GrandTotal must be Intiger and greater than 0"),
	check('area').isLength({ min: 1 }).trim().withMessage('area is require'),
	check('city').isLength({ min: 1 }).trim().withMessage('city is require'),
	//   check('zipcode').isLength({ min: 1 }).trim().withMessage('zipcode is require'),



	(req, res, next) => response(req, res, next)
]
//addPickup
let addPickup = [
	check('gfsId').isLength({ min: 1 }).trim().withMessage('gfsId is require').custom((value) => {
		return gfsSchema.findOne({ $and: [{ _id: value }, { status: "ACTIVE" }] }).then((user) => {
			if (!user) {
				return Promise.reject("Please provide a valid gfsId");
			}
		});
	}),
	(req, res, next) => response(req, res, next)
]

//pauseSingleSubscription
let pauseSingleSubscription = [
	checkSchema({
		"status": {
			in: 'body',
			matches: {
				options: [/\b(?:SINGLE_PAUSED|INITIATED)\b/],
				errorMessage: "Invalid status"
			}
		}
	}),
	(req, res, next) => response(req, res, next)
]

//validate calculateAmount API
let calculateAmount = [
	body('totalFee').isLength({ min: 1 })
	.trim().withMessage('Total fee is required.')
	.isNumeric().withMessage('Total fee should be integer'),
	(req, res, next) => response(req, res, next)
]

//validate sendGiftCard API
let sendGiftCard = [
	body('cardId').isLength({ min: 1 })
	.trim().withMessage('cardId is required.'),
	body('cardCustomerToken').isLength({ min: 1 })
	.trim().withMessage('cardCustomerToken is required.'),
	body('giftCardId').isLength({ min: 1 })
	.trim().withMessage('Gift Card is required.'),
	body("email").isLength({ min: 1 }).trim().withMessage("Email is required.")
		.isEmail().withMessage("Email must be a valid email address."),
	(req, res, next) => response(req, res, next)
]
module.exports = {

	/* mynt */
	socialSignup,
	addAddress,
	register,
	/* mynt */

	addAreaRequest,
	verfiyOtp,
	accountStatus,
	updatePrimaryAddress,
	addToCart,
	subscribeProduct,
	updateSubscriptionData,
	login,
	updateDeviceToken,
	updateDeliveryOptions,
	buyOnce,
	addPickup,
	pauseSingleSubscription,
	calculateAmount,
	sendGiftCard
}
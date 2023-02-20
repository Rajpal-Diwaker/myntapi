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
let login = [
    body("email").trim().isLength({ min: 1 }).withMessage("Email is required.").isEmail().withMessage("Invalid Email format"),
    body("password").trim().isLength({ min: 1 }).withMessage("Password is required.")
]

let customerStatus = [
    checkSchema({
        "status": {
          in: 'body',
          matches: {
            options: [/\b(?:ACTIVE|INACTIVE|DELETED|BLOCK)\b/],
            errorMessage: "Invalid status"
          }
        }
      })
]

let addHubUser = 
[
  // checkSchema({
  //   "userType": {
  //     in: 'body',
  //     matches: {
  //       options: [/\b(?:HUB|CASH_COLLECTOR|CHAMPION_SUPERVISOR)\b/],
  //       errorMessage: "Invalid userType"
  //     }
  //   }
  // }),
  body("userName").trim().isLength({ min: 1 }).withMessage("userName is required.").custom((value, {req}) => {
      return userSchema.findOne({$and :[{ userName: value },{userType: req.body.userType}]}).then((user) => {
      if (user) {
        return Promise.reject("userName already in use");
      }
    });

  }),
  body("fullName").trim().isLength({ min: 1 }).withMessage("fullname is required."),
  body("licenseNumber").trim().isLength({ min: 1 }).withMessage("licenseNumber is required."),
  body("designation").trim().isLength({ min: 1 }).withMessage("designation is required."),
  body("gfs").trim().isLength({ min: 1 }).withMessage("gfs is required."),
  // body("phone").trim().isLength({ min: 1 }).withMessage("phone is required.")
  // .custom((value, {req}) => {
  //   if(req.body.designation !== "MANAGER"){
  //     return userSchema.findOne({$and :[{ phone: value }, {userType: req.body.userType || "HUB"}]}).then((user) => {
  //       if (user) {
  //         return Promise.reject("phone already in use");
  //       }
  //     });
  //   }
  // }),
]

let updateChampionDetail = 
[
  body("fullName").trim().isLength({ min: 1 }).withMessage("FullName is required"),
  body('registrationDate').trim().isLength({min: 1}).withMessage("RegistrationDate is required"),
  body('countryCode').trim().isLength({min:1}).withMessage("CountryCode is required"),
  body('town').trim().isLength({min:1}).withMessage("Town is required"),
  body('cluseterId').trim().isLength({min: 1}).withMessage("ClusterId is required"),
  body('area').isArray().withMessage("Area must me in an array"),
  body('gfs').isArray().withMessage("GFS must me in an array"),  
  body('phone').trim().isLength({min:1}).withMessage("Phone is required").isNumeric().withMessage("Phone must be a number")  ,
  sanitizeBody("fullName").escape(),
  sanitizeBody("email").escape(),
  sanitizeBody("phone").escape(),
  sanitizeBody("countryCode").escape(),
  (req, res, next)=>response(req, res, next)
]

let updateAppHomeStatus = [
  checkSchema({
      "status": {
        in: 'body',
        matches: {
          options: [/\b(?:ACTIVE|INACTIVE)\b/],
          errorMessage: "Invalid status"
        }
      }
    }),
    (req, res, next)=>response(req, res, next)
]

//updateAppHomeData
let updateAppHomeData = [
    body("title").isLength({ min: 1 }).trim().withMessage("title is must"),
    check('subtitle').isLength({ min: 1 }).trim().withMessage('subtitle is require'),
    (req, res, next)=>response(req, res, next)
]

let addTimeSlot = [
  body("from").trim().isLength({min: 1}).withMessage("from is required"),
  body('to').trim().isLength({min: 1}).withMessage("to is required"),
  (req, res, next)=>response(req, res, next)
]

let updateproductStatus = [
  checkSchema({
      "status": {
        in: 'body',
        matches: {
          options: [/\b(?:ACTIVE|INACTIVE)\b/],
          errorMessage: "Invalid status"
        }
      }
    }),
    (req, res, next)=>response(req, res, next)
]

//updatecategoryStatus
let updatecategoryStatus = [
  checkSchema({
      "status": {
        in: 'body',
        matches: {
          options: [/\b(?:ACTIVE|INACTIVE)\b/],
          errorMessage: "Invalid status"
        }
      }
    }),
    (req, res, next)=>response(req, res, next)
]

//addSuggestions
let addSuggestions = 
[
  body("suggestion").trim().isLength({ min: 1 }).withMessage("suggestion is required"),
  checkSchema({
    "suggestionFor": {
      in: 'body',
      matches: {
        options: [/\b(?:HUB|CHAMPION|CUSTOMER|DISPUTE|SEMI_DELIVERED)\b/],
        errorMessage: "Invalid suggestionFor it should be HUB|CHAMPION|CUSTOMER|DISPUTE"
      }
    }
  }),
  (req, res, next)=>response(req, res, next)
]

//sendNotifications
let sendNotifications = 
[
  (req, res, next)=>response(req, res, next)
]

//saveNotifTemp
let saveNotifTemp =[
  (req, res, next)=>response(req, res, next)
]

//updateDemandStatus
let updateDemandStatus = 
[
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACCEPTED|REJECTED|INITIATED)\b/],
        errorMessage: "Invalid status it should be ACCEPTED|REJECTED|INITIATED"
      }
    }
  }),
  (req, res, next)=>response(req, res, next)
]
//editHubUser
let editHubUser = [
  body("email").trim().isLength({ min: 1 }).withMessage("email is required"),
  body("fullName").trim().isLength({ min: 1 }).withMessage("fullName is required"),
  checkSchema({
    "designation":{
      in: 'body',
      matches: {
        options: [/\b(?:MANAGER|CASHIER|ADMIN|CASH_COLLECTOR|CHAMPION_SUPERVISOR)\b/],
        errorMessage: "Invalid designation it should be MANAGER|CASHIER|ADMIN|CASH_COLLECTOR|CHAMPION_SUPERVISOR"
      }
    },
  }),
  (req, res, next)=>response(req, res, next)
]

//updateHubUserStatus
let updateHubUserStatus = [
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACTIVE|INACTIVE|DELETED|BLOCK)\b/],
        errorMessage: "Invalid status it should be ACTIVE|INACTIVE|DELETED|BLOCK"
      }
    }
  }),
  (req, res, next)=>response(req, res, next)
]

//deleteUserGroup
let deleteUserGroup = [
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACTIVE|INACTIVE)\b/],
        errorMessage: "Invalid status it should be ACTIVE|INACTIVE"
      }
    }
  }),
  (req, res, next)=>response(req, res, next)
]

//returnReport
let returnReport = [
  checkSchema({
    "deliveryType": {
      in: 'body',
      matches: {
        options: [/\b(?:PICKUP|DELIVERY)\b/],
        errorMessage: "Invalid deliveryType it should be PICKUP|DELIVERY"
      }
    }
  }),
  (req, res, next)=>response(req, res, next)
]

//inactiveBanner
let inactiveBanner = [
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACTIVE|INACTIVE)\b/],
        errorMessage: "Invalid status it should be ACTIVE|INACTIVE"
      }
    }
  }),
  (req, res, next)=>response(req, res, next)
]

//addChampion
let addChampion = [
  body('userName').trim().isLength({ min: 1 }).withMessage("userName is required").isNumeric().withMessage("userName must be a number").custom((value) => {
    return userSchema.findOne({ $and: [{ userName: value }, { userType: 'CHAMPION' }] }).then((user) => {
        if (user) {
            return Promise.reject("userName already in use");
        }
    });
}),
body("fullName").trim().isLength({ min: 1 }).withMessage("FullName is required"),
body('registrationDate').trim().isLength({ min: 1 }).withMessage("RegistrationDate is required"),
body('countryCode').trim().isLength({ min: 1 }).withMessage("CountryCode is required"),
body('town').trim().isLength({ min: 1 }).withMessage("Town is required"),
body('cluseterId').trim().isLength({ min: 1 }).withMessage("ClusterId is required"),
body('area').isArray().withMessage("Area must me in an array"),
body('gfs').isArray().withMessage("GFS must me in an array"),
body('phone').trim().isLength({ min: 1 }).withMessage("Phone is required").isNumeric().withMessage("Phone must be a number").custom((value) => {
    return userSchema.findOne({ $and: [{ phone: value }, { userType: 'CHAMPION' }] }).then((user) => {
        if (user) {
            return Promise.reject("Phone already in use");
        }
    });
}),

sanitizeBody("fullName").escape(),
sanitizeBody("email").escape(),
sanitizeBody("phone").escape(),
sanitizeBody("countryCode").escape(),
  (req, res, next)=>response(req, res, next)
]
//--------------------------------------------//

//Validate Add Credit Management
const addCredit = [
  body("point").trim().isLength({ min: 1 }).withMessage("Piont is required"),
  body("percentage").trim().isLength({ min: 1 }).withMessage("Percentage is required."),
  (req, res, next) => response(req, res, next)
]

//Validate Update Credit Management
const updateCredit = [
  body("point").trim().optional().isLength({ min: 1 }).withMessage("Piont is required"),
  body("percentage").trim().optional().isLength({ min: 1 }).withMessage("Percentage is required."),
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACTIVE|INACTIVE)\b/],
        errorMessage: "Invalid status it should be ACTIVE|INACTIVE"
      },
      optional: { options: { nullable: true } },
    }
  }),
  (req, res, next) => response(req, res, next)
]

//Validate Add SubAdmin
const addSubAdmin = [
	body("fullName").trim().isLength({ min: 1 }).withMessage("Full name must be specified."),
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
			return userSchema.findOne({email: value}).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	check('countryCode').isLength({ min: 1 }).trim().withMessage('country Code is require'),
	check('phone').isLength({ min: 1 }).trim().withMessage('phone is require').isNumeric().withMessage('phone should be number').custom((value) => {
		return userSchema.findOne({phone: value}).then((user) => {
			if (user) {
				return Promise.reject("phone already in use");
			}
		});
	}),
  body('permission').isArray().withMessage("Permission must me in an array"),
	sanitizeBody("fullName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("phone").escape(),
	sanitizeBody("countryCode").escape(),
	(req, res, next) => response(req, res, next)
]
//Validate Update SubAdmin
const updateSubAdmin = [
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACTIVE|INACTIVE)\b/],
        errorMessage: "Invalid status it should be ACTIVE|INACTIVE"
      },
      optional: { options: { nullable: true } },
    }
  }),
  (req, res, next) => response(req, res, next)
]

//Validate Add Faq
const addFaqList = [
  body("question").trim().isLength({ min: 1 }).withMessage("English Question is required"),
  body("answer").trim().isLength({ min: 1 }).withMessage("English Answer is required."),
  body("question2").trim().isLength({ min: 1 }).withMessage("Greek Question is required"),
  body("answer2").trim().isLength({ min: 1 }).withMessage("Greek Answer is required."),
  (req, res, next) => response(req, res, next)
]
//Validate Update FaqList Management
const updateFaqList = [
  body("question").trim().optional().isLength({ min: 1 }).withMessage("English Question is required"),
  body("answer").trim().optional().isLength({ min: 1 }).withMessage("English Answer is required."),
  body("question2").trim().optional().isLength({ min: 1 }).withMessage("Greek Question is required"),
  body("answer2").trim().optional().isLength({ min: 1 }).withMessage("Greek Answer is required."),
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACTIVE|INACTIVE)\b/],
        errorMessage: "Invalid status it should be ACTIVE|INACTIVE"
      },
      optional: { options: { nullable: true } },
    }
  }),
  checkSchema({
    "userType": {
      in: 'body',
      matches: {
        options: [/\b(?:PRO|USER)\b/],
        errorMessage: "Invalid userType, It should be PRO|USER"
      },
      optional: { options: { nullable: true } },
    }
  }),
  (req, res, next) => response(req, res, next)
]


//Validate Add Gift Card
const addGiftCard = [
  body("name").trim().isLength({ min: 1 }).withMessage("English Name is required"),
  body("name2").trim().isLength({ min: 1 }).withMessage("Greek Name is required"),
  body("price").trim().isLength({ min: 1 }).withMessage("Price is required."),
  (req, res, next) => response(req, res, next)
]

//Validate Update Gift Card
const updateGiftCard = [
  body("name").trim().optional().isLength({ min: 1 }).withMessage("English Name is required"),
  body("name2").trim().optional().isLength({ min: 1 }).withMessage("Greek Name is required"),
  body("price").trim().optional().isLength({ min: 1 }).withMessage("Price is required."),
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACTIVE|INACTIVE)\b/],
        errorMessage: "Invalid status it should be ACTIVE|INACTIVE"
      },
      optional: { options: { nullable: true } },
    }
  }),
  (req, res, next) => response(req, res, next)
]

//Validate Add Cms Page
const addCmsPage = [
  body("title").trim().isLength({ min: 1 }).withMessage("English Title is required"),
  body("text").trim().isLength({ min: 1 }).withMessage("English Text is required."),
  body("title2").trim().isLength({ min: 1 }).withMessage("Greek Title is required"),
  body("text2").trim().isLength({ min: 1 }).withMessage("Greek Text is required."),
  (req, res, next) => response(req, res, next)
]

//Validate Update Cms Page
const updateCmsPage = [
  body("title").trim().optional().isLength({ min: 1 }).withMessage("English Title is required"),
  body("text").trim().optional().isLength({ min: 1 }).withMessage("English Text is required."),
  body("title2").trim().optional().isLength({ min: 1 }).withMessage("Greek Title is required"),
  body("text2").trim().optional().isLength({ min: 1 }).withMessage("Greek Text is required."),
  checkSchema({
    "status": {
      in: 'body',
      matches: {
        options: [/\b(?:ACTIVE|INACTIVE)\b/],
        errorMessage: "Invalid status it should be ACTIVE|INACTIVE"
      },
      optional: { options: { nullable: true } },
    }
  }),
  (req, res, next) => response(req, res, next)
]

//Validate forgetPassword API
const forgetPassword = [
  body("email").trim().isLength({ min: 1 }).withMessage("Email is required.").isEmail().withMessage("Invalid Email format"),
  (req, res, next) => response(req, res, next)
]

//Validate changePassword API
const changePassword = [
  body("newpsw").trim().isLength({ min: 1 }).withMessage("New Password is required."),
  (req, res, next) => response(req, res, next)
]


module.exports = {
   login,
   customerStatus,
   addHubUser,
   updateChampionDetail,
   updateAppHomeStatus,
   updateAppHomeData,
   addTimeSlot,
   updateproductStatus,
   updatecategoryStatus,
   addSuggestions,
   sendNotifications,
   saveNotifTemp,
   updateDemandStatus,
   editHubUser,
   updateHubUserStatus,
   deleteUserGroup,
   returnReport,
   inactiveBanner,
   addChampion,
   addCredit,
   updateCredit,
   addSubAdmin,
   updateSubAdmin,
   addFaqList,
   updateFaqList,
   addGiftCard,
   updateGiftCard,
   addCmsPage,
   updateCmsPage,
   forgetPassword,
   changePassword
}
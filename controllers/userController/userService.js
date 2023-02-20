/* eslint-disable indent */
const userSchema            = require("../../models/userModel/userSchema");
const commonEnum            = require("../../config/config").CommonEnum;
const ccavResHtml           = require("../../helpers/templates/ccavResHandler");
const fcmNotification       = require("../../helpers/fcmNotification");
const stringMessages        = require("../../config/config").StringMessages;
const multiparty            = require("multiparty");
const qs                    = require("querystring");
const transactionsTemplate  = require("../../helpers/templates/mailTransactions");
const feedbackTemp          = require("../../helpers/templates/feedback");
const feedbackResponse      = require("../../helpers/templates/feedbackResponse");
const gitfCardEmailTemplate = require("../../helpers/templates/giftEmail");

const moment                = require("moment");
const statusCode            = require("../../config/config").statusCode;
const statusMessage         = require("../../config/config").statusMessage;
const statusMessageGr       = require("../../config/config").statusMessageGr;
const config                = require("../../config/config");
const mongoose              = require("mongoose");
const nodeCCAvenue          = require("node-ccavenue");
const util                  = require("../../helpers/utility");
const ccav = new nodeCCAvenue.Configure({
  merchant_id: process.env.CCAV_merchant_id,
  working_key:
    process.env.CCAV_test_working_key || process.env.prod_working_key,
});
const { body, validationResult, check } = require("express-validator");
const async                 = require("async");
const { sanitizeBody }      = require("express-validator");
const apiResponse           = require("../../helpers/apiResponse");
const utility               = require("../../helpers/utility");
const paymentHelper         = require("../../helpers/payment");
const bcrypt                = require("bcryptjs");
const bcryptjs              = require("bcryptjs");
const jwt                   = require("jsonwebtoken");
const mailer                = require("../../helpers/mailer");
const { constants }         = require("../../helpers/constants");
const myntCategoryModel     = require("../../models/myntSchema/categorySchema");
const myntSubCategoryModel  = require("../../models/myntSchema/subCategorySchema");
const myntWeddingModel      = require("../../models/myntSchema/weddingSchema");
const myntBookModel         = require("../../models/myntSchema/bookingschema");
const myntRewardModel       = require("../../models/myntSchema/rewardspointSchema");
const myntGiftCardModel     = require("../../models/myntSchema/giftCardSchema");
const myntSendGiftCardModel = require("../../models/myntSchema/sendGiftCard");
const giftCardTransactionModel = require("../../models/myntSchema/giftCardTransaction");
const myntContactModel      = require("../../models/myntSchema/contactSchema");
const myntReviewRatingModel = require("../../models/myntSchema/proFeedback");
const myntPhotoShootModel   = require("../../models/myntSchema/photoshootRequest");
const myntFaq               = require("../../models/myntSchema/faq");
const myntCalender          = require("../../models/myntSchema/myntCalender");
const notification          = require("../../models/myntSchema/notification");
const myntblockProfessional5Min = require("../../models/myntSchema/myntblockProfessional5Min");
const paymentCardModel      = require("../../models/myntPayment/paymentCard");
const paymentModel          = require("../../models/myntPayment/payment");
const myntSettingModel      = require("../../models/myntSchema/myntSetting");
const myntCmsPageModel          = require("../../models/myntSchema/myntCmsPage");

/**
 *
 * User registration.
 *
 * @param {string}      fullName
 * @param {string}      countryCode
 * @param {string}      email
 * @param {string}      phone
 * @returns {Object}
 */
let register = (req, res) => {
  let otp = 12345; /*  utility.randomNumber(6).toString(); */
  async.waterfall(
    [
      (cb) => {
        let user = {
          fullName: req.body.fullName,
          email: req.body.email || "",
          countryCode: req.body.countryCode,
          phone: req.body.phone,
          userType: req.body.userType || "USER" /* USER,PRO */,
          usedReferralCode: req.body.usedReferralCode || "",
          myReferralCode: utility.makePassword(10).toUpperCase(),
          OTP: otp,
          completeProfile: true,
        };
        userSchema.create(user, (err, result) => {
          if (err) {
            return cb(null, apiResponse.ErrorResponse(res, err), null);
          }
          return cb(null, result);
        });
      },
      (userData, cb) => {
        let dataToSet = { token: utility.jwtEncode(userData._id) };
        userSchema
          .findOneAndUpdate({ _id: userData._id }, dataToSet, { new: true })
          .exec(async (err, updatedUser) => {
            if (err) {
              return cb(null, apiResponse.ErrorResponse(res, err), null);
            }
            if (req.body.usedReferralCode) {
              await referralCodeUpdate(userData._id , req.body.usedReferralCode);
              updatedUser = await userSchema.findOne({ _id : userData._id }).lean().exec();
            }
            //update User wallet if he has any gift received from his friends
            updateUserWalletPostSignUp(updatedUser)
            if(req.headers.lang === "el")
              cb(null,apiResponse.successResponseWithData(res,statusMessageGr.REGISTER,updatedUser))
            else
              cb(null,apiResponse.successResponseWithData(res,statusMessage.REGISTER,updatedUser));
          });
      },
    ],
    (err, res) => {}
  );
};

/*******************Update User Wallete post signup 
 * @params data object
*/ 
const updateUserWalletPostSignUp = (data) =>{
  return new Promise(async(resolve, reject) =>{
    try{
      let toUpdateData = await myntSendGiftCardModel.find({email : data.email}).lean().exec();
      await myntSendGiftCardModel.updateMany({email : data.email}, {$set:{receiverId:data._id}}).exec();
      //create transaction history
      for(let i = 0; i < toUpdateData.length; i++){
        await giftCardTransactionModel.create({
          userId :  data._id,
          amount : toUpdateData[i].amount,
          title  : config.notificationContentEn.giftCardTransactionTitleIn,
          title2  : config.notificationContentEl.giftCardTransactionTitleIn,
          senderId : toUpdateData[i].senderId,
        });
      }
      return resolve(true);
    }catch(e){
      reject(e); 
    }
  });
}
/*************************END************************/


/*******************Update User Referal Point for both sender and receiver 
 * @params userId receiver user Id (newly register user Id)
 * @params refcode referal code of old user which new user used to get point;
*/ 
const referralCodeUpdate = (userId, refcode) => {
  return new Promise(async(resolve, reject) =>{
    try{
      let getReferalSetting = await myntSettingModel.findOne().lean().exec();
      if(!getReferalSetting) return reject(true);
      await userSchema.updateOne({_id: userId}, { $inc : { userPoint: getReferalSetting.referAndEarn.receiver }}).exec();
      await userSchema.updateOne({ myReferralCode: refcode }, { $inc : { userPoint: getReferalSetting.referAndEarn.sender }}).exec();
      resolve(true);
    }catch(err){
      reject(true)
    }
  });
};
/*************************END**************************/
/**
 * User registration.
 *
 * @param {string}      fullName
 * @param {string}      countryCode
 * @param {string}      email
 * @param {string}      phone
 * @returns {Object}
 */
let socialSignup = (req, res) => {
  let otp = 12345; /*  utility.randomNumber(6).toString(); */
  async.waterfall(
    [
      (cb) => {
        let user = {
          fullName: req.body.fullName,
          email: req.body.email || "",
          countryCode: req.body.countryCode,
          phone: req.body.phone,
          userType: req.body.userType || "USER",
          usedReferralCode: req.body.usedReferralCode || "",
          myReferralCode: utility.makePassword(10).toUpperCase(),
          signupType: req.body.signupType || "MANUAL",
          OTP: otp,
        };
        let orArray = [{ userType: 'USER'}];
        user.phone ? orArray.push({ phone: user.phone }) : true;
        user.email ? orArray.push({ email: user.email }) : true;
        let query = {
          $and: orArray,
        };
        userSchema.findOne(query).exec((err, result) => {
          if (err) {
            return cb(apiResponse.ErrorResponse(res, err), null);
          } else if (result) {
            return cb(null, result);
          } else {
            if (
              req.body.checkSocialLogin == true ||
              req.body.checkSocialLogin == "true"
            ) {
              return cb(null, true);
            }
            userSchema.create(user, (err, result) => {
              if (err) {
                return cb(apiResponse.ErrorResponse(res, err), null);
              }
              // check if referal code then uodate his credit point
              if (req.body.usedReferralCode) {
                referralCodeUpdate(result._id , req.body.usedReferralCode);
              }
              //update User wallet if he has any gift received from his friends
              updateUserWalletPostSignUp(result)
              return cb(null, result);
            });
          }
        });
      },
      (userData, cb) => {
        if (userData == true) {
          return cb(
            null,
            apiResponse.notFoundResponse(res, "Need to register", {})
          );
        }
        let dataToSet = { token: utility.jwtEncode(userData._id) };
        userSchema
          .findOneAndUpdate({ _id: userData._id }, dataToSet, { new: true })
          .exec((err, updatedUser) => {
            if (err) {
              return cb(apiResponse.ErrorResponse(res, err), null);
            }
            if(req.headers.lang === "el")
              cb(null,apiResponse.successResponseWithData(res,statusMessageGr.REGISTER,updatedUser));
            else
              cb(null,apiResponse.successResponseWithData(res,statusMessage.REGISTER,updatedUser));
          });
      },
    ],
    (err, res) => {}
  );
};

/**
 * //////////////////getProfessionalList////////////////////.
 * @returns {Object} // for normal case
 */

let getProfessionalList =async(req, res) => {
    try {
      const userId = req.headers.decoded_id;
      await removeTemporaryBooking();
      let currentStartDate = new Date(new Date().setUTCHours(0, 0, 0, 0))
      let currentEndDate = new Date(new Date().setUTCHours(23, 59, 59, 999))
      myntBookModel.aggregate([
        { $match: {
          userId: mongoose.Types.ObjectId(userId),
          status: 'ACCEPTED',
          createdAt: { $gte: currentStartDate, $lt:currentEndDate}
        }},
        {$lookup: { from: 'userSchema', localField:'professionalId' ,foreignField:'_id', as: 'professionalId'}},
        {$unwind: '$professionalId'},
        {
          $addFields: {
            avgRating: "$professionalId.reviewAndRating.rating",
          },
        },
        { $project: 
          {
            "_id": "$professionalId._id",
            "phone": "$professionalId.phone",
            "countryCode": "$professionalId.countryCode",
            "completeProfile": "$professionalId.completeProfile",
            "fullName": { $concat: [ "$professionalId.firstName", "  ", "$professionalId.lastName" ]},
            "email": "$professionalId.email",
            "userName": "$professionalId.userName",
            "myReferralCode": "$professionalId.myReferralCode",
            "userType": "$professionalId.userType",
            "status": "$professionalId.status",
            "image": "$professionalId.image",
            "thumbnail": "$professionalId.thumbnail",
            "favProfessional": "$professionalId.favProfessional",
            "firstName": "$professionalId.firstName",
            "lastName": "$professionalId.lastName",
            "message": "$professionalId.message",
            "professionalLevel": "$professionalId.professionalLevel",
            "timeSlot": "$timeSlot",
            "createdAt": "$professionalId.createdAt",
            "updatedAt": "$professionalId.updatedAt",
            "myReferralCodePrice": "$professionalId.myReferralCodePrice",
            "bioData": "$professionalId.bioData",
            "portfolio": "$professionalId.portfolio",
            "deviceToken": "$professionalId.deviceToken",
            "deviceType": "$professionalId.deviceType",
            "userPoint": "$professionalId.userPoint",
            "proIdCalender": [],
            "deviceToken": "$professionalId.deviceToken",
            "deviceToken": "$professionalId.deviceToken",
            "avgRating": 1,
            "rating": "5",
            "price": "$price",
            "description": "$description",
            "time": "$levelTime",
            "bookingId": "$_id"
        }},
      ])
      .exec( (err, result) => {
        if (err || !result || result.length == 0) {
          if(req.headers.lang === "el")
              return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
          else
              return apiResponse.successResponseWithData(res,statusMessage.success,[]);
        }
        result = result.filter((el, i) => {
          el.avgRating = el.avgRating.map((i) => Number(i));
          el.rating =(el.avgRating.reduce((a, b) => a + b, 0) / el.avgRating.length).toString() || "0";
          if (el.rating === "NaN") el.rating = "5";
          el.time = el.time.toString();
          el.rating = (Number(el.rating)).toFixed(0);
          return true;
        });

        if(req.headers.lang === "el")
            apiResponse.successResponseWithData(res,statusMessageGr.success,result);
        else
            apiResponse.successResponseWithData(res,statusMessage.success,result);
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  };

// let getProfessionalList =(req, res) => {
//   try {
//     const userId = req.headers.decoded_id;
//     let dt=req.query.date.split("/");
//     let years=dt[0];
//     let month=dt[1].indexOf("0")==0 ? dt[1].substring(1) : dt[1];
//     let dates=dt[2].indexOf("0")==0 ? dt[2].substring(1) : dt[2];

//     req.query.date=years+"-"+month+"-"+dates;

//     let position = [];
//     req.query.subcategory.split(",").forEach((element) => {
//       position.push(mongoose.Types.ObjectId(element));
//       return true;
//     });
//     let criteria = [
//       { status: req.query.status || "ACTIVE" },
//       { professionalLevel: req.query.level || "" },
//       { userType: req.query.userType || "PRO" },
//       { 'proIdCalender.timeLog.time':req.query.time },
//       { 'proIdCalender.timeLog.isSelected':1 },
//       { 'proIdCalender.timeLog.isBooked':0 },
//     ];

//     req.query.subcategory
//       ? criteria.push({ position: { $in: position } })
//       : true;
//     // console.log(criteria.position);

//     let query = [{
//         $lookup: {
//           from: "myntCalender",
//           let: { proId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$proId", "$$proId"] },
//                     { $eq: ["$status", "ACTIVE"] },
//                     { $eq: ["$calenderDate", req.query.date] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "proIdCalender",
//         },
//       },
//       {
//         $addFields: {
//           avgRating: "$reviewAndRating.rating",
//         },
//       },
//       {
//         $unwind: { path: "$proIdCalender" },
//       },
//       { $match: { $and: criteria } },
//       { $sort: { _id: 1 } },
//     ];
//     // console.log(query);
//     userSchema.aggregate(query, (err, result) => {
//       if (err || !result || result.length == 0) {
//         if(req.headers.lang === "el")
//             return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
//         else
//             return apiResponse.successResponseWithData(res,statusMessage.success,[]);
//       }
//       result = result.filter((el, i) => {
//         el.avgRating = el.avgRating.map((i) => Number(i));
//         el.rating =
//           (
//             el.avgRating.reduce((a, b) => a + b, 0) / el.avgRating.length
//           ).toString() || "0";
//         if (el.rating === "NaN") el.rating = "5";
//         el.price = req.query.price || el.price || "20";
//         el.description =
//           el.message ||
//           "That produces value is that primarily intangible such as customer service, management, advice, knowledge, design, data and experiences";
//         el.time = req.query.levelTime || el.levelTime || "45";
//         el.timeSlot = req.query.time;
//         // el.rating = "5";
//         el.fullName = el.fullName || el.firstName + " " + el.lastName;
//         delete el.deviceIds;
//         delete el.OTP;
//         delete el.verifyEmail;
//         delete el.verifyPhone;
//         delete el.password;
//         delete el.usedReferralCode;
//         delete el.signupType;
//         delete el.inactiveTime;
//         delete el.token;
//         delete el.position;
//         delete el.yearOfExperience;
//         delete el.workedWithCeleb;
//         delete el.workedWithTV;
//         delete el.location;
//         delete el.registrationDate;
//         delete el.uniqueId;
//         return true;
//       });

//       let proIds = [];
//       let bookingIds = [];

//       // console.log("result",result)

//       // checking who's professional Accepting the request
//       myntBookModel.find({status: "ACCEPTED",
//       timeSlot: req.query.time,
//       date: new Date(req.query.date),
//         },
//         async (err, responceData) => {

//           responceData = responceData.filter((ele) => {
//             proIds.push(ele.professionalId.toString());
//             bookingIds.push(ele._id.toString());
//           });

//           console.log("bookingIds", bookingIds);
//           console.log("proIds", proIds);

//           let resultData = [];
//           result.filter((el, i) => {
//             if (proIds.includes(el._id.toString())) {
//               el.bookingId = bookingIds[proIds.indexOf(el._id.toString())];
//               resultData.push(el);
//             }
//           });

//           console.log("resultData.length", resultData.length);

//           if(req.headers.lang === "el")
//               apiResponse.successResponseWithData(res,statusMessageGr.success,resultData);
//           else
//               apiResponse.successResponseWithData(res,statusMessage.success,resultData);
//         }
//       );
//     });
//   } catch (err) {
//     return apiResponse.ErrorResponse(res, err);
//   }
// };

// /******************** filterRequestData ********************/
// /******************** filterRequestData ********************/
// const filterRequestData = async (result,proIds) => {
//   try {
//     let tp=[];
//     return new Promise((resolve, reject) => {

//       // result.foreach((el) => {
//         result.forEach((el) => {

//           tp.push(el._id.toString());
//             if(proIds.includes(el._id.toString())){
//               console.log("=>Value Exist START",el._id)
//             }else{
//               console.log("=>Value NOT Exist START",el._id)
//             }
//         })
//         resolve(tp)
//     });
//   } catch (e) {
//     return Promise.reject(e.toString());
//   }
// };

// /**
//  * //////////////////getProfessionalList////////////////////.
//  * @returns {Object}
//  */
//  let getProfessionalList = [
// 	(req, res) => {
// 		try {

// 			console.log("criteria",req.query)

// 			let position = []
// 			req.query.subcategory.split(',').forEach(element => {
// 				position.push(mongoose.Types.ObjectId(element))
// 				return true
// 			})
// 			let criteria = [
// 				{ status: req.query.status || 'ACTIVE' },
// 				{ professionalLevel: req.query.level || '' },
// 				{ userType: req.query.userType || 'PRO' }
// 			]
// 			// req.query.level ? criteria.push({ professionalLevel: req.query.level }) : true;
// 			req.query.subcategory ? criteria.push({ position: { $in: position } }) : true;

// 			console.log("criteria",criteria)

// 			let query = [
// 				{
// 					$match: {
// 						$and: criteria
// 					}
// 				},{
//                     "$lookup": {
//                         "from": 'userSchema',
//                         "let": {
//                             "user_Id": "$_id",
//                         },
//                         "pipeline": [
//                             {
//                                 $match: {
//                                     $expr: {
//                                         $and: [
//                                             { $eq: ["$user_Id", "$$proId"] },
//                                             // { $eq: ["$status", "ACTIVE"] }
//                                         ]
//                                     }
//                                 }
//                             }
//                         ],
//                         "as": "subCategory"
//                     }
//                 },
// 				{ "$sort": { "_id": 1 } }
// 			]
// 			userSchema.aggregate(query, (err, result) => {
// 				if (err || !result || result.length == 0) {
// 					return apiResponse.successResponseWithData(res, statusMessage.success, [])
// 				}
// 				result = result.filter((el, i) => {
// 					el.price = req.query.price || el.price || '20';
// 					el.description = el.message || 'That produces value is that primarily intangible such as customer service, management, advice, knowledge, design, data and experiences';
// 					el.time = req.query.levelTime || el.levelTime || "45";
// 					el.timeSlot = req.query.time;
// 					el.rating = '5'
// 					el.fullName = el.fullName || el.firstName + ' ' + el.lastName;
// 					delete el.deviceIds;
// 					delete el.OTP;
// 					delete el.verifyEmail;
// 					delete el.verifyPhone;
// 					delete el.password;
// 					delete el.usedReferralCode;
// 					delete el.signupType;
// 					delete el.inactiveTime;
// 					delete el.token;
// 					delete el.position;
// 					delete el.yearOfExperience;
// 					delete el.workedWithCeleb;
// 					delete el.workedWithTV;
// 					delete el.location;
// 					delete el.registrationDate;
// 					delete el.uniqueId;
// 					return true
// 				})
// 				apiResponse.successResponseWithData(res, statusMessage.success, result)
// 			})
// 		} catch (err) {
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];

/**
 * get services.
 * @returns {Object}
 */
let getServices = [
  (req, res) => {
    try {
      let criteria = { status: req.body.status || "ACTIVE" };
      req.query.status && req.query.status === "ACTIVE"
        ? (criteria.status = "ACTIVE")
        : true;
      let query = [
        { $match: criteria },
        {
          $lookup: {
            from: "myntSubCategory",
            let: {
              categoryId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$categoryId", "$$categoryId"] },
                      { $eq: ["$status", "ACTIVE"] },
                    ],
                  },
                },
              },
            ],
            as: "subCategory",
          },
        },
      ];
      myntCategoryModel.aggregate(query, (err, result) => {
        console.log("err", err);
        if (err || !result || result.length == 0) {

          if(req.headers.lang === "el")
              return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
          else
              return apiResponse.successResponseWithData(res,statusMessage.success,[]);
        }
        result.map((category) => {
          if (category && category.subCategory) {
            category.subCategoryCount = category.subCategory.length;
          }
        });
        if(result.length>0){
          result.forEach((ele) => {
            console.log("ele.categoryName",ele.categoryName)
            if(req.headers.lang === "el"){
              ele.categoryName=ele.categoryName2
              ele.categoryDescription=ele.categoryDescription2
            }
              ele.subCategory.forEach((ele2) => {
                if(req.headers.lang === "el"){
                  ele2.subCategoryName=ele2.subCategoryName2,
                  ele2.subCategoryDescription=ele2.subCategoryDescription2,
                  ele2.briefDescription=ele2.briefDescription2
                }
              })
          })
        }
        if(req.headers.lang === "el")
          apiResponse.successResponseWithData(res, statusMessageGr.success, result);
        else
          apiResponse.successResponseWithData(res, statusMessage.success, result);
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
/*****************Get Professional Level and Price 
 * @author Nasir Kamal
 * @method get
 * @param id serviceId (subCategory Id)
 * @return {object} serivce fee and lable as array of object
*/
const getLevels = (req, res) => {
  let services = req.query.id;
  let serviceId = services.split(',');
  let level1TextD = req.headers.lang ==='el'?'Εξειδικευμένοι επαγγελματίες, με λιγότερα χρόνια παρουσίας από τους Senior Professionals.':'Qualified professionals with fewer years of experience than Senior Professionals.';
  let level2TextD = req.headers.lang ==='el'?'Έμπειροι και εξειδικευμένοι επαγγελματίες με λιγότερα χρόνια παρουσίας από τους Top Professionals.':'Qualified and experienced professionals with fewer years of experience than Top Professionals.';
  let level3TextD = req.headers.lang ==='el'?'Κορυφαίοι επαγγελματείες μεγάλη εμπειρία και εξειδίκευση.':'Top rated and qualified professionals with many years of experience.';
  let level1Text = req.headers.lang ==='el'? 'Professional':'Professional';
  let level2Text = req.headers.lang ==='el'? 'Senior Professional':'Senior Professional';
  let level3Text = req.headers.lang ==='el'? 'Top Professional':'Top Professional';
  let data = [
    {
      level: '1',
      levelName: level1Text,
      price: "0",
      time: "0",
      description: level1TextD,
    },
    {
      level: '2',
      levelName: level2Text,
      price: "0",
      time: "0",
      description: level2TextD,
    },
    {
      level: '3',
      levelName: level3Text,
      price: "0",
      time: "0",
      description:level3TextD,
    },
  ];
  let query = { _id: { $in: serviceId }};
  myntSubCategoryModel.find(query).select(["price", "time"]).lean().exec((err, result) => {
    if(err) return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
    result.forEach((ele) => {
      data.forEach((el, index) => {
        el.price = Number(el.price) + Number(ele.price[`level${index + 1}`]);
        el.time = Number(el.time) + Number(ele.time);
      });
    });
    // calculate price with text 
    for(let i = 0; i  < data.length; i++){
      data[i].serviceFee      = ((data[i].price * 0.2) +((data[i].price * 0.2) * 24 /100)).toFixed(2)
      data[i].appiontmentFee  = (data[i].price * 0.8).toFixed(2)
      data[i].totalFee        = (Number(data[i].serviceFee)+ Number(data[i].appiontmentFee)).toFixed(2)
      data[i].price           = data[i].price.toString();
      data[i].time            = data[i].time.toString();

    }
    return apiResponse.successResponseWithData(res, statusMessage.success, data);
  });
};
/*******************************END*****************************/
//
let updateFavList = (req, res) => {
  const { _id, status, bookingId } = req.body;
  let userId = req.headers.decoded_id;

  console.log(userId, req.body);

  async.waterfall([
      (cb) => {
        let query = {
          _id,
        };
        let dataToSet = {};
        if (status == true || status == "true") {
          dataToSet = { $push: { favProfessional: { userId, bookingId } },};
        } else {
          dataToSet = { $pull: { favProfessional: { userId, bookingId } },};
        }

        console.log("dataToSet", dataToSet);

        userSchema.update(query, dataToSet,{new:true,multi:true},(err, dbData) => {
          if (err) {
            if(req.headers.lang === "el")
                return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
            else
                return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
          }
          cb(null, dbData);
        });
      },
    ],
    (err, result) => {
      if (err) return;
      if(req.headers.lang === "el")
          apiResponse.successResponseWithData(res, statusMessageGr.success);
      else
          apiResponse.successResponseWithData(res, statusMessage.success);
    }
  );
};
/*
 * User login.
 *
 * @param {string}      phone
 *
 * @returns {Object}
 *
 */
let login = [
  check("phone")
    .isLength({ min: 1 })
    .trim()
    .withMessage("phone is require")
    .isNumeric()
    .withMessage("phone should be number"),
  sanitizeBody("phone").escape(),
  check("countryCode")
    .isLength({ min: 1 })
    .trim()
    .withMessage("countryCode is require"),
  sanitizeBody("countryCode").escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        userSchema
          .findOne({ phone: req.body.phone, userType: "USER" })
          .then((user) => {
            if (user) {
              if (user.status === "ACTIVE") {
                user.token = utility.jwtEncode(user._id);
                let otp = 12345;
                let dataToSet = {
                  token: user.token,
                  OTP: otp,
                  status: "ACTIVE",
                  inactiveTime: null,
                };

                userSchema.findOneAndUpdate(
                  { _id: user._id },
                  { $set: dataToSet },
                  { new: true },
                  (err, dbdata) => {
                    if (err) {
                      if(req.headers.lang === "el")
                          return apiResponse.ErrorResponse(res,statusMessageGr.DB_ERROR);
                      else
                          return apiResponse.ErrorResponse(res,statusMessage.DB_ERROR);
                    }
                    if(req.headers.lang === "el")
                      return apiResponse.successResponseWithDataAndToken(res,statusMessageGr.Login_sucess,user,user.token);
                    else
                      return apiResponse.successResponseWithDataAndToken(res,statusMessage.Login_sucess,user,user.token);
                  }
                );
              } else if (user.status === "DELETED") {
                if(req.headers.lang === "el")
                    return apiResponse.unauthorizedResponse(res,statusMessageGr.INVALID_USER);
                else
                    return apiResponse.unauthorizedResponse(res,statusMessage.INVALID_USER);
              } else {
                if(req.headers.lang === "el")
                    return apiResponse.unauthorizedResponse(res,statusMessageGr.INACTIVE_USER);
                else
                    return apiResponse.unauthorizedResponse(res,statusMessage.INACTIVE_USER);
              }
            } else {
              if(req.headers.lang === "el")
                  return apiResponse.notFoundResponse(res, statusMessageGr.NOT_FOUND);
              else
                  return apiResponse.notFoundResponse(res, statusMessage.NOT_FOUND);
            }
          });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
/**
 *
 * @param {String} flatNo
 * @param {String} landMark
 * @param {String} area
 * @param {String} city
 * @param {String} zipcode
 * @param {string} lattitude
 * @param {String} lognitude
 */
let addAddress = (req, res) => {
  const {
    address,
    state,
    city,
    zipcode,
    latitude,
    longitude,
    floor,
    nameOnDoorbell,
    otherInfo,
  } = req.body;
  const userId = req.headers.decoded_id;
  async.waterfall(
    [
      (cb) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          cb(
            apiResponse.validationErrorWithData(
              res,
              "Validation Error.",
              errors.array()
            ),
            null
          );
          return;
        }
        cb(null);
      },
      (cb) => {
        let dataToSet = {
          $push: {
            location: {
              address,
              state,
              city,
              zipcode,
              floor,
              nameOnDoorbell,
              otherInfo,
              coordinates: [longitude || 0, latitude || 0],
            },
          },
        };
        userSchema.findOneAndUpdate(
          { _id: userId },
          dataToSet,
          { new: true },
          (err, dbData) => {
            console.log(err, dbData);
            if (err) {
              if(req.headers.lang === "el")
                return cb(apiResponse.ErrorResponseWithData(res, statusMessageGr.DB_ERROR),err);
              else
                return cb(apiResponse.ErrorResponseWithData(res, statusMessage.DB_ERROR),err);
            }

            if(req.headers.lang === "el")
                return cb(null,apiResponse.successResponseWithData(res,statusMessageGr.ADDED,dbData.location));
            else
                return cb(null,apiResponse.successResponseWithData(res,statusMessage.ADDED,dbData.location));
          }
        );
      },
    ],
    (err, res) => {}
  );
};


let editAddress = (req, res) => {
  const userId = req.headers.decoded_id;
  const addressId = req.params.addressId || req.body.addressId;
  const {
    address,
    state,
    city,
    zipcode,
    latitude,
    longitude,
    floor,
    nameOnDoorbell,
    otherInfo,
  } = req.body;
  async.waterfall(
    [
      (cb) => {
        let query = { "location._id": addressId };
        userSchema.findOne(query, (err, dbData) => {
          if (err) {
            return cb(apiResponse.ErrorResponse(res, err), null);
          } else if (!dbData) {
            return cb(
              apiResponse.ErrorResponse(res, "Invaild Address Id"),
              null
            );
          }
          return cb(null, dbData);
        });
      },
      (result, cb) => {
        let criteria = [{ _id: userId }, { "location._id": addressId }];
        let dataToSet = {
          "location.$.address": address || result.location[0].address,
          "location.$.state": state || result.location[0].state,
          "location.$.zipcode": zipcode || result.location[0].zipcode,
          "location.$.city": city || result.location[0].city,
          /* new key add by client 24 feb */
          "location.$.floor": floor || result.location[0].floor,
          "location.$.nameOnDoorbell":
            nameOnDoorbell || result.location[0].nameOnDoorbell,
          "location.$.otherInfo": otherInfo || result.location[0].otherInfo,
          /* new key add by client 24 feb */
          "location.$.coordinates": [
            longitude || result.location[0].coordinates[0],
            latitude || result.location[0].coordinates[1],
          ],
        };
        userSchema.findOneAndUpdate(
          { $and: criteria },
          { $set: dataToSet },
          { new: true },
          (err, dbData) => {
            if (err || !dbData) {
              if(req.headers.lang === "el")
                  return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
              else
                  return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
            }
            cb(null, dbData.location);
          }
        );
      },
    ],
    (err, result) => {
      if (err) return;
      if(req.headers.lang === "el")
          apiResponse.successResponseWithData(res, statusMessageGr.success, result);
      else
          apiResponse.successResponseWithData(res, statusMessage.success, result);
    }
  );
};


let verifyOpt = (req, res) => {
  const { otp } = req.body;
  const userId = req.headers.decoded_id;
  const token = req.headers.token;
  async.waterfall(
    [
      (cb) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          cb(
            apiResponse.validationErrorWithData(
              res,
              "Validation Error.",
              errors.array()
            ),
            null
          );
          return;
        }
        cb(null);
      },
      (cb) => {
        userSchema.findOne({ _id: userId }, (err, dbData) => {
          if (err) {
            if(req.headers.lang === "el")
                return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
            else
                return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);
          }
          cb(null, dbData);
        });
      },
      (user, cb) => {
        console.log("user", user.OTP, otp);
        if (otp != user.OTP) {
          if(req.headers.lang === "el")
              return cb(apiResponse.ErrorResponse(res, statusMessageGr.INVALID_OTP),null);
          else
              return cb(apiResponse.ErrorResponse(res, statusMessage.INVALID_OTP),null);
        }
        userSchema
          .findOneAndUpdate({ _id: userId }, { OTP: "verified" }, { new: true })
          .exec((err, dbData) => {
            if (err) {
              if(req.headers.lang === "el")
                  return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
              else
                  return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);
            }
            if(req.headers.lang === "el")
                return cb(null,apiResponse.successResponseWithData(res,statusMessageGr.success,dbData))
            else
                return cb(null,apiResponse.successResponseWithData(res,statusMessage.success,dbData)
            );
          });
      },
    ],
    (err, res) => {}
  );
};
let resendOtp = (req, res) => {
  const userId = req.headers.decoded_id;
  async.waterfall(
    [
      (cb) => {
        let otp = 12345; /* utility.randomNumber(6).toString(); */
        cb(null, otp);
      },
      (otp, cb) => {
        userSchema.findOneAndUpdate(
          { _id: userId },
          { OTP: otp },
          { new: true },
          (err, dbData) => {
            if (err) {
              if(req.headers.lang === "el")
                  return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
              else
                  return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);

            }
            if(req.headers.lang === "el")
                cb(null,apiResponse.successResponseWithData(res, statusMessageGr.success, {otp,}))
            else
                cb(null,apiResponse.successResponseWithData(res, statusMessage.success, {otp,}));
          }
        );
      },
    ],
    (err, res) => {}
  );
};

// /****************  getTime ************/
// /****************  getTime ************/
// let getTime = (req, res) => {
// 	const userId = req.headers.decoded_id;
// 	const { date, timeZone ,proId } = req.query;
// 	myntCalender.find({proId:proId,status:"ACTIVE",calenderDate:date})
// 	// .select(['_id','timeLog'])
// 	.exec((err, result) =>{
// 		if (err || !result)
// 			return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR)
// 		else{
// 			if(result.length){
// 				result=result[0].timeLog;
// 			}
// 			// return apiResponse.successResponseWithData(res, statusMessage.success, result)
// 			return apiResponse.successResponseWithData(res, statusMessage.success, constants.time)
// 		}
// 	})
// }

// /****************  getTime ************/
// /****************  getTime ************/
// let getTime = (req, res) => {
//   const userId = req.headers.decoded_id;
//   const { date, timeZone } = req.query;

//   let timeArray = [],
//     d = new Date(),
//     h = d.getHours(),
//     m = d.getMinutes(),
//     meridiem = ["AM", "PM"];
//   for (let i = h; i < 24; ++i) {
//     for (let j = i == h ? Math.ceil(m / 30) : 0; j < 2; ++j) {
//       timeArray.push(
//         (i % 12) + ":" + (j * 60 || "00") + " " + meridiem[(i / 12) | 0]
//       );
//     }
//   }

//   return apiResponse.successResponseWithData(
//     res,
//     statusMessage.success,
//     timeArray
//   );
//   // return apiResponse.successResponseWithData(res, statusMessage.success, constants.time)
// };

/****************  getTime New change by Nasir************/
/****************  getTime ************/
const getTime = (req, res)  =>  {
  let timeArray = constants.time;
  let { date } = req.query;
  date = date? moment(new Date(date)).startOf('day'):moment().startOf('day');
  /*************if date is after current date ..return all timeSlot
   * if date is before current date return empty aaray;
  */
  if(date.isAfter(moment().startOf('days'), 'd')){
    timeArray = timeArray.map(ele => ele.time);
    if(req.headers.lang === "el"){
      return apiResponse.successResponseWithData(res,statusMessageGr.success,timeArray);
    }
    else{
      return apiResponse.successResponseWithData(res,statusMessage.success,timeArray);
    }
  }else if(date.isBefore(moment().startOf('days'), 'd')){
    console.log('beofre')
    if(req.headers.lang === "el"){
      return apiResponse.timeSlotNotAvailResponse(res,statusMessageGr.TIME_SLOT_NOT_AVAIL);
    }
    else{
      return apiResponse.timeSlotNotAvailResponse(res,statusMessage.TIME_SLOT_NOT_AVAIL);
    }
  }
  else{
    //add 2 ours(2+ 5.5 utc indain timezone hours and get start of hour, hence 2 hour) to send only eligible time as client, otherwise remove before current+2 time object;
    let currentTime = moment().add(7.5 ,'hour');
    let hour   = currentTime.hour();
    let minute = currentTime.minute();
    if(minute <= 30) currentTime.set({minute: 30});
    if(minute >  30) currentTime.set({hour: hour + 1, minute: 0});
    currentTime = currentTime.format("HH:mm");
    let findIndexofCurrentTime = timeArray.findIndex(el => el.time == currentTime);
    if(findIndexofCurrentTime > -1){
      timeArray = timeArray.slice(findIndexofCurrentTime);
      timeArray = timeArray.map(ele => ele.time);
      if(req.headers.lang === "el"){
        return apiResponse.successResponseWithData(res,statusMessageGr.success,timeArray);
      }
      else{
        return apiResponse.successResponseWithData(res,statusMessage.success,timeArray);
      }
    }else{
      if(req.headers.lang === "el"){
        return apiResponse.timeSlotNotAvailResponse(res,statusMessageGr.TIME_SLOT_NOT_AVAIL);
      }
      else{
        return apiResponse.timeSlotNotAvailResponse(res,statusMessage.TIME_SLOT_NOT_AVAIL);
      }
    }
  }
};

/****************  createWeddingEnquiry ************/
let createWeddingEnquiry = (req, res) => {
  const userId = req.headers.decoded_id;
  req.body.userId = userId;
  console.log(req.body);
  async.parallel(
    {
      create: (cb) => {
        delete req.body.status;
        myntWeddingModel.create(req.body, (err, result) => {
          console.log(err, result);
          if (err || !result) {
            if(req.headers.lang === "el")
                return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
            else
                return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);

          } else {
            return cb(null, result);
          }
        });
      },
    },
    (err, result) => {
      if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res,statusMessageGr.WEDDIND_SUCCESS,result.gettime);
      else
          return apiResponse.successResponseWithData(res,statusMessage.WEDDIND_SUCCESS,result.gettime);
    }
  );
};

// Old Code
// /****************  bookServices ************/
// /****************  bookServices ************/
// let bookServices = (req, res) => {

//   if (!req.body.bookingId) {
//     return apiResponse.ErrorResponse(res, "Invalid Booking Id...");
//   }

//   const userId = req.headers.decoded_id;
//   req.body.userId = userId;

//   const bookingId = req.body.bookingId;
//   delete req.body.bookingId;

//   myntBookModel.find({ _id: bookingId, status: "ACCEPTED" }, (err, result) => {
//     if (err) return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
//     console.log(err, result);
//   });

//   // let location = {
//   //   flatNo: req.body.location.flatNo ? req.body.location.flatNo : "",
//   //   address: req.body.location.address ? req.body.location.address : "",
//   //   state: req.body.location.state ? req.body.location.state : "",
//   //   city: req.body.location.city ? req.body.location.city : "",
//   //   floor: req.body.location.floor ? req.body.location.floor : "",
//   //   nameOnDoorbell: req.body.location.nameOnDoorbell
//   //     ? req.body.location.nameOnDoorbell
//   //     : "",
//   //   otherInfo: req.body.location.otherInfo ? req.body.location.otherInfo : "",
//   //   zipcode: req.body.location.zipcode ? req.body.location.zipcode : "",
//   //   coordinates: [req.body.location.long || 0, req.body.location.lat || 0],
//   // };

//   let {flatNo,address,state,city,floor,nameOnDoorbell,otherInfo,zipcode,lat,long,} = req.body;
//   let location = {flatNo,address,state,city,floor,nameOnDoorbell,otherInfo,zipcode,coordinates: [long || 0, lat || 0],};

//   req.body.location = location;
//   req.body.status = "CONFIRM";
//   req.body.paymentStatus = "CONFIRM";
//   console.log(req.body);

//   myntBookModel.findOneAndUpdate(
//     { _id: bookingId, status: "ACCEPTED" },
//     req.body,
//     async (err, result) => {
//       if (err) {
//         return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
//       } else {
//         // console.log("result",result,"err->>",err)

//         await requestConfirmNotification(bookingId);

//         myntBookModel.find({ _id: bookingId }, async (err, resultData) => {
//           if (err) {
//             return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
//           } else {
//             // relesing the block User
//             await releseBlockUser();
//             return apiResponse.successResponseWithData(
//               res,
//               statusMessage.BOOKED_SERVICES,
//               resultData[0]
//             );
//           }
//         });

//         // return apiResponse.successResponseWithData(
//         //   res,
//         //   statusMessage.BOOKED_SERVICES,
//         //   req.body
//         // );
//         // return apiResponse.successResponseWithData(res,statusMessage.BOOKED_SERVICES);
//       }
//     }
//   );
// };

// New Code Changes 30 April
/****************  bookServices ************/
/****************  bookServices ************/
// let bookServices = async (req, res) => {
//   const userId = req.headers.decoded_id;
//   let oldBookingId = req.body.oldBookingId;
//   req.body.date = req.body.date? moment(new Date(req.body.date)).format('YYYY-MM-DD'): req.body.date//replace date to '-' formate; 
  
//   /***************** 
//    * Check if oldBookingId Exists,
//    * Rebooking Came, so replace new data to old data
//    * Do not redirect to Payment;
//   */
//     if(oldBookingId){
//       let oldBooking = await myntBookModel.findOne({_id:oldBookingId}).lean().exec();
//       if(oldBooking){
//         req.body.flatNo           = oldBooking.location.flatNo;
//         req.body.address          = oldBooking.location.address;
//         req.body.state            = oldBooking.location.state;
//         req.body.city             = oldBooking.location.city;
//         req.body.floor            = oldBooking.location.floor;
//         req.body.nameOnDoorbell   = oldBooking.location.nameOnDoorbell;
//         req.body.otherInfo        = oldBooking.location.otherInfo;
//         req.body.zipcode          = oldBooking.location.zipcode;
//         req.body.long             = oldBooking.location.coordinates[0];
//         req.body.lat              = oldBooking.location.coordinates[1];
//         req.body.serviceId        = oldBooking.serviceId;
//         req.body.professionalId   = oldBooking.professionalId;
//         req.body.serviceInfo      = oldBooking.serviceInfo;
//         req.body.description      = oldBooking.description;
//         req.body.serviceFee       = oldBooking.serviceFee;
//         req.body.appointmentFee   = oldBooking.appointmentFee;
//         req.body.discount         = oldBooking.discount;
//         req.body.date             = oldBooking.date;
//         req.body.timeSlot         = oldBooking.timeSlot;
//         req.body.time             = oldBooking.time;
//         req.body.bookingType      = oldBooking.bookingType;
//       }
//     }
//   /*********************END****************************/
//   let { flatNo, address, state, city, floor, nameOnDoorbell, otherInfo, zipcode, lat, long } = req.body;
//   let location = {flatNo, address, state, city, floor, nameOnDoorbell, otherInfo, zipcode, coordinates: [long || 0, lat || 0]};
//   req.body.location = location;
//   req.body.status = "CONFIRM";
//   req.body.paymentStatus = "CONFIRM";
//   req.body.userId = userId;

//   /**************DO PAYMETN HERE BEFORE BOOKING COMPLETE */
//   //only for new request, not for cancel case
//   let { creditPointApplied, creditPoint, serviceFee, giftCardApplied , giftCardAmount } = req.body;
//   let paymentModelToSaveStatus = false; //to save payment data to db;
//   let appointmentFee = ( 20 * serviceFee) / 100;
//   if(!oldBookingId){
//     try{
//       //calculate payment //
//       if(creditPointApplied){
//         let getUserCreditPointData = await userSchema.findOne({_id: userId}).lean().select(['userPoint']).exec();
//         if(creditPoint > getUserCreditPointData.userPoint){ //if credit point is more then his actual then throw error;
//           let msg = req.headers.lang === "el"?statusMessageGr.CREDIT_POINT_MAX:statusMessage.CREDIT_POINT_MAX;
//           return apiResponse.ErrorResponse(res, msg);
//         }
//         //get percentage of the credit point Applied;
//         // let rewardPoint =  await myntRewardModel.findOne({point : { $gte :  30, $lte : 60}}).lean().exec();
//         appointmentFee = (appointmentFee - 1).toFixed(0);
//         req.body.discount = 5;
//         req.body.appointmentFee = appointmentFee;
//       }
//       let paymentFormData = {
//         amount  : appointmentFee,
//         token   : req.body.cardId
//       }
//       var doPaymnetReq = await doPayment(paymentFormData);
//       //save payment data to db
//       let paymentToSaveData = { 
//         userId              : userId,
//         paymentId           : doPaymnetReq.token,
//         amount              : doPaymnetReq.amount,
//         refundAmount        : doPaymnetReq.amount,
//         creditPointApplied  : creditPointApplied,
//         creditPoint         : creditPoint
//       };
//       var paymentSchema = new paymentModel(paymentToSaveData);
//       paymentModelToSaveStatus =  true;
//     }catch(e){
//       return apiResponse.ErrorResponse(res,e);
//     }
//   }
//   /*****************END***********************************/

//   try {
//     /***************** 
//      * Check if req.body.bookingType ==SPECIFIC,
//      * Specific Booking. if not Normal Booking Type.
//      * 
//     */
//     if(req.body.bookingType =="SPECIFIC") {
//       let saveBooking = await myntBookModel.create({
//         location: req.body.location,
//         userId: req.body.userId,
//         serviceId: req.body.serviceId,
//         professionalId: req.body.professionalId,
//         serviceInfo: req.body.serviceInfo,
//         description: req.body.description,
//         serviceFee: serviceFee,
//         serviceRemaingFee: (20 * serviceFee) / 100,
//         appointmentFee: appointmentFee,
//         discount: req.body.discount,
//         paymentMode: "Online",
//         date: req.body.date,
//         timeSlot: req.body.timeSlot,
//         time: req.body.time,
//         expireDate: util.currentDate5MinAdd(2),
//         status: "CONFIRM",
//         paymentStatus: "CONFIRM",
//         bookingType: req.body.bookingType,
//       });
//       if(!saveBooking){
//         if(req.headers.lang === "el"){
//           return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR); 
//         }
//         else{
//           return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR); 
//         }
//       }
//       //save payment Data to db.
//       if(paymentModelToSaveStatus){
//         paymentSchema.bookingId =saveBooking._id;
//         await paymentSchema.save();
//       }
//       //if credit point Applied then update user credit point;
//       if(creditPointApplied){
//         await userSchema.updateOne({_id: userId},{ $set : { userPoint : creditPoint }}).exec();
//       }
//       //send Notification to both user and pro , booking confirmed;
//       await requestConfirmNotification(saveBooking._id, req.headers.lang);
//       //reserve slot for this professional;
//       await slotBooked(req.body);
//       if(req.headers.lang === "el"){
//         return apiResponse.successResponseWithData(res,statusMessageGr.BOOKED_SERVICES,saveBooking);
//       }
//       else{
//         return apiResponse.successResponseWithData(res,statusMessage.BOOKED_SERVICES,saveBooking);
//       }

//     }
//     else {
//       // for Normal request
//       const bookingId = req.body.bookingId;
//       delete req.body.bookingId;
//       myntBookModel.findOneAndUpdate({ _id: bookingId}, req.body,
//         async (err, result) => {
//           if (err) {
//             if(req.headers.lang === "el")
//                 return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
//             else
//                 return apiResponse.ErrorResponseWithData(res, statusMessage.DB_ERROR,err);
//           }
//           else {
//             let updatedData = await myntBookModel.findOne({_id:bookingId}).lean().exec();
//             if(paymentModelToSaveStatus){
//               paymentSchema.bookingId =bookingId;
//               await paymentSchema.save();
//             }
//             await requestConfirmNotification(bookingId, req.headers.lang);
//             await slotBooked(req.body);
//             await releseBlockUser();
//             if(req.headers.lang === "el"){
//               return apiResponse.successResponseWithData(res,statusMessageGr.BOOKED_SERVICES,updatedData);
//             }
//             else{
//               return apiResponse.successResponseWithData(res,statusMessage.BOOKED_SERVICES,updatedData);
//             }
//           }
//         }
//       );
//     }
//   }
//   catch(err){
//     if(req.headers.lang === "el"){
//       return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
//     }
//     else{
//       return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR,err);
//     }
//   }
// };

/*************************bookService API **********************
 * @method Post
 * @req.body request body
 * @return new booking data or thorw error as messgae;
*/

let bookServices = async (req, res) => {
  try{
    //replace date format '/' to '-'; ex:'24/05-2021' to '24-05-2021';
    req.body.date = req.body.date? moment(new Date(req.body.date)).format('YYYY-MM-DD'): req.body.date;
    const userId = req.headers.decoded_id;
    let oldBookingId = req.body.oldBookingId;    
    /***************** 
    * Check if oldBookingId Exists,
    * Rebooking Coming (cancel case), so replace req.body  to old data
    * Avoid Payment, Do not redirect to Payment;
    */
    if(oldBookingId){
      let msg = req.headers.lang === 'el'? statusMessageGr.BOOKING_NOT_FOUND: statusMessage.BOOKING_NOT_FOUND;
      let oldBooking = await myntBookModel.findOne({_id:oldBookingId}).lean().exec();
      if(!oldBooking) throw new Error(msg);
      if(oldBooking){
        req.body.flatNo           = oldBooking.location.flatNo;
        req.body.address          = oldBooking.location.address;
        req.body.state            = oldBooking.location.state;
        req.body.city             = oldBooking.location.city;
        req.body.floor            = oldBooking.location.floor;
        req.body.nameOnDoorbell   = oldBooking.location.nameOnDoorbell;
        req.body.otherInfo        = oldBooking.location.otherInfo;
        req.body.zipcode          = oldBooking.location.zipcode;
        req.body.long             = oldBooking.location.coordinates[0];
        req.body.lat              = oldBooking.location.coordinates[1];
        req.body.serviceId        = oldBooking.serviceId;
        req.body.professionalId   = oldBooking.professionalId;
        req.body.serviceInfo      = oldBooking.serviceInfo;
        req.body.description      = oldBooking.description;
        req.body.serviceFee       = oldBooking.totalFeeBeforeTax;
        req.body.appointmentFee   = oldBooking.appointmentFee;
        req.body.discount         = oldBooking.discount;
        req.body.date             = oldBooking.date;
        req.body.timeSlot         = oldBooking.timeSlot;
        req.body.time             = oldBooking.time;
        req.body.bookingType      = oldBooking.bookingType;
        req.body.creditPointApplied =oldBooking.creditPointApplied;
        req.body.giftCardApplied  =oldBooking.giftCardApplied;
        req.body.creditPoint      =oldBooking.creditPoint;
        req.body.giftCardAmount   =oldBooking.giftCardAmount;
        req.body.bookingId        = oldBooking._id;
      }
    }
    //define params;
    let { flatNo, address, state, city, floor, nameOnDoorbell, otherInfo, zipcode, lat, long } = req.body;
    let location = {flatNo, address, state, city, floor, nameOnDoorbell, otherInfo, zipcode, coordinates: [long || 0, lat || 0]};
    req.body.location = location;
    req.body.status = "CONFIRM";
    req.body.paymentStatus = "CONFIRM";
    req.body.userId = userId;
    let adminDueAmount = 0;
    let { creditPointApplied, creditPoint, serviceFee, giftCardApplied , giftCardAmount, discount, cardId, cardCustomerToken} = req.body;
    //Replace creditPointApplied, giftCardApplied to Boolean IOS issues// 
    creditPointApplied  = !creditPointApplied? false: true;
    giftCardApplied     = !giftCardApplied? false: true;
    giftCardAmount      = !giftCardAmount? 0 : Number(giftCardAmount);
    creditPoint         = !creditPoint? 0 : Number(creditPoint);
    //check if slotBooked or not, if booked throw error
    let isSlotBookedStatus = await isSlotBooked(req.body);
    if(isSlotBookedStatus){
      let msg  = req.headers.lang === 'el' ? statusMessageGr.TIME_SLOT_NOT_AVAIL : statusMessage.TIME_SLOT_NOT_AVAIL; 
      throw new Error(msg);
    }
    //Reserve Slot
    await slotBooked(req.body);
    // check if credit card and giftCard Appllied, if both applied throw Error(Only one can be applied at once)
    if(creditPointApplied && giftCardApplied){
      let msg  = req.headers.lang === 'el' ? statusMessageGr.CREDIT_GIFT_APPLIED_ERROR : statusMessage.CREDIT_GIFT_APPLIED_ERROR 
      throw new Error(msg);
    }
    //calculate appointment, service fee
    let nServiceFee     = (Number(serviceFee) * 0.2) +((Number(serviceFee) * 0.2) * 24 /100);
    let appointmentFee  = Number(serviceFee) * 0.8;
    let totalFee        = nServiceFee + appointmentFee;
    let userHaveToPaymetnAmount = nServiceFee;
    let isRedirectToPayment = true; //redirect to payment to user;
    let isSendNotificationToAdmin = false;
    let paymentModelToSaveStatus = false; //to save payment data to db;
    let isUpdateWallet = false; //to update user wallete;
    //Check if giftCard Applied
    if(giftCardApplied){
      //check totalFee is less then giftCardAmount, throw error
      if(Number(giftCardAmount) > totalFee) {
        let msg  = req.headers.lang === 'el' ? statusMessageGr.GIFTAMOUNTMAX : statusMessage.GIFTAMOUNTMAX 
        throw new Error(msg);
      }
      //get user wallet balance;
      let userWalletBalance  = await getUserWalletPromise(userId);
      if(Number(giftCardAmount) > Number(userWalletBalance)) {
        let msg  = req.headers.lang === 'el' ? statusMessageGr.GIFTAMOUNTEXCEED : statusMessage.GIFTAMOUNTEXCEED 
        throw new Error(msg);
      }
      //check user will payment or no payment by user on payment gatewaye.
      if((nServiceFee - Number(giftCardAmount)) > 0) {
        nServiceFee = nServiceFee - Number(giftCardAmount);
        discount = Number(giftCardAmount);
      }else{   
        isRedirectToPayment = false;
        // chek weather user have to payment or admin will pay /in case full discount applied on giftCard;
        let userHaveToPay = totalFee  - Number(giftCardAmount);
        if(userHaveToPay > 0){
          userHaveToPaymetnAmount = userHaveToPay
        }else{
          userHaveToPaymetnAmount = 0;
        }
        // check admin have to pay pro for remaining Amount//
        if((appointmentFee - userHaveToPaymetnAmount) > 0){
          isSendNotificationToAdmin = true;
          adminDueAmount = appointmentFee - userHaveToPaymetnAmount
        }
        appointmentFee  = userHaveToPaymetnAmount;
        nServiceFee     = 0;
        discount        = Number(giftCardAmount);
      }
      // set user update wallet status
      isUpdateWallet = true; 
    }
    //Cehck if creditPoint Applied
    if(creditPointApplied){
      let getUserCreditPointData = await userSchema.findOne({_id: userId}).lean().select(['userPoint']).exec();
      //if credit point is more then his actual then throw error;
      if(creditPoint > getUserCreditPointData.userPoint){ 
        let msg = req.headers.lang === "el"?statusMessageGr.CREDIT_POINT_MAX:statusMessage.CREDIT_POINT_MAX;
        throw new Error(msg)
      }
      //get percentage of the credit point Applied;
      let rewardPoint =  await myntRewardModel.findOne({point :creditPoint }).lean().exec();
      if(!rewardPoint) throw new Error('Credit point Data Not found');
      discount = nServiceFee * Number(rewardPoint.percentage) / 100 ;
      nServiceFee = nServiceFee - discount;
    }
    // Do Payment Here; only for new request, not for cancel case
    if(!oldBookingId && isRedirectToPayment){
      let paymentFormData = {
        amount  : Number(nServiceFee.toFixed(0)),
        // token   : cardId,
        token   : cardCustomerToken,
        card    : cardId
      }
      var doPaymnetReq = await doPayment(paymentFormData);
      //save payment data to db
      let paymentToSaveData = { 
        userId              : userId,
        paymentId           : doPaymnetReq.token,
        amount              : doPaymnetReq.amount,
        refundAmount        : doPaymnetReq.amount,
        creditPointApplied  : creditPointApplied,
        creditPoint         : creditPoint
      };
      var paymentSchema = new paymentModel(paymentToSaveData);
      paymentModelToSaveStatus =  true;
    }
    //Check if req.body.bookingType == SPECIFIC, Specific Booking. if not Normal Booking Type;
    if(req.body.bookingType =="SPECIFIC") {
      let saveBooking = await myntBookModel.create({
        location: req.body.location,
        userId: userId,
        serviceId: req.body.serviceId,
        professionalId: req.body.professionalId,
        serviceInfo: req.body.serviceInfo,
        description: req.body.description,
        serviceFee: (Number(nServiceFee)).toFixed(2),
        totalFee  : (Number(totalFee)).toFixed(2),
        appointmentFee: (Number(appointmentFee)).toFixed(2),
        discount: (Number(discount)).toFixed(2),
        paymentMode: "Online",
        date: req.body.date,
        timeSlot: req.body.timeSlot,
        time: req.body.time,
        expireDate: util.currentDate5MinAdd(2),
        status: "CONFIRM",
        paymentStatus: "CONFIRM",
        bookingType: req.body.bookingType,
        giftCardAmount:Number(giftCardAmount),
        giftCardApplied:giftCardApplied,
        creditPointApplied:creditPointApplied,
        creditPoint: Number(creditPoint),
        bookingCompletionCode : Math.floor(100000 + Math.random() * 900000),
        adminDueAmount: (Number(adminDueAmount)).toFixed(2),
        totalFeeBeforeTax: (Number(serviceFee)).toFixed(2)
      });
      if(!saveBooking){
        let msg = req.headers.lang === "el" ?statusMessageGr.DB_ERROR:statusMessage.DB_ERROR;
        throw new Error(msg)
      }
      //save payment Data to db.
      if(paymentModelToSaveStatus){
        paymentSchema.bookingId =saveBooking._id;
        await paymentSchema.save();
      }
      //if credit point Applied then update user credit point;
      if(creditPointApplied){
        await userSchema.updateOne({_id: userId},{ $set : { userPoint : creditPoint }}).exec();
      }
      //Notify Admin to Pay to professional remaining amount 
      if(isSendNotificationToAdmin){
        let notificationAdminForPro = {
         userType      : "ADMIN",
         type          : "BOOKING_PAY_PROFESSIONAL",
         title         : config.notificationContentEn.proPendingPaymentTitle, //english title
         description   : config.notificationContentEn.proPendingPayment, //english description
         title2        : config.notificationContentEl.proPendingPaymentTitle, //greek title
         description2  : config.notificationContentEl.proPendingPayment, //Greek description
         userId        : userId,
         proId         : req.body.professionalId,
         sendStatus    : 1,
         bookingId     : saveBooking._id
        }
        await notification.create(notificationAdminForPro);
      }
      //send Notification to both user and pro , booking confirmed;
      await requestConfirmNotification(saveBooking._id, req.headers.lang,isSendNotificationToAdmin);
      //reserve slot for this professional;
      //await slotBooked(req.body);
      //update user wallet
      if(isUpdateWallet){
        updateUserWallet(userId, giftCardAmount)
      }
      let msg = req.headers.lang === "el"?statusMessageGr.BOOKED_SERVICES:statusMessage.BOOKED_SERVICES;
      return apiResponse.successResponseWithData(res,msg,saveBooking);
    }else{
      let bookingId           = req.body.bookingId;
      req.body.serviceFee     = (Number(nServiceFee)).toFixed(2);
      req.body.appointmentFee = (Number(appointmentFee)).toFixed(2);
      req.body.totalFee       = (Number(totalFee)).toFixed(2);
      req.body.discount       = (Number(discount)).toFixed(2);
      req.body.giftCardApplied= giftCardApplied;
      req.body.giftCardAmount = giftCardAmount;
      req.body.creditPointApplied =creditPointApplied;
      req.body.creditPoint =creditPoint;
      req.body.bookingCompletionCode = Math.floor(100000 + Math.random() * 900000);
      req.body.adminDueAmount = (Number(adminDueAmount)).toFixed(2);
      req.body.totalFeeBeforeTax = (Number(serviceFee)).toFixed(2);
      await myntBookModel.findOneAndUpdate({ _id: bookingId}, req.body).exec();
      let updatedData = await myntBookModel.findOne({_id:bookingId}).lean().exec();
      if(paymentModelToSaveStatus){
        paymentSchema.bookingId = bookingId;
        await paymentSchema.save();
      }
      //Notify Admin to Pay to professional remaining amount 
      if(isSendNotificationToAdmin){
        let notificationAdminForPro = {
         userType      : "ADMIN",
         type          : "BOOKING_PAY_PROFESSIONAL",
         title         : config.notificationContentEn.proPendingPaymentTitle, //english title
         description   : config.notificationContentEn.proPendingPayment, //english description
         title2        : config.notificationContentEl.proPendingPaymentTitle, //greek title
         description2  : config.notificationContentEl.proPendingPayment, //Greek description
         userId        : userId,
         proId         : req.body.professionalId,
         sendStatus    : 1,
         bookingId     : bookingId
        }
        await notification.create(notificationAdminForPro);
      }
      await requestConfirmNotification(bookingId, req.headers.lang,isSendNotificationToAdmin);
      //await slotBooked(req.body);
      // await releseBlockUser();
      //update user wallet
      if(isUpdateWallet){
        updateUserWallet(userId, giftCardAmount)
      }
      let msg = req.headers.lang === "el"?statusMessageGr.BOOKED_SERVICES:statusMessage.BOOKED_SERVICES;
      return apiResponse.successResponseWithData(res,msg,updatedData);
    }
  }catch(e){
    //Release slot if any error occured
    slotRelease(req.body)
    return apiResponse.ErrorResponse(res,e.message || e);
  }
}

/**************************END bookService *********************/

const slotBooked = async (req) => {
    if(typeof req.date=='object'){
      req.date = moment(req.date).format('YYYY-MM-DD');
    }
    let d=req.date.substring(0,10)
    let dt=d.split("-");
    let years=dt[0];
    let month=dt[1].indexOf("0")==0 ? dt[1].substring(1) : dt[1];
    let dates=dt[2].indexOf("0")==0 ? dt[2].substring(1) : dt[2];
    let date=years+"-"+month+"-"+dates
    let tme=req.timeSlot;
    let queryData={
      proId:mongoose.Types.ObjectId(req.professionalId),
      calenderDate:date,
      "timeLog.time":tme,
    }
    let dataToSet = {"timeLog.$.isBooked":1,"timeLog.$.isSelected": 1};
    await myntCalender.updateOne(queryData, dataToSet).exec();
    return true;
};

/**************Check Slot Available or not********
 * @parmas req request body
 * @return Promisess
*/
const isSlotBooked = (req) => {
  return new Promise((resolve, reject) => {
    try{
      if(typeof req.date=='object'){
        req.date = moment(req.date).format('YYYY-MM-DD');
      }
      let d=req.date.substring(0,10)
      let dt=d.split("-");
      let years=dt[0];
      let month=dt[1].indexOf("0")==0 ? dt[1].substring(1) : dt[1];
      let dates=dt[2].indexOf("0")==0 ? dt[2].substring(1) : dt[2];
      let date=years+"-"+month+"-"+dates
      let tme=req.timeSlot;
      let proId=req.professionalId;
      let queryData={
        proId:proId,
        calenderDate:date,
        timeLog : { $elemMatch: {time: tme,isSelected: 1,isBooked: 1 }}
      }
      
      myntCalender.findOne(queryData).select(["_id"]).lean().exec((err, data)=>{
        if(err) return reject(err)
        if(data) return resolve(true)
        return resolve(false)
      });
    }catch(e){
      reject(e.message || e)
    }
  })
};
/******************************END **************/

const slotRelease = async (data) => {
  data.date = moment(data.date).format('YYYY-MM-DD');
  let d=data.date.substring(0,10)
  let dt=d.split("-");
  let years=dt[0];
  let month=dt[1].indexOf("0")==0 ? dt[1].substring(1) : dt[1];
  let dates=dt[2].indexOf("0")==0 ? dt[2].substring(1) : dt[2];
  let date=years+"-"+month+"-"+dates
  let tme=data.timeSlot;
  let proId=data.professionalId;
  let queryData={
    proId:mongoose.Types.ObjectId(proId),
    calenderDate:date,
    "timeLog.time":tme,
  }
  let dataToSet = {"timeLog.$.isBooked":0};
  myntCalender.findOneAndUpdate(queryData, dataToSet).exec();
  return;
};


///****************  requestConfirmNotification ************///
///****************  requestConfirmNotification ************///

let requestConfirmNotification = (bookingId, lang='en') => {
  myntBookModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(bookingId)}},
    { $lookup: { from: "userSchema", localField: "userId", foreignField: "_id", as: "userId" }},
    { $unwind: "$userId" },
    { $lookup: { from: "userSchema", localField: "professionalId", foreignField: "_id", as: "professionalId"}},
    { $unwind: "$professionalId" },
    { $lookup: { from: "myntSubCategory", localField: "serviceId", foreignField: "_id", as: "serviceId" }},
    { $unwind: "$serviceId" },
    { $project: {
        serviceFee:1,
        totalFee:1,
        adminDueAmount: 1,
        appointmentFee:1,
        discount: 1,
        timeSlot: 1,
        expireDate: 1,
        date: 1,
        createdAt: 1,
        serviceFee: 1,
        userId: { fullName: 1, firstName: 1, lastName: 1, deviceToken: 1, deviceType: 1, _id: 1,location: 1},
        professionalId: { firstName: 1, lastName: 1, deviceToken: 1, deviceType: 1, _id: 1,location: 1},
        serviceId: { subCategoryName: 1, time: 1 },
    }},
  ]).
  exec(async(err, responseData) => {
    if (responseData.length) {
      let bookingDate = moment(responseData[0].date).format('DD-MM-YYYY');
      // send notification to professional start
      let title       = lang ==='el'? config.notificationContentEl.bookingConfirm:config.notificationContentEn.bookingConfirm;
      let bodyforPro  = config.bookingConfirmProNotification({
        name      : (responseData[0].userId.fullName).split(' ')[0],
        location  : responseData[0].userId.location[0].address,
        date      : bookingDate,
        time      : responseData[0].timeSlot,
        price     : responseData[0].totalFee, //need to work later,
        giftAmount:  Number(responseData[0].adminDueAmount || 0).toFixed(2)
      }, lang );
      let descriptionEnglishPro = config.bookingConfirmProNotificationDb({
        name      : (responseData[0].userId.fullName).split(' ')[0],
        location  : responseData[0].userId.location[0].address,
        date      : bookingDate,
        time      : responseData[0].timeSlot,
        price     : responseData[0].appointmentFee, //need to work later,
        giftAmount: Number(responseData[0].adminDueAmount || 0).toFixed(2)
      }, 'en' );
      let descriptionGreekPro = config.bookingConfirmProNotificationDb({
        name      : (responseData[0].userId.fullName).split(' ')[0],
        location  : responseData[0].userId.location[0].address,
        date      : bookingDate,
        time      : responseData[0].timeSlot,
        price     : responseData[0].appointmentFee, //need to work later,
        giftAmount:  Number(responseData[0].adminDueAmount || 0).toFixed(2)
      }, 'el' );
      //check device Android
      if (responseData[0].professionalId.deviceType == "A") {
        fcmNotification.androidNotification(
          responseData[0].professionalId.deviceToken,
          title,
          bodyforPro,
          "Confirm"
        );
      }
      //check device ios
      if (responseData[0].professionalId.deviceType == "I") {
        fcmNotification.iosNotification(
          responseData[0].professionalId.deviceToken,
          title,
          bodyforPro,
          "Confirm"
        );
      }
      //save notification data to db;
      notification.create({
        userType      : "PRO", 
        type          : "Confirm",
        title         : config.notificationContentEn.bookingConfirm, //english title
        description   : descriptionEnglishPro, //english description
        title2        : config.notificationContentEl.bookingConfirm, //greek title
        description2  : descriptionGreekPro, //Greek description
        userId        : responseData[0].userId._id,
        proId         : responseData[0].professionalId._id,
        deviceId      : responseData[0].professionalId.deviceToken,
        deviceType    : responseData[0].professionalId.deviceType,
        sendStatus    : 1,
        bookingId     : bookingId
      });

      // send notification to User
      let proName = responseData[0].professionalId.lastName? responseData[0].professionalId.firstName+' '+ (responseData[0].professionalId.lastName).slice(0 ,1).toUpperCase():responseData[0].professionalId.firstName;
      let bodyforUser  = config.bookingConfirmUserNotification({
        name      : proName,
        location  : responseData[0].userId.location[0].address,
        date      : bookingDate,
        time      : responseData[0].timeSlot,
        totalPrice: responseData[0].totalFee, //need to work later
        duePrice  : responseData[0].appointmentFee //need to work later
      }, lang );
      let descriptionEnglishUser = config.bookingConfirmUserNotificationDb({
        name      : proName,
        location  : responseData[0].userId.location[0].address,
        date      : bookingDate,
        time      : responseData[0].timeSlot,
        totalPrice: responseData[0].totalFee, //need to work later
        duePrice  : responseData[0].appointmentFee //need to work later
      }, 'en' );
      let descriptionGreekUser = config.bookingConfirmUserNotificationDb({
        name      : proName,
        location  : responseData[0].userId.location[0].address,
        date      : bookingDate,
        time      : responseData[0].timeSlot,
        totalPrice: responseData[0].totalFee, //need to work later
        duePrice  : responseData[0].appointmentFee //need to work later
      }, 'el' );
      if (responseData[0].userId.deviceType == "A") {
        fcmNotification.androidNotification(
          responseData[0].userId.deviceToken,
          title,
          bodyforUser,
          "Confirm"
        );
      }
      if (responseData[0].userId.deviceType == "I") {
        fcmNotification.iosNotification(
          responseData[0].userId.deviceToken,
          title,
          bodyforUser,
          "Confirm"
        );
      }
      //save notification data to db;
      notification.create({
        userType      : "USER", 
        type          : "Confirm",
        title         : config.notificationContentEn.bookingConfirm, //english title
        description   : descriptionEnglishUser, //english description
        title2        : config.notificationContentEl.bookingConfirm, //greek title
        description2  : descriptionGreekUser, //Greek description
        userId        : responseData[0].userId._id,
        proId         : responseData[0].professionalId._id,
        deviceId      : responseData[0].userId.deviceToken,
        deviceType    : responseData[0].userId.deviceType,
        bookingId     : bookingId,
        sendStatus    : 1,
      });
    }
    // remove temprary booking
    await removeTemporaryBooking();
  });
  return bookingId;
};

let removeTemporaryBooking = () => {
  myntBookModel.find({ status: "PENDING" }, (err, result) => {
    if (err || !result) console.log("errr", errr);
    else {
      result.forEach((element) => {
        let checkTime = utility.timeDifference(element.expireDate, new Date());
        if (checkTime < 0 || checkTime > 2) {
          myntBookModel.findOneAndUpdate(
            { _id: element._id },
            { status: "TIMEOUT" },
            () => {}
          );
        }
      });
    }
  });
};
/****************  getBookingDetail ************/
let getBookingDetail = (req, res) => {
  const userId = req.headers.decoded_id;
  let bookingId = req.query.bookingId;
  async.parallel(
    {
      checkReviewStatus: (cb) => {
        let query = {
          $and: [
            { "reviewAndRating.userId": userId },
            { "reviewAndRating.bookingId": bookingId },
          ],
        };
        userSchema
          .find(query)
          .populate({
            path: "reviewAndRating.userId",
            model: "userSchema",
            select: ["fullName", "image"],
          })
          .select(['reviewAndRating'])
          .exec((err, result) => {
            cb(null, result);
          });
      },
      get: (cb) => {
        myntBookModel
          .findById(bookingId)
          .populate({
            path: "professionalId",
            select: {
              image: 1,
              phone: 1,
              countryCode: 1,
              email: 1,
              firstName: 1,
              fullName: 1,
              lastName: 1,
              reviewAndRating: 1,
              bioData: 1,
              rating: 1,
            },
            populate: {
              path: "reviewAndRating.userId",
              model: "userSchema",
              select: ["fullName", "image"],
            },
          })
          .populate("userId", {
            image: 1,
            phone: 1,
            countryCode: 1,
            email: 1,
            firstName: 1,
            fullName: 1,
            lastName: 1,
            _id: 1,
          })
          .populate({
            path: "serviceId",
            select: ["subCategoryName", "subCategoryDescription","subCategoryName2","subCategoryDescription2","briefDescription","briefDescription2","time"],
            populate: {
              path: "categoryId",
              model: "myntCategory",
              select: [
                "categoryName",
                "categoryName2",
                "categoryImage",
                "categoryDescription",
                "categoryDescription2",
                "_id",
              ],
            },
          })
          .lean(true)
          .exec(async (err, result) => {
            if (err || !result) {

              if(req.headers.lang === "el")
                  return cb(apiResponse.notFoundResponse(res, statusMessageGr.NOT_FOUND),null);
              else
                  return cb(apiResponse.notFoundResponse(res, statusMessage.NOT_FOUND),null);
            } else {
              // result = result.filter(element => {
              result.professionalId.fullName =
                result.professionalId.fullName ||
                result.professionalId.firstName +
                  " " +
                  result.professionalId.lastName;

              /* await process */
              let query = {
                _id: result.professionalId._id,
                // 'favProfessional.userId': {
                //   'favProfessional.userId':{
                //   $in: result.userId._id,
                // },
                'favProfessional.bookingId': {
                  $in: result._id,
                },
              };
              let temp = await userSchema.findOne(query);
              result.favourite = temp ? true : false;
              cb(null, result);
            }
          });
      },
    },
    (err, result) => {
      let reviewCount = "0";
      if(result.checkReviewStatus.length){
        result.checkReviewStatus = result.checkReviewStatus.filter(ele => { 
          ele.reviewAndRating = ele.reviewAndRating.filter(ele =>(ele.bookingId).toString() == bookingId)
          return ele.reviewAndRating.length != 0;
        });
      }
      if (result.get) {
        let avg = 0;
        reviewCount = result.get.professionalId.reviewAndRating.length;
        result.get.professionalId.reviewAndRating.forEach((element) => {
          avg = avg + Number(element.rating);
        });

        avg =
          (avg / result.get.professionalId.reviewAndRating.length).toString() ||
          "0";

        if (avg === "NaN") result.get.professionalId["rating"] = "5";
        else result.get.professionalId["rating"] = (Number(avg)).toFixed(0);
        result.get.professionalId["reviewCount"] = (reviewCount).toString();  
        result.get.feedback = result.checkReviewStatus.length > 0 ? true : false;
        result.get.professionalId["reviewAndRating"] = result.checkReviewStatus.length > 0 ? result.checkReviewStatus[0].reviewAndRating:[];
        if (result.get){
          if(result.get.serviceId.length>0){
              result.get.serviceId.forEach((ele) => {
                if(req.headers.lang === "el"){
                  ele.subCategoryName=ele.subCategoryName2
                  ele.subCategoryDescription=ele.subCategoryDescription2
                  ele.briefDescription2=ele.briefDescription2
                  ele.categoryId.categoryDescription=ele.categoryId.categoryDescription2
                  ele.categoryId.categoryName=ele.categoryId.categoryName2
                }
  
              })
            }
        }

      if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res,statusMessageGr.success,result.get);
      else
          return apiResponse.successResponseWithData(res,statusMessage.success,result.get);
      }
    }
  );
};

/****************  getBookingList ************/
let getBookingList = (req, res) => {
  const userId = req.headers.decoded_id;
  let bookingId = req.query.bookingId;
  console.log(userId)
  async.parallel(
    {
      getpast: (cb) => {
        let query = {
          userId,
          status: {
            $in: ["COMPLETED", "CANCELLED"],
          },
          // serviceCompleted: true
        };
        myntBookModel
          .find(query)
          .sort({_id:-1})
          .populate({
            path: "professionalId",
            select: {
              image: 1,
              phone: 1,
              countryCode: 1,
              email: 1,
              firstName: 1,
              fullName: 1,
              lastName: 1,
              reviewAndRating: 1,
            },
            populate: {
              path: "reviewAndRating.userId",
              model: "userSchema",
              select: ["fullName", "image"],
            },
          })
          .populate("userId", {
            phone: 1,
            countryCode: 1,
            email: 1,
            firstName: 1,
            fullName: 1,
            lastName: 1,
            _id: 1,
          })
          .populate({
            path: "serviceId",
            select: ["subCategoryName", "subCategoryDescription", "subCategoryName2", "subCategoryDescription2", "time"],
            populate: {
              path: "categoryId",
              model: "myntCategory",
              select: [
                "categoryName",
                "categoryImage",
                "categoryDescription",
                "categoryName2",
                "categoryDescription2",
                "_id",
              ],
            },
          })
          .lean(true)
          // .populate('serviceId', { subCategoryDescription: 1, subCategoryName: 1, time: 1, _id: 1 })
          .exec(async (err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                  return cb(apiResponse.notFoundResponse(res, statusMessageGr.NOT_FOUND),null);
              else
                  return cb(apiResponse.notFoundResponse(res, statusMessage.NOT_FOUND),null);
            } else {
              for (let index = 0; index < result.length; index++) {
                const element = result[index];
                element.professionalId.fullName =
                  element.professionalId.fullName ||
                  element.professionalId.firstName +
                    " " +
                    element.professionalId.lastName;
                /* await process */
                let query = {
                  _id: element.professionalId._id,
                  'favProfessional.bookingId': {
                    $in: element._id,
                  },
                  // 'favProfessional.userId': {
                  //   $in: element.userId._id,
                  // },
                };
                let temp = await userSchema.findOne(query);

                console.log("temp",temp)

                element.favourite = temp ? true : false;
              }
              if(result.length > 0){
                result.forEach((ele) => {
                  ele.serviceId.forEach((ele2) => {
                    if(req.headers.lang === "el"){
                      ele2.subCategoryName = ele2.subCategoryName2
                      ele2.subCategoryDescription=ele2.subCategoryDescription2
                      ele2.briefDescription2=ele2.briefDescription2
                      ele2.categoryId.categoryDescription=ele2.categoryId.categoryDescription2
                      ele2.categoryId.categoryName=ele2.categoryId.categoryName2
                    }    
                  })
                })
              }
              cb(null, result);
            }
          });
      },
      getCurrent: (cb) => {
        let query = {
          userId,
          status: {
            // $nin: ["COMPLETED", "CANCELLED"],
            $in: ["CONFIRM"],
          },
        };
        myntBookModel
          .find(query)
          .sort({_id:-1})
          .populate("professionalId", {
            image: 1,
            phone: 1,
            countryCode: 1,
            email: 1,
            firstName: 1,
            fullName: 1,
            lastName: 1,
          })
          .populate("userId", {
            phone: 1,
            countryCode: 1,
            email: 1,
            firstName: 1,
            fullName: 1,
            lastName: 1,
            _id: 1,
          })
          .populate({
            path: "serviceId",
            select: ["subCategoryName", "subCategoryDescription", "time", "subCategoryName2", "subCategoryDescription2"],
            populate: {
              path: "categoryId",
              model: "myntCategory",
              select: [
                "categoryName",
                "categoryImage",
                "categoryDescription",
                "categoryName2",
                "categoryDescription2",
                "_id",
              ],
            },
          })
          // .lean(true)
          .exec(async (err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                  return cb(apiResponse.notFoundResponse(res, statusMessageGr.NOT_FOUND),null);
              else
                  return cb(apiResponse.notFoundResponse(res, statusMessage.NOT_FOUND),null);
            } else {

              console.log(JSON.stringify(result))

              for (let index = 0; index < result.length; index++) {
                const element = result[index];

                element.professionalId.fullName =
                  element.professionalId.fullName ||
                  element.professionalId.firstName +
                    " " +
                    element.professionalId.lastName;

                /* await process */
                let query = {
                  _id: element.professionalId._id,
                  favProfessional: {
                    $in: element.userId._id,
                    $in: element.userId._id,
                  },
                };
                let temp = await userSchema.findOne(query);
                element.favourite = temp ? true : false;
                console.log("end");
              }
              if(result.length > 0){
                result.forEach((ele) => {
                  ele.serviceId.forEach((ele2) => {
                    if(req.headers.lang === "el"){
                      ele2.subCategoryName=ele2.subCategoryName2
                      ele2.subCategoryDescription=ele2.subCategoryDescription2
                      ele2.briefDescription2=ele2.briefDescription2
                      ele2.categoryId.categoryDescription=ele2.categoryId.categoryDescription2
                      ele2.categoryId.categoryName=ele2.categoryId.categoryName2
                    }    
                  })
                })
              }
              cb(null, result);
            }
          });
      },
    },
    (err, result) => {
      if (result){
        if(req.headers.lang === "el")
            return apiResponse.successResponseWithData(res,statusMessageGr.success,result);
        else
            return apiResponse.successResponseWithData(res,statusMessage.success,result);
      }
    }
  );
};

// /****************  getFavProfessionalList ************/
// let getFavProfessionalList = (req, res) => {
//   const userId = req.headers.decoded_id;
//   console.log(userId);
//   let level1 = 0,
//     level2 = 0,
//     level3 = 0;
//   async.parallel(
//     {
//       get: (cb) => {
//         let query = {
//           favProfessional: { $in: [userId] },
//           status: "ACTIVE",
//           userType: "PRO",
//         };
//         userSchema.find(query)
//           .select(["phone","professionalLevel","countryCode","fullName","email",
//             "image","firstName","lastName","_id","reviewAndRating","timeSlot",])
//           .lean(true)
//           .exec((err, result) => {
//             if (err || !result) {
//               return cb(
//                 apiResponse.notFoundResponse(res, statusMessage.NOT_FOUND),
//                 null
//               );
//             } else {
//               result = result.filter((el) => {
//                 el.fullName = el.fullName || el.firstName + " " + el.lastName;
//                 return true;
//               });
//               cb(null, result);
//             }
//           });
//       },
//       getService: (cb) => {
//         console.log(req.query);
//         let _id = req.query.serviceId;
//         console.log(_id);
//         if (_id) {
//           let query = { _id: { $in: _id.split(",") } };
//           myntSubCategoryModel.find(query).select("price").lean(true).exec((err, result) => {
//               if (err || !result) {
//               } else {
//                 result = result.filter((el) => {
//                   level1 = level1 + Number(el.price.level1);
//                   level2 = level2 + Number(el.price.level2);
//                   level3 = level3 + Number(el.price.level3);
//                   return true;
//                 });
//                 cb(null, result);
//               }
//             });
//         } else {
//           cb(null, []);
//         }
//       },
//     },
//     (err, result) => {

//       result.get.forEach((element) => {
//         let avg = 0;

//         element.reviewAndRating.forEach((ele, i) => {
//           avg = avg + Number(ele.rating);
//         });
//         element.rating = (avg / element.reviewAndRating.length).toString();

//         if (element.rating === "NaN") element.rating = "5";

//         element.price =
//           element.professionalLevel == "1"
//             ? level1.toString()
//             : element.professionalLevel == "2"
//             ? level2.toString()
//             : level3.toString();
//       });

//       if (result.get)
//         return apiResponse.successResponseWithData(
//           res,
//           statusMessage.success,
//           result.get
//         );
//     }
//   );
// };


//****************  getFavProfessionalList New 30 april chnages************//
//****************  getFavProfessionalList ************//
let getFavProfessionalList = async (req, res) => {

  const userId = req.headers.decoded_id;
  let level1 = 0,level2 = 0,level3 = 0;
  let qrty={serviceId:{$in:req.query.serviceId.split(",")},status:{$nin:["TIMEOUT"]}};
  let subCategoryData = await myntSubCategoryModel.find({_id: {$in:req.query.serviceId.split(",")}}).select(['price','time']).lean().exec();
  let totalSubPriceLevel1 = subCategoryData.map(ele=> Number(ele.price.level1)).reduce((a,b)=>a+b,0);
  let totalSubPriceLevel2 = subCategoryData.map(ele=> Number(ele.price.level2)).reduce((a,b)=>a+b,0);
  let totalSubPriceLevel3 = subCategoryData.map(ele=> Number(ele.price.level3)).reduce((a,b)=>a+b,0);
  let totalSubTime        = subCategoryData.map(ele=> Number(ele.time)).reduce((a,b)=>a+b,0);
  let getBookingId = await myntBookModel.find(qrty).lean().exec();
  let bookingIds = getBookingId.map((ele) => mongoose.Types.ObjectId(ele._id));
  if(bookingIds.length < 1) {
    if(req.headers.lang === "el")
        return apiResponse.successResponseWithData(res, statusMessageGr.success,[]);
    else
        return apiResponse.successResponseWithData(res, statusMessage.success,[]);
  }
  let currentDate = new Date(moment().startOf('day'));
  let position = req.query.serviceId.split(",").map( ele => mongoose.Types.ObjectId(ele));
  let criteria = [
    { 'favProfessional.userId': { $in: [mongoose.Types.ObjectId(userId)] } },
    { 'favProfessional.bookingId': { $in: bookingIds } },
    { status: "ACTIVE" },
    { userType: "PRO"  },
    { position: { $all: position }}
  ];
  let query = [{
    $lookup: {
      from: "myntCalender",
      let: { proId: "$_id" },
      pipeline: [
        {
          $addFields: {
            sortKeyDate: {
              $toDate: "$calenderDate",
            },
          },
        },
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$proId", "$$proId"] },
                { $eq: ["$status", "ACTIVE"] },
                { $gte: ["$sortKeyDate", currentDate] },
              ],
            },
          },
        },
        { $sort: {"sortKeyDate": 1}}
      ],
      as: "proIdCalender",
    }
  },
    { $match: { $and: criteria } },
    { $group:{ _id:"$_id", "doc": { "$first": "$$ROOT" }}},
    { "$replaceRoot": { "newRoot": "$doc" }},
    {
      $project: {phone: 1,professionalLevel: 1,countryCode: 1,fullName: 1,email: 1,image: 1,
        firstName: 1,lastName: 1,_id: 1,reviewAndRating: 1,rating: 1,proIdCalender: 1,favProfessional:1},
    }
  ];
  let result = await userSchema.aggregate(query).exec();
  if (result.length > 0 ){ 
    let responceData=[];
    // removing those user whos calender not exist
    responceData = result.map((ele)=>{ if(ele.proIdCalender.length) return ele });
    // get current time so we remove past timeslot of current date
    let currentTime = moment().add(7.5 ,'hour');
    let hour   = currentTime.hour();
    let minute = currentTime.minute();
    if(minute <= 30) currentTime.set({minute: 30});
    if(minute >  30) currentTime.set({hour: hour + 1, minute: 0});
    let cDate = moment().format("YYYY-M-D");
    responceData = responceData.filter(ele => {
      ele.proIdCalender = ele.proIdCalender.filter(ele2 =>{
        if(ele2.calenderDate == cDate){
          ele2.timeLog = ele2.timeLog.filter(ele3 =>{
            return ele3.isSelected == 1 && ele3.isBooked == 0 && moment(ele3.time, 'HH:mm').hour() >=  hour;
          });
          // let findIndexofCurrentTime = ele2.timeLog.findIndex(el => el.time == currentTime);
          // ele2.timeLog = findIndexofCurrentTime > -1? ele2.timeLog.slice(findIndexofCurrentTime): [];
        }else{
          ele2.timeLog = ele2.timeLog.filter(ele3 =>{
            return ele3.isSelected == 1 && ele3.isBooked == 0;
          })
        } 
        return ele2.timeLog.length != 0;
        // return true;
      }); 
      // return ele.proIdCalender.length != 0;
      return true;
    });
    // adding price and avg rating column
    responceData.forEach((element) => {
      let avg = 0;
      element.reviewAndRating.forEach((ele, i) => {avg = avg + Number(ele.rating)});
      element.rating = (avg / element.reviewAndRating.length).toString();
      if (element.rating === "NaN") element.rating = "5";
      if (element.professionalLevel == "1") element.price = totalSubPriceLevel1.toString();
      if (element.professionalLevel == "2") element.price = totalSubPriceLevel2.toString();
      if (element.professionalLevel == "3") element.price = totalSubPriceLevel3.toString();
      element.time = totalSubTime.toString();
      element.rating = (Number(element.rating)).toFixed(0);
    });

    if(req.headers.lang === "el")
        return apiResponse.successResponseWithData(res,statusMessageGr.success,responceData);
    else
        return apiResponse.successResponseWithData(res,statusMessage.success,responceData);
  }
  if(req.headers.lang === "el")
    return apiResponse.successResponseWithData(res,statusMessageGr.success,result);
  else
    return apiResponse.successResponseWithData(res,statusMessage.success,result)
};

//*********checking Booking Service Exist or Not ***********//
//*********checking Booking Service Exist or Not ***********//

const checkBookingService = async (req) => {
  try {

    let query = [{_id:req.bookingId },
        { serviceId: { $in: req.serviceId.split(",") } }];

    return await myntBookModel.find(query, async (result) => {
      return result;
    });

  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};

/* updateUserStatus */
let updateUserStatus = (req, res) => {
  try {
    console.log("22222222", req.headers);
    const userId = req.headers.decoded_id;
    let { status } = req.query;
    let query = {
      _id: userId,
    };
    let update = {
      $set: {},
    };
    status ? (update.$set.status = status) : true;
    console.log(query, update);
    userSchema.findOneAndUpdate(query, update, (err, result) => {
      if (err || !result) {
        apiResponse.ErrorResponseWithData(
          res,
          statusMessage["SOME-THING-WENT-WRONG"],
          err
        );
      } else {
        if(req.headers.lang === "el")
            apiResponse.successResponse(res, statusMessageGr.UPDATED);
        else
            apiResponse.successResponse(res, statusMessage.UPDATED);
      }
    });
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};


/*************************** editProfile *************************/
/*************************** editProfile *************************/
let editProfile = (req, res) => {
  const _id = req.headers.decoded_id;
  let empty = [];
  let form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 }); //setting max size of image to 10MB
  form.parse(req, (err, fields, files) => {
    console.log(fields, files);
    async.parallel(
      {
        uploadImage: (cb) => {
          if (!files.files) {
            return cb(null, empty);
          }
          utility.uploadMultipleImageIntoCloudinary(files, (image) => {
            cb(null, image);
          });
        },
        getProfileDetails: (cb) => {
          userSchema.findById(_id).exec((err, result) => {
            cb(null, result);
          });
        },
      },
      (err, result) => {
        let temp = {};
        result.uploadImage && result.uploadImage[0]
          ? (temp.image = result.uploadImage[0])
          : true;
        fields.fullName ? (temp.fullName = fields.fullName[0]) : true;
        fields.email ? (temp.email = fields.email[0]) : true;
        fields.countryCode ? (temp.countryCode = fields.countryCode[0]) : true;
        fields.phone ? (temp.phone = fields.phone[0]) : true;
        fields.completeProfile
          ? (temp.completeProfile = fields.phone[0])
          : true;
        userSchema.findOneAndUpdate(
          { _id },
          temp,
          { new: true },
          (err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                  apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
              else
                  apiResponse.ErrorResponse(res, statusMessage.ValidationError);
            } else {
                result.portfolio =  result.portfolio.filter( ele2 => ele2);
              if(req.headers.lang === "el")
                  apiResponse.successResponseWithData(res,statusMessageGr.UPDATED,result);
              else
                  apiResponse.successResponseWithData(res,statusMessage.UPDATED,result);
            }
          }
        );
      }
    );
  });
};

/**
 * get reward api.
 * @returns {Object}
 */
let getReward = (req, res) => {
  try {
    const _id = req.headers.decoded_id;
    let criteria = { status: req.query.status || "ACTIVE" };

    async.parallel(
      {
        reward: (cb) => {
          myntRewardModel
            .find(criteria)
            .lean(true)
            .exec((err, result) => {
              cb(null, result);
            });
        },
        userData: (cb) => {
          userSchema
            .findById(_id)
            .lean(true)
            .exec(async (err, result) => {
              cb(null, result);
            });
        },
      },
      (err, result) => {
        if (result.reward) {
          console.log("result.userData", result.userData);
          let temp = {
            reward: result.reward,
            userPoint: result.userData.userPoint
          };
          if(req.headers.lang === "el")
              apiResponse.successResponseWithData(res, statusMessageGr.success, temp);
          else
              apiResponse.successResponseWithData(res, statusMessage.success, temp);
        }
      }
    );
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};


/**
 * getGiftCard api.
 * @returns {Object}
 */
let getGiftCard = (req, res) => {
  try {
    let criteria = { status: req.query.status || "ACTIVE" };
    myntGiftCardModel
      .find(criteria)
      .lean(true)
      .exec((err, result) => {
        console.log("err", err);
        if (err || !result || result.length == 0) {
          if(req.headers.lang === "el")
              return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
          else
              return apiResponse.successResponseWithData(res,statusMessage.success,[]);
        }
        result = result.map(ele =>{
          ele.name = req.headers.lang ==='el'? ele.name2: ele.name;
          return ele;
        })
        if(req.headers.lang === "el")
            apiResponse.successResponseWithData(res, statusMessageGr.success, result);
        else
            apiResponse.successResponseWithData(res, statusMessage.success, result);
      });
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};


/********************Send Gift Card Amount to User
 * @method post
 * @param email email of sender to send a mail notification.
 * @param giftCardId giftcard Template.
 * @param cardId card token for payment.
 * @return object;
*/

const sendGiftCard = async(req, res) => {
  const { email, giftCardId , cardId, cardCustomerToken} = req.body;
  const userId = req.headers.decoded_id;
  try{
    let msg               = req.headers.lang ==='el'? statusMessageGr.NOT_EXIST: statusMessage.NOT_EXIST;
    let getUserData       = await userSchema.findOne({_id: userId}).lean().exec();
    let getReceiverData   = await userSchema.findOne({email: email, userType: "USER"}).lean().exec();
    let gifCardTemplate   = await myntGiftCardModel.findOne({_id: giftCardId}).lean().exec();
    if(!gifCardTemplate)  throw new Error(msg);
    //check sending same user, throw error;
    if(getUserData && getUserData.email == email){
      let msg = req.headers.lang ==='el'? statusMessageGr.GIFTCARDSAMEEMAIL: statusMessage.GIFTCARDSAMEEMAIL;
      throw new Error(msg);
    }
    //Do Payment so we can credit amount to receiver 
    let paymentRequestData = {
      amount  : gifCardTemplate.price,
      token   : cardCustomerToken,
      card    : cardId
    };
    let doPaymnetReq = await doPayment(paymentRequestData);
    // save payment record to db
    let paymentToSaveData = { 
      userId              : userId,
      paymentId           : doPaymnetReq.token,
      amount              : doPaymnetReq.amount,
      refundAmount        : doPaymnetReq.amount,
      type                : 'GIFTCARD'
    };
    await paymentModel.create(paymentToSaveData);
    //save gift card data to db
    let SendGiftDateToSave = {
      senderId      : userId,
      receiverId    : getReceiverData? getReceiverData._id: null,
      giftCardId    : giftCardId,
      amount        : gifCardTemplate.price,
      balanceAmount : gifCardTemplate.price,
      email         : email,
    }
    await myntSendGiftCardModel.create(SendGiftDateToSave);
    //send Email to Reciever; registered, non-registered
    let senderTemplate = gitfCardEmailTemplate.senderEmail({fullName: getUserData.fullName,amount:gifCardTemplate.price},req.headers.lang);
    let receiverTemplate = gitfCardEmailTemplate.receiverEmail({fullName: getUserData.fullName,amount:gifCardTemplate.price},req.headers.lang);
    mailer.sendCred(getUserData.email, 'MYNT GIFT CARD', senderTemplate);
    mailer.sendCred(email, 'MYNT GIFT CARD', receiverTemplate);
    //Send Notification to register user in app
    if(getReceiverData){
      let notificationDataToSave = {
        userType      : "USER",
        type          : "GIFTCARD",
        title         : 'Gift Received', //english title
        title2        : 'Το δώρο ελήφθη', //greek title
        description   : config.giftReceiverNotificationContent({fullName:getUserData.fullName, amount:gifCardTemplate.price},'en'), //english description
        description2  : config.giftReceiverNotificationContent({fullName:getUserData.fullName, amount:gifCardTemplate.price},'el'), //Greek description
        userId        : getReceiverData._id,
        sendStatus    : 1,
      }
      await notification.create(notificationDataToSave);
      //update giftcard transaction records
      giftCardTransactionModel.create({
        userId :  getReceiverData._id,
        amount : gifCardTemplate.price,
        title  : config.notificationContentEn.giftCardTransactionTitleIn,
        title2  : config.notificationContentEl.giftCardTransactionTitleIn,
        senderId : userId,
      });
      // send push notification to receiver
      if (getReceiverData.deviceType == "A") {
        fcmNotification.androidNotification(
          getReceiverData.deviceToken,
          'Gift Received',
          config.giftReceiverNotificationContent({fullName:getUserData.fullName, amount:gifCardTemplate.price},req.headers.lang),
          "GIFTCARD"
        );
      }
      //check device ios
      if (getReceiverData.deviceType == "I") {
        fcmNotification.iosNotification(
          getReceiverData.deviceToken,
          'Gift Received',
          config.giftReceiverNotificationContent({fullName:getUserData.fullName, amount:gifCardTemplate.price},req.headers.lang),
          "GIFTCARD"
        );
      }
    }
    let responseMsg = req.headers.lang ==='el'? statusMessageGr.GIFTCARDSUCCESS: statusMessage.GIFTCARDSUCCESS;
    apiResponse.successResponse(res, responseMsg);
  }catch(e){
    apiResponse.ErrorResponse(res, e.message || e);
  }
};


/*************************** contactUs *************************/
/*************************** contactUs *************************/
let contactUs = (req, res) => {
  const userId = req.headers.decoded_id;
  let empty = [];
  let form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 }); //setting max size of image to 10MB
  form.parse(req, (err, fields, files) => {
    console.log(fields, files);
    async.parallel(
      {
        uploadImage: (cb) => {
          if (!files.files) {
            return cb(null, empty);
          } else {
            utility.uploadMultipleImageIntoCloudinary(files, (image) => {
              console.log(image);
              cb(null, image);
            });
          }
        },
      },
      (err, result) => {
        let temp = { userId };
        result.uploadImage && result.uploadImage.length > 0
          ? (temp.image = result.uploadImage)
          : true;
        fields.lastName[0] ? (temp.lastName = fields.lastName[0]) : true;
        fields.email[0] ? (temp.email = fields.email[0]) : true;
        fields.message[0] ? (temp.message = fields.message[0]) : true;

        if (fields.phone) temp.phone = fields.phone[0];

        myntContactModel.create(temp, (err, result) => {
          console.log(err);
          if (err || !result) {
            if(req.headers.lang === "el")
                apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
            else
                apiResponse.ErrorResponse(res, statusMessage.ValidationError);
          } else {
            if(req.headers.lang === "el")
                apiResponse.successResponseWithData(res,statusMessageGr.THANKYOU,result);
            else
                apiResponse.successResponseWithData(res,statusMessage.THANKYOU,result);
          }
        });
      }
    );
  });
};


/* ************************* updateBookingStatus ************************************/
/* ************************* updateBookingStatus ************************************/
let updateBookingStatus = (req, res) => {
  try {
    const userId = req.headers.decoded_id;
    let { status, bookingId, reason } = req.body;
    let query = {
      _id: bookingId,
    };
    let update = {
      $set: {},
      $push: {
        activityLog: {
          userId,
          status,
          reason,
        },
      },
    };

    // enum: ["ACTIVE", "INACTIVE", 'CANCELLED','ACCEPTED','PENDING', 'REJECTED', 'COMPLETED','TIMEOUT','CONFIRM'],

    status ? (update.$set.status = status) : true;
    myntBookModel.findOneAndUpdate(query, update, async (err, result) => {
      if (err || !result) {
        if(req.headers.lang === "el")
            apiResponse.ErrorResponseWithData(res,statusMessageGr["SOME-THING-WENT-WRONG"],err);
        else
            apiResponse.ErrorResponseWithData(res,statusMessage["SOME-THING-WENT-WRONG"],err);
      } else {
        if(status =='CANCELLED'){
          await requestRejectNotification(req.body, req.headers.lang);
          let slotReleaseData = {
            date      :  result.date,
            timeSlot  :   result.timeSlot,
            professionalId :  result.professionalId
          }
          await slotRelease(slotReleaseData)          
          //refund payment process
          try{
            //check one day before cancel,if yes then refund. same day cancelled no refund;
            let bookingDate = moment(new Date(result.date)).startOf('days');
            let currentDate = moment().startOf('days');
            if(currentDate.isBefore(bookingDate, 'd')){
              if(result.serviceFee <=  0){
                if(result.creditPointApplied){ 
                  await userSchema.updateOne({_id: userId}, { $inc : { userPoint: result.creditPoint}}).exec();
                }
                if(result.giftCardApplied){
                  updateGiftAmountOnCancelbooking(result.giftCardAmount, userId)
                }
                let msg = req.headers.lang ==='el'?statusMessageGr.USER_REFUND_NO_PAYMENT:statusMessage.USER_REFUND_NO_PAYMENT;
                return apiResponse.refundResponse(res, msg, result)
              }else{
                let getPaymentData = await paymentModel.findOne({bookingId: bookingId}).lean().exec();
                if(!getPaymentData){
                  let msg = req.headers.lang === "el"?statusMessageGr.NOT_FOUND:statusMessage.NOT_FOUND;
                  return apiResponse.ErrorResponseWithData(res,msg,[]);
                }
                // check creditPoint Applied if yes then return his credit also
                if(result.creditPointApplied){
                  await userSchema.updateOne({_id: userId}, { $inc : { userPoint: result.creditPoint}}).exec();
                }
                if(result.giftCardApplied){
                  updateGiftAmountOnCancelbooking(result.giftCardAmount, userId)
                }
                //update Payment db
                let paymentUpdateData = {
                  isRequestForRefund : true
                }
                await paymentModel.updateOne({_id: getPaymentData._id},{ $set : paymentUpdateData}).exec();
                // fire notification to Admin;
                let notificationDataToSave = {
                  userType      : "ADMIN",
                  type          : "REFUND",
                  title         : config.notificationContentEn.refundTitle, //english title
                  description   : config.notificationContentEn.refundCancelBookingUser, //english description
                  title2        : config.notificationContentEl.refundTitle, //greek title
                  description2  : config.notificationContentEl.refundCancelBookingUser, //Greek description
                  userId        : userId,
                  proId         : result.professionalId,
                  sendStatus    : 1,
                  bookingId     : bookingId
                }
                await notification.create(notificationDataToSave);
                if(req.headers.lang === "el"){
                  return apiResponse.refundResponse(res,statusMessageGr.USER_REFUND,result)
                }else{
                  return apiResponse.refundResponse(res,statusMessage.USER_REFUND,result)
                }
              }
            }else{
              if(req.headers.lang === "el"){
                return apiResponse.refundResponse(res,statusMessageGr.USER_NO_REFUND,result)
              }else{
                return apiResponse.refundResponse(res,statusMessage.USER_NO_REFUND,result)
              }
            }
          }catch(e){
            return apiResponse.ErrorResponseWithData(res,e);
          }
        }
        if(req.headers.lang === "el")
            apiResponse.successResponse(res, statusMessageGr.UPDATED);
        else
            apiResponse.successResponse(res, statusMessage.UPDATED);
      }
    });
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};


/****************  requestRejectNotification ************/
/****************  requestRejectNotification ************/
let requestRejectNotification = (req, lang = 'en') => {
  myntBookModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.bookingId), status: "CANCELLED"}},
    { $lookup: { from: "userSchema", localField: "userId", foreignField: "_id", as: "userId" }},
    { $unwind: "$userId" },
    { $lookup: { from: "userSchema", localField: "professionalId", foreignField: "_id", as: "professionalId"}},
    { $unwind: "$professionalId" },
    { $lookup: { from: "myntSubCategory", localField: "serviceId", foreignField: "_id", as: "serviceId" }},
    { $unwind: "$serviceId" },
    { $project: {
        timeSlot: 1,
        expireDate: 1,
        date: 1,
        createdAt: 1,
        serviceFee: 1,
        userId: { firstName: 1, lastName: 1, deviceToken: 1, deviceType: 1, _id: 1,location: 1},
        professionalId: { firstName: 1, lastName: 1, deviceToken: 1, deviceType: 1, _id: 1,location: 1},
        serviceId: { subCategoryName: 1, time: 1 },
    }},
  ]).
  exec((err, responseData) => {
    if (responseData.length) {
      // send notification to professional booking cancelled.
      let title       = lang ==='el'? config.notificationContentEl.bookingCancelTitle:config.notificationContentEn.bookingCancelTitle;
      let bodyforPro  = lang ==='el'? config.notificationContentEl.bookingCancel:config.notificationContentEn.bookingCancel;
      //check device Android
      if (responseData[0].professionalId.deviceType == "A") {
        fcmNotification.androidNotification(
          responseData[0].professionalId.deviceToken,
          title,
          bodyforPro,
          "CANCELLED"
        );
      }
      //check device ios
      if (responseData[0].professionalId.deviceType == "I") {
        fcmNotification.iosNotification(
          responseData[0].professionalId.deviceToken,
          title,
          bodyforPro,
          "CANCELLED"
        );
      }
      //save notification data to db;
      notification.create({
        userType      : "PRO", 
        type          : "CANCELLED",
        title         : config.notificationContentEn.bookingCancelTitle, //english title
        description   : config.notificationContentEn.bookingCancel, //english description
        title2        : config.notificationContentEl.bookingCancelTitle, //greek title
        description2  : config.notificationContentEl.bookingCancel, //Greek description
        userId        : responseData[0].userId._id,
        proId         : responseData[0].professionalId._id,
        deviceId      : responseData[0].professionalId.deviceToken,
        deviceType    : responseData[0].professionalId.deviceType,
        sendStatus    : 1,
        bookingId     : req.bookingId
      });
    }
  });
  return req;
};

/****************  provideReview ************/
/****************  provideReview ************/
let updateReview = (req, res) => {
  const userId = req.headers.decoded_id;
  req.body.userId = userId;
  console.log(req.body, userId);
  let { proId, bookingId, rating, review } = req.body;
  async.parallel(
    {
      create: (cb) => {
        let query = {
          _id: proId,
        };
        let update = {
          $push: { reviewAndRating: { userId, bookingId, rating, review } },
        };
        console.log(update);
        console.log(query);
        userSchema.findOneAndUpdate(query, update, (err, result) => {
          console.log(err, result);
          if (err || !result) {
            if(req.headers.lang === "el")
                return cb(apiResponse.ErrorResponseWithData(res,statusMessageGr.DB_ERROR,err),null);
            else
                return cb(apiResponse.ErrorResponseWithData(res,statusMessage.DB_ERROR,err),null);
          } else {
            cb(null, result);
          }
        });
      },
    },
    (err, result) => {
      if (result.create){
      if(req.headers.lang === "el")
            return apiResponse.successResponseWithData(res,statusMessageGr.success,result.create);
      else
            return apiResponse.successResponseWithData(res,statusMessage.success,result.create);
    }
   }
  );
};

/*************************** photoShoot *************************/
/*************************** photoShoot *************************/
let photoShootEnquiry = (req, res) => {
  const userId = req.headers.decoded_id;

  let request = ({ email, phone, name, countryCode } = req.body);
  request.userId = userId;
  myntPhotoShootModel.create(request, (err, result) => {
    console.log(err);
    if (err || !result) {
      if(req.headers.lang === "el")
          apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
      else
          apiResponse.ErrorResponse(res, statusMessage.ValidationError);
    } else {
      if(req.headers.lang === "el")
          apiResponse.successResponseWithData(res,statusMessageGr.ENQUIRY,result);
      else
          apiResponse.successResponseWithData(res,statusMessage.ENQUIRY,result);
    }
  });
};


/*************************** logout *************************/
/*************************** logout *************************/
let logout = (req, res) => {
  const userId = req.headers.decoded_id;

  let request = {
    token: "",
  };

  userSchema.findByIdAndUpdate(
    { _id: userId },
    { $set: request },
    (err, result) => {
      console.log(err);
      if (err || !result) {
        if(req.headers.lang === "el")
            apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
        else
            apiResponse.ErrorResponse(res, statusMessage.ValidationError);
      } else {
        if(req.headers.lang === "el")
              apiResponse.successResponseWithData(res, statusMessageGr.UPDATED);
        else
            apiResponse.successResponseWithData(res, statusMessage.UPDATED);
      }
    }
  );
};


/*************************** update user status *************************/
/*************************** update user status *************************/
let updateStatus = (req, res) => {
  const userId = req.headers.decoded_id;
  if (!req.body.status) {
    if(req.headers.lang === "el")
        return apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
    else
        return apiResponse.ErrorResponse(res, statusMessage.ValidationError);
  }
  let request = {
    status: req.body.status,
    reason: req.body.reason ? req.body.reason : "Other",
  };

  userSchema.findByIdAndUpdate(
    { _id: userId },
    { $set: request },
    (err, result) => {
      console.log(err);
      if (err || !result) {
        if(req.headers.lang === "el")
            apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
        else
            apiResponse.ErrorResponse(res, statusMessage.ValidationError);
      } else {
        if(req.headers.lang === "el")
          apiResponse.successResponseWithData(res, statusMessageGr.UPDATED);
        else
          apiResponse.successResponseWithData(res, statusMessage.UPDATED);
      }
    }
  );
};

/****************  helpVideo ************/
/****************  helpVideo ************/
let helpVideo = (req, res) => {
  const userId = req.headers.decoded_id;
  req.body.userId = userId;
  console.log(req.body, userId);
  let result = {
    url:
      "https://techugocoms3.s3-ap-south-1.amazonaws.com/video/1604064885@ReusableUIViewClass_CustomAlertView_SurajSharma_ConfianceLabs_Swift.mp4",
  };
  if(req.headers.lang === "el")
    return apiResponse.successResponseWithData(res,statusMessageGr.success,result);
  else
    return apiResponse.successResponseWithData(res,statusMessage.success,result);
};

/**
 * getReferCode api.
 * @returns {Object}
 */
let getReferCode = async(req, res) => {
  try {
    const userId = req.headers.decoded_id;
    let userData    = await userSchema.findOne({ _id: userId }).select(["myReferralCode", "myReferralCodePrice","userPoint"]).lean().exec();
    if(!userData){
      let msg = req.headers.lang ==='el'?statusMessageGr.NOT_FOUND:statusMessage.NOT_FOUND;
      throw new Error(msg);
    }
    let settingData = await myntSettingModel.findOne({status:"ACTIVE"}).lean().exec();
    if(!settingData){
      let msg = req.headers.lang ==='el'?statusMessageGr.NOT_FOUND:statusMessage.NOT_FOUND;
      throw new Error(msg);
    }
    let msg = req.headers.lang ==='el'?statusMessageGr.success:statusMessage.success;
    return apiResponse.successResponseWithData(res,msg,{ user: userData, setting: settingData});
  }catch (err) {
    return apiResponse.ErrorResponse(res, err.message);
  }
};

/****************  getFaq ************/
/****************  getFaq ************/
let getFaq = (req, res) => {
  const userId = req.headers.decoded_id;
  let queryS = {status:"ACTIVE", userType: "USER"}
  async.parallel(
    {
      get: (cb) => {
        myntFaq
          .find(queryS)
          .lean(true)
          .exec((err, result) => {
            console.log("err", err);
            if (err || !result || result.length == 0) {

              if(req.headers.lang === "el")
                return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
              else
                return apiResponse.successResponseWithData(res,statusMessage.success,[]);
            }

        if(result.length>0){
          result.forEach((ele) => {
            if(req.headers.lang === "el"){
              ele.title=ele.title2
              ele.description=ele.description2
              ele.question=ele.question2
              ele.answer=ele.answer2
            }
          })
    }
            if(req.headers.lang === "el")
                apiResponse.successResponseWithData(res,statusMessageGr.success,result);
            else
                apiResponse.successResponseWithData(res,statusMessage.success,result);
          });
      },
    },
    (err, result) => {
      if (result.get){
        if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res,statusMessageGr.success,result.get);
        else
          return apiResponse.successResponseWithData(res,statusMessage.success,result.get);
      }
    }
  );
};

/****************  getNotificationList ************/
/****************  getNotificationList ************/
let getNotificationList = (req, res) => {
  const userId = req.headers.decoded_id;
  let titleField = req.headers.lang ==='el'?"$title2":"$title";
  let descriptionField = req.headers.lang ==='el'?"$description2":"$description";
  notification
    .aggregate([
      { $match: {
        userId: mongoose.Types.ObjectId(userId),
        userType: "USER"
      }},
      { $sort : {_id: -1}},
      { $limit : 100 },
      {
        $lookup: {
          from: "userSchema",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      {
        $lookup: {
          from: "userSchema",
          localField: "proId",
          foreignField: "_id",
          as: "proId",
        },
      },
      { $unwind: {path:"$proId" , preserveNullAndEmptyArrays: true}},
      {
        $project: {
          title: titleField,
          description: descriptionField,
          createdAt: 1,
          type : 1,
          userId:{
            fullName :1,
            image : 1
          },
          proId:{
            firstName :1,
            lastName :1,
            image : 1
          },
          bookingId: 1
        },
      },
    ])
    .exec((err, data) => {
      if(err) {
        if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
        else
          return apiResponse.successResponseWithData(res,statusMessage.success,[]);
      }
      if(data.length){
        data.forEach((ele) => {
          if(ele.type ==='GIFTCARD'){
            ele.image = process.env.APP_URL+'/public/payment.png';
          }else{
            ele.image = process.env.APP_URL+'/public/booking.png';
          }
        });
      }
      if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res,statusMessageGr.success,data);
      else
          return apiResponse.successResponseWithData(res,statusMessage.success,data);
    });
};

/****************  feedbackList ************/
/****************  feedbackList ************/
let feedbackList = (req, res) => {
  const userId = req.headers.decoded_id;
  const bookingId = req.query.bookingId;

  async.parallel(
    {
      feedback: (cb) => {
        userSchema
          .find({ "reviewAndRating.bookingId": bookingId })
          .select(["reviewAndRating"])
          .populate({
            path: "reviewAndRating.userId",
            select: ["fullName", "image", bookingId],
          })
          .exec((err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                  return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
              else
                return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);
            } else {
              cb(null, result);
            }
          });
      },
    },
    (err, result) => {
      console.log("resilt-<>>>", result.feedback[0].reviewAndRating);
      delete result.feedback[0]._id;
      if (err){
        if(req.headers.lang === "el")
            return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
        else
            return apiResponse.successResponseWithData(res,statusMessage.success,[]);
      }

      if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res,statusMessageGr.success,result.feedback[0].reviewAndRating);
      else
          return apiResponse.successResponseWithData(res,statusMessage.success,result.feedback[0].reviewAndRating);
    }
  );
};

/* becomeMyntPro */
let becomeMyntPro = (req, res) => {
  try {
    let form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 }); //setting max size of image to 10MB
    form.parse(req, (err, fields, files) => {
      console.log(fields, files);
      let request = {};
      for (var key in fields) {
        if (fields.hasOwnProperty(key) && fields[key].length) {
          if (key.toString() != "position") {
            request[key] = fields[key][0];
          } else {
            request[key] = fields[key][0].split(",");
          }
        }
      }
      async.waterfall(
        [
          (cb) => {
            let checkEmail = {
              email: request.email,
              userType: "PRO",
            };
            userSchema.findOne(checkEmail).exec((err, result) => {
              if (err || !result) {
                cb(null, "");
              } else {

                if(req.headers.lang === "el")
                    return apiResponse.ALREADY_EXIST(res,statusMessageGr["EMAIL_ALREADY_REGISTERED"]);
                else
                    return apiResponse.ALREADY_EXIST(res,statusMessage["EMAIL_ALREADY_REGISTERED"]);
              }
            });
          },
          (test, cb) => {
            let checkPhone = {
              phone: request.phone,
              userType: "PRO",
            };
            userSchema.findOne(checkPhone).exec((err, result) => {
              if (err || !result) {
                cb(null, "");
              } else {
                if(req.headers.lang === "el")
                    return apiResponse.ALREADY_EXIST(res,statusMessageGr["phonenumber_already"]);
                else
                    return apiResponse.ALREADY_EXIST(res,statusMessage["phonenumber_already"]);
              }
            });
          },
          (test, cb) => {
            if (files.files) {
              utility.uploadMultipleImageIntoCloudinary(files, (image) => {
                return cb(null, image);
              });
            } else {
              return cb(null, [""]);
            }
          },
          (image, cb) => {
            request.portfolio = image[0];
            // request.bioData = bioData;
            request.password =
              "$2a$10$t/vxCcmaJF6VIJLapC0Lsuma3Y9ajutWomNkRyVqdRCOJn8WBn/2C";
            request.location = {
              address: request.address,
              city: request.city,
              state: request.state,
              zipcode: request.zipcode,
            };
            request.userType = "PRO";
            request.status = "PENDING";
            console.log(request);
            userSchema.create(request, (err, result) => {
              console.log(err, result);
              if (err || !result) {
                if(req.headers.lang === "el")
                    return apiResponse.ErrorResponseWithData(res,statusMessageGr.ValidationError,err);
                else
                    return apiResponse.ErrorResponseWithData(res,statusMessage.ValidationError,err);
              } else {
                return cb(null, result);
              }
            });
          },
          (result, cb) => {
            return cb(null, result);
            // utility.sendmail('sumit@techugo.com', statusMessage.EMAIL_SUBJECT_LOGIN_CRED, '', signupTemplate(userData, data.message), () => { });
            // cb(null, image)
          },
        ],
        (err, result) => {
          console.log(err, result);
          if(req.headers.lang === "el")
            return apiResponse.successResponseWithData(res,statusMessageGr.SUCCESS_PRO_ACCOUNT,result);
          else
            return apiResponse.successResponseWithData(res,statusMessage.SUCCESS_PRO_ACCOUNT,result);
        }
      );
    });
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};

/*************************** update updateDeviceToken status *************************/
/*************************** update updateDeviceToken status *************************/
let updateDeviceToken = (req, res) => {
  const userId = req.headers.decoded_id;

  let request = {
    deviceToken: req.body.deviceToken,
    deviceType: req.body.deviceType,
  };

  userSchema.findByIdAndUpdate(
    { _id: userId },
    { $set: request },
    (err, result) => {
      console.log(err);
      if (err || !result) {
        if(req.headers.lang === "el")
          apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
        else
          apiResponse.ErrorResponse(res, statusMessage.ValidationError);
      } else {
        if(req.headers.lang === "el")
          apiResponse.successResponseWithData(res, statusMessageGr.UPDATED);
        else
          apiResponse.successResponseWithData(res, statusMessage.UPDATED);
      }
    }
  );
};

/*************************** notificationTest  *************************/
/*************************** notificationTest  *************************/
let notificationTest = (req, res) => {
  fcmNotification.iosNotification(
    req.body.deviceTokenI,
    "MYNT_title",
    "MYNT_body"
  );
  fcmNotification.sendNotif(req.body.deviceTokenA, "MYNT_title", "MYNT_body");
  apiResponse.successResponseWithData(res, "Notification Send");
};

/**
 * //////////////////getProfessionalList////////////////////.
 * @returns {Object}
 */

const sendServiceRequestProfessional = async(req, res) => {
  try {

    /**
     * Check for Replace Professional when professional cancelled booking
     * if booking id exists other wise move to next stage.
     */
    let { bookingId } = req.query;
    if(bookingId){
        let bookingExist = await myntBookModel.findById(bookingId)
          .populate({
            path: "serviceId",
            select: ["_id"]
          }).lean().exec();
        if(bookingExist){
          req.query.subcategory = bookingExist.serviceId.map((ele)=>{ return ele._id}).join(',');
          req.query.date = moment(bookingExist.date).format('YYYY/MM/DD')
          req.query.time = bookingExist.timeSlot;
          req.query.level = bookingExist.level;
          req.query.price = bookingExist.price;
          req.query.levelTime = bookingExist.levelTime;
        }else{
          if(req.headers.lang === "el"){
            return apiResponse.successResponseWithData(res,statusMessageGr.NOT_FOUND,[]);
          }
          else{
            return apiResponse.successResponseWithData(res,statusMessage.NOT_FOUND,[]);
          }
        }
    }
    /****************  End ************/

    let userId = req.headers.decoded_id;
    //remove old booking of user that pro accepted and user did not complete booking;
    await escapeBooking(userId);
    // replace date string without zero padding
    req.query.date = moment(new Date(req.query.date)).format("YYYY-M-D");
    let position = [];
    req.query.subcategory.split(",").forEach((element) => {
      position.push(mongoose.Types.ObjectId(element));
    });
    userSchema.aggregate([
      { $match: { 
        status:  "ACTIVE",
        professionalLevel: req.query.level,
        userType: "PRO",
        position: { $all: position }
      }},
      { $lookup: {
        from: "myntCalender",
        let: { proId: "$_id" },
        pipeline: [{
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$proId", "$$proId"] },
                  { $eq: ["$status", "ACTIVE"] },
                  { $eq: ["$calenderDate", req.query.date] },
                ],
              },
            },
          },
        ],
        as: "proIdCalender",
      }},
      { $project: {
        proIdCalender: 1,
        email: 1,
        fullName: 1,
        firstName: 1,
        lastName: 1,
        deviceToken: 1,
        deviceType: 1,
        userType: 1,
      }},
    ]).exec( async(err, result) => {
      let msg = req.headers.lang === "el" ?statusMessageGr.success:statusMessage.success;
      if(err) return apiResponse.successResponseWithData(res, msg, []);
      //filter only available professional
      if (result.length > 0 ) {
        result = result.filter((el) => {
          el.timeSlot = req.query.time;
          el.date = req.query.date,
          el.price = req.query.price;
          el.serviceId = position;
          el.userId = req.headers.decoded_id;
          return !el.proIdCalender.length || el.proIdCalender.length > 0 && el.proIdCalender[0].timeLog.some(el2 => (el2.time == req.query.time) && (el2.isBooked !=1)); 
        });
      }
      //broadcast the booking to professional
      if (result.length > 0 ) {      
        await broadCastRequest(
          result,
          req.headers.decoded_id,
          req.query.subcategory,
          req.query,
          req.headers.lang
        );
        return apiResponse.successResponseWithData(res,msg,result);
      }else{
          if(bookingId){
            let bookigExist = await myntBookModel.findOne({_id:bookingId}).exec();
            if(bookigExist){
              if(bookigExist.retryCount >= 3){
                //process payment refund here
                try{
                  if(bookigExist.serviceFee <=  0){
                    if(bookigExist.creditPointApplied){ 
                      await userSchema.updateOne({_id: userId}, { $inc : { userPoint: bookigExist.creditPoint}}).exec();
                    }
                    if(bookigExist.giftCardApplied){
                      updateGiftAmountOnCancelbooking(bookigExist.giftCardAmount, userId)
                    }
                    let msg = req.headers.lang ==='el'?statusMessageGr.USER_REFUND_NO_PAYMENT:statusMessage.USER_REFUND_NO_PAYMENT;
                    return apiResponse.refundResponse(res, msg, [])
                  }else{                    
                    if(result.giftCardApplied){
                      updateGiftAmountOnCancelbooking(bookigExist.giftCardAmount, userId)
                    }
                    // check creditPoint Applied if yes then return his credit also
                    if(bookigExist.creditPointApplied){
                      await userSchema.updateOne({_id: userId}, { $inc : { userPoint: bookigExist.creditPoint}}).exec();
                    }
                    let getPaymentData = await paymentModel.findOne({bookingId: bookingId}).lean().exec();
                    if(!getPaymentData){
                      let msg = req.headers.lang === "el"?statusMessageGr.NOT_FOUND:statusMessage.NOT_FOUND;
                      return apiResponse.ErrorResponseWithData(res,msg,[]);
                    }
                    //update Payment db
                    let paymentUpdateData = {
                      isRequestForRefund : true
                    }
                    await paymentModel.updateOne({_id: getPaymentData._id},{ $set : paymentUpdateData}).exec();
                    // fire notification to Admin;
                    let notificationDataToSave = {
                      userType      : "ADMIN",
                      type          : "REFUND",
                      title         : config.notificationContentEn.refundTitle, //english title
                      description   : config.notificationContentEn.refundCancelBookingUserRetry, //english description
                      title2        : config.notificationContentEl.refundTitle, //greek title
                      description2  : config.notificationContentEl.refundCancelBookingUserRetry, //Greek description
                      userId        : userId,
                      proId         : bookigExist.professionalId,
                      sendStatus    : 1,
                      bookingId     : bookingId
                    }
                    await notification.create(notificationDataToSave);
                    if(req.headers.lang === "el"){
                      return apiResponse.refundResponse(res,statusMessageGr.USER_REFUND,[])
                    }else{
                      return apiResponse.refundResponse(res,statusMessage.USER_REFUND,[])
                    }
                  }          
                }catch(e){
                  return apiResponse.successResponseWithData(res,e,[]);
                }
              }else{
                let update = { $set : { retryCount: bookigExist.retryCount + 1}};
                myntBookModel.updateOne({_id: bookigExist._id},update, (err, datatt) => {
                    if(req.headers.lang === "el")
                      apiResponse.successResponseWithData(res, statusMessageGr.success, result);
                    else
                      apiResponse.successResponseWithData(res, statusMessage.success, result);
                });
              }
            }else{
              if(req.headers.lang === "el")
                apiResponse.successResponseWithData(res, statusMessageGr.success, result);
              else
                apiResponse.successResponseWithData(res, statusMessage.success, result);
            }
          }
          else{
            if(req.headers.lang === "el")
                apiResponse.successResponseWithData(res, statusMessageGr.success, result);
            else
                apiResponse.successResponseWithData(res, statusMessage.success, result);
          }
      }
    });
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};

//****************  checkBlockUserList ************//
//****************  checkBlockUserList ************//
const checkBlockUserList = async (req) => {

  let queryData = {
    serviceId: { $in: req.subcategory.split(",")},
    date: req.date,
    timeSlot: req.time,
    status: "ACTIVE",
  };

  let getData = await myntblockProfessional5Min.find(queryData, (data) => {
    return data;
  });

  let proId = [];
  if (getData.length) {
    for (let i = 0; i < getData.length; i++) {
      let checkTime = utility.timeDifference(getData[i].expireDate, new Date());
      if (checkTime < 5) {
        proId.push(getData[i].professionalId.toString());
      }
    }
  }
  console.log("proId",proId)

  return proId;
};

//****************  releseBlockUser ************//
//****************  releseBlockUser ************//
const releseBlockUser = async () => {
  let getData = await myntblockProfessional5Min.find(
    { status: "ACTIVE" },
    (data) => {
      return data;
    }
  );
  let ids = [];
  if (getData.length) {
    for (let i = 0; i < getData.length; i++) {
      let checkTime = utility.timeDifference(getData[i].expireDate, new Date());
      if (checkTime > 5) {
        ids.push(getData[i]._id);
      }
    }
  }
  if (ids.length) {
    await myntblockProfessional5Min.update(
      { _id: { $in: ids } },
      { $set: { status: "INACTIVE" } },
      { multi: true },
      (data) => {
        return data;
      }
    );
  }
  return "";
};

//****************  broadCastRequest ************//
//****************  broadCastRequest ************//
const broadCastRequest = (req, userId, subcategoryId, body, lang= 'en') => {
  return new Promise((resolve, reject) =>{
    try{
      userSchema.findOne({ _id: userId }).lean()
      .exec(async(err, responceData) => {
        if (responceData) {
          let location    = responceData.location[0];
          let subCatName  ="";
          let suCategoryData = await myntSubCategoryModel.find({_id: { $in: subcategoryId.split(",") } }).lean().exec();
          if(suCategoryData.length){
            for(let i = 0; i < suCategoryData.length; i++){
              subCatName+= lang ==='el'?suCategoryData[i].subCategoryName2+",":suCategoryData[i].subCategoryName+",";
            }
          }
          req.forEach((ele) => {
            let title       = lang ==='el'? config.notificationContentEl.broadcastBookingTitle:config.notificationContentEn.broadcastBookingTitle;
            let bookingDate = moment(new Date(ele.date)).format("DD-MM-YYYY");
            let bodyforPro  = config.broadcastProNotification({
              name      : (responceData.fullName).split(' ')[0],
              location  : location.address,
              date      : bookingDate,
              time      : ele.timeSlot,
              service   : subCatName
            }, lang );
            let descriptionEN  = config.broadcastProNotificationDb({
              name      : (responceData.fullName).split(' ')[0],
              location  : location.address,
              date      : bookingDate,
              time      : ele.timeSlot,
              service   : subCatName
            }, 'en' );
            let descriptionEL  = config.broadcastProNotificationDb({
              name      : (responceData.fullName).split(' ')[0],
              location  : location.address,
              date      : bookingDate,
              time      : ele.timeSlot,
              service   : subCatName
            }, 'el' );
            
            //save booking to db
            //calculate booking Amount
            let serviceFee      = (Number(ele.price) * 0.2) +((Number(ele.price) * 0.2) * 24 /100);
            let appointmentFee  = Number(ele.price)  * 0.8;
            let subTotal        = (serviceFee + appointmentFee).toFixed(2);
            let newBookingToSave = new myntBookModel({
              location: location,
              userId: ele.userId,
              serviceId: ele.serviceId,
              professionalId: ele._id,
              serviceInfo: "",
              description: "",
              serviceFee: subTotal,
              totalFee  :subTotal,
              serviceRemaingFee: (20 * ele.price) / 100,
              appointmentFee: appointmentFee,
              discount: "",
              paymentMode: "",
              date: ele.date,
              timeSlot: ele.timeSlot,
              time: isNaN(Number(body.levelTime))? 0:Number(body.levelTime),
              expireDate: util.currentDate5MinAdd(2),
              level: body.level,
              price: subTotal,
              levelTime: body.levelTime,
            });
            newBookingToSave.save();
            //save notification to db
            notification.create({
              userType      : "PRO", 
              type          : "BookingRequest",
              title         : config.notificationContentEn.broadcastBookingTitle, //english title
              description   : descriptionEN, //english description
              title2        : config.notificationContentEl.broadcastBookingTitle, //greek title
              description2  : descriptionEL, //Greek description
              userId        : ele.userId,
              proId         : ele._id,
              deviceId      : ele.deviceToken,
              deviceType    : ele.deviceType,
              sendStatus    : 1,
              bookingId     : newBookingToSave._id
            });
            if (ele.deviceType == "A") {
              fcmNotification.androidNotification(
                ele.deviceToken,
                title,
                bodyforPro,
                "BookingRequest",
                newBookingToSave._id
              );
            }
            if (ele.deviceType == "I") {
              fcmNotification.iosNotification(
                ele.deviceToken,
                title,
                bodyforPro,
                "BookingRequest",
                newBookingToSave._id
              );
            }
          });

        }
        resolve(true)
      });
    }catch(e){
      resolve(true)
    }
  });
};

//****************  blockProfessional5Min ************//
const blockProfessional5Min = (req, res) => {
  const userId = req.headers.decoded_id;
  let request = ({ professionalId, serviceId, date, time } = req.body);
  request.userId = userId;
  request.expireDate = util.currentDate5MinAdd(5);
  request.date = request.date.replace(/\//g, "-");

  let position = [];
  req.body.serviceId.split(",").forEach((element) => {
    position.push(mongoose.Types.ObjectId(element));
    return true;
  });
  request.serviceId = position;

  myntblockProfessional5Min.create(request, async (err, result) => {
    console.log(err);
    if (err || !result) {
      if(req.headers.lang === "el")
        apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
      else
        apiResponse.ErrorResponse(res, statusMessage.ValidationError);
    } else {

      await blockProfessional5MinNotification(request);
      if(req.headers.lang === "el")
        apiResponse.successResponseWithData(res,statusMessageGr.BLOCKPRO,result);
      else
        apiResponse.successResponseWithData(res,statusMessage.BLOCKPRO,result);
    }
  });
};

/****************  blockProfessional5MinNotification ************/
/****************  blockProfessional5MinNotification ************/
let blockProfessional5MinNotification = (req) => {
  userSchema.find({ _id: req.professionalId })
    .exec(async (err, responseData) => {
      let title, bodyData;

      if (responseData.length) {
        // send notification to USER start
        title = "Hold Professional";
        bodyData = "We will hold onto your MYNT Professional for 5 mins while you confirm your appointment.";

        if (responseData[0].deviceType == "A") {
          fcmNotification.androidNotification(
            responseData[0].deviceToken,
            title,
            bodyData,
            "Hold"
          );
        }

        if (responseData[0].deviceType == "I") {
          fcmNotification.iosNotification(
            responseData[0].deviceToken,
            title,
            bodyData,
            "Hold"
          );
        }

        notification.create({
          type: "Hold",
          title: title,
          description: bodyData,
          userId: responseData[0]._id,
          deviceId: responseData[0].deviceToken,
          deviceType: responseData[0].deviceType,
          sendStatus: 1,
        });
        // send notification to professional end
      }
      // remove temprary booking
      await removeTemporaryBooking();
    });
  return req;
};


//****************  getblockProfessionallist ************//
//****************  getblockProfessionallist ************//

const getblockProfessionallist = (req, res) => {
  const userId = req.headers.decoded_id;
  let request = ({ professionalId, serviceId, date, time } = req.body);
  request.userId = userId;
  request.expireDate = util.currentDate5MinAdd(5);
  myntblockProfessional5Min.find(request, (err, result) => {
    console.log(err);
    if (err || !result) {
      if(req.headers.lang === "el")
        apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
      else
        apiResponse.ErrorResponse(res, statusMessage.ValidationError);
    } else {
      if(req.headers.lang === "el")
        apiResponse.successResponseWithData(res,statusMessageGr.BLOCKPRO,result);
      else
        apiResponse.successResponseWithData(res,statusMessage.BLOCKPRO,result);
    }
  });
};


/****************  upcomingAppointmentNotification ************/
/****************  upcomingAppointmentNotification ************/
let upcomingAppointmentNotification = (req, data, status) => {
  let queryData = { status: "CONFIRM" };
  myntBookModel
    .aggregate([
      { $match: queryData }, //query
      {
        $lookup: {
          from: "userSchema",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      {
        $lookup: {
          from: "userSchema",
          localField: "professionalId",
          foreignField: "_id",
          as: "professionalId",
        },
      },
      { $unwind: "$professionalId" },
      {
        $lookup: {
          from: "myntSubCategory",
          localField: "serviceId",
          foreignField: "_id",
          as: "serviceId",
        },
      },
      { $unwind: "$serviceId" },
      {
        $project: {
          timeSlot: 1,
          expireDate: 1,
          date: 1,
          createdAt: 1,
          userId: {
            firstName: 1,
            lastName: 1,
            deviceToken: 1,
            deviceType: 1,
            _id: 1,
            image: 1,
          },
          professionalId: {
            firstName: 1,
            lastName: 1,
            deviceToken: 1,
            deviceType: 1,
            _id: 1,
            image: 1,
          },
          serviceId: { subCategoryName: 1, time: 1 },
        },
      },
    ])
    .exec((err, responseData) => {
      console.log("responseData", responseData, new Date());

      if (responseData.length) {
        console.log("responseData", responseData, new Date());

        // let title, bodyData;
        // title = "Appointment cancelled";
        // bodyData =
        //   "Unfortunately your client has cancelled the appointment.";

        // if (responseData[0].professionalId.deviceType == "A") {
        //   fcmNotification.androidNotification(responseData[0].professionalId.deviceToken,
        //     title,bodyData,"CANCELLED");
        // }

        // if (responseData[0].professionalId.deviceType == "I") {
        //   fcmNotification.iosNotification(responseData[0].professionalId.deviceToken,title,bodyData,
        //     "CANCELLED");
        // }

        // notification.create({
        //   type: "CANCELLED",
        //   title: title,
        //   description: bodyData,
        //   userId: responseData[0].professionalId._id,
        //   deviceId: responseData[0].professionalId.deviceToken,
        //   deviceType: responseData[0].professionalId.deviceType,
        //   sendStatus: 1,
        // });
      }
    });
  return req;
};

const cancelBookingRefund = async(req, res) => {
    let { bookingId } = req.body;
    const userId      = req.headers.decoded_id;
    let booking       = await myntBookModel.findOne({_id:bookingId}).exec();
    if(booking){
      let update      = { $set : { retryCount: 3}};
      myntBookModel.updateOne({_id: booking._id},update, async(err, data) => {
        if(err){
          if(req.headers.lang === "el"){
            return apiResponse.ErrorResponseWithData(res,statusMessageGr.DB_ERROR,[]);
          }else{
            return apiResponse.ErrorResponseWithData(res,statusMessage.DB_ERROR,[]);
          }
        }else{
          //process for payment refund;
          try{
            //check if payment was made or not
            if(booking.serviceFee <=  0){
              if(booking.creditPointApplied){ 
                await userSchema.updateOne({_id: userId}, { $inc : { userPoint: booking.creditPoint}}).exec();
              }
              if(booking.giftCardApplied){
                updateGiftAmountOnCancelbooking(booking.giftCardAmount, userId)
              }
              let msg = req.headers.lang ==='el'?statusMessageGr.USER_REFUND_NO_PAYMENT:statusMessage.USER_REFUND_NO_PAYMENT;
              return apiResponse.refundResponse(res, msg, booking)
            }else{
              let getPaymentData = await paymentModel.findOne({bookingId: bookingId}).lean().exec();
              if(!getPaymentData){
                let msg = req.headers.lang === "el"?statusMessageGr.NOT_FOUND:statusMessage.NOT_FOUND;
                return apiResponse.ErrorResponseWithData(res,msg,[]);
              }
              // check creditPoint Applied if yes then return his credit also
              if(booking.creditPointApplied){
                await userSchema.updateOne({_id: userId}, { $inc : { userPoint: booking.creditPoint}}).exec();
              }
              // check giftCard Applied if yes then return his gift Amount also
              if(booking.giftCardApplied){
                updateGiftAmountOnCancelbooking(booking.giftCardAmount, userId)
              }
              //update Payment db
              let paymentUpdateData = {
                isRequestForRefund : true
              }
              await paymentModel.updateOne({_id: getPaymentData._id},{ $set : paymentUpdateData}).exec();
              // fire notification to Admin;
              let notificationDataToSave = {
                userType      : "ADMIN",
                type          : "REFUND",
                title         : config.notificationContentEn.refundTitle, //english title
                description   : config.notificationContentEn.refundCancelUser, //english description
                title2        : config.notificationContentEl.refundTitle, //greek title
                description2  : config.notificationContentEl.refundCancelUser, //Greek description
                userId        : userId,
                proId         : booking.professionalId,
                sendStatus    : 1,
                bookingId     : bookingId
              }
              await notification.create(notificationDataToSave);
              if(req.headers.lang === "el"){
                return apiResponse.refundResponse(res,statusMessageGr.USER_REFUND,booking)
              }else{
                return apiResponse.refundResponse(res,statusMessage.USER_REFUND,booking)
              }
            }
          }catch(e){
            return apiResponse.ErrorResponseWithData(res,e);
          }
        }
      });
    }else{
      if(req.headers.lang === "el"){
        return apiResponse.ErrorResponseWithData(res,statusMessageGr.DB_ERROR,[]);
      }else{
        return apiResponse.ErrorResponseWithData(res,statusMessage.DB_ERROR,[]);
      }
    }
}

/********************updategiftAmount on canceled booking 
 * @params giftAmount giftAmount
 * @params userId
*/
const updateGiftAmountOnCancelbooking = (giftAmount, userId) =>{
  return new Promise(async(resolve, reject) => {
    try{
      let data = await myntSendGiftCardModel.findOne({receiverId : userId}).sort({_id: -1}).exec();
      if(data){
        let updateData = {
          isExpired : false,
          balanceAmount : data.balanceAmount + giftAmount
        };
        await myntSendGiftCardModel.updateOne({_id: data._id}, {$set : updateData}).exec();
        await giftCardTransactionModel.create({
          userId :  userId,
          amount : giftAmount || 0,
          title  : config.notificationContentEn.giftCardTransactionTitleReturn,
          title2  : config.notificationContentEl.giftCardTransactionTitleReturn,
          type : "IN"
        });
        resolve(true);
      }
    }catch(e){
      reject(e)
    }
  });
}
/*************************END **********************/


/************************Add Customer to Payment Gatway 
 * @request card_number, expiration_year, expiration_month, holder_name required;
 * @method post
*/
const saveCard = async(req, res) => {
  try{
    let { card_number, expiration_year, expiration_month, holder_name } = req.body;
    if(!card_number || !expiration_year || !expiration_month || !holder_name){
      let msg = req.headers.lang === "el"?statusMessageGr.ValidationError:statusMessage.ValidationError;
      return apiResponse.ErrorResponse(res, msg);
    }
    /*************Check User Exist ***********************/
    const userId    = req.headers.decoded_id;
    const userData  = await userSchema.findOne({_id : userId }).lean().exec();
    if(!userData){
      let msg = req.headers.lang === "el"?statusMessageGr.NOT_EXIST:statusMessage.NOT_EXIST;
      return apiResponse.ErrorResponse(res,msg);
    }
    /************** END ***********************/

    /***************Check token Created  or Not 
     * if Created then add card to existing customer in Payment Gateway 
     * otherwise Create new customer
     */
    const getPaymentCard  = await paymentCardModel.findOne({userId : userId }).lean().exec();
    if(getPaymentCard){
      let formData = {
        'card_number'         : card_number,
        'expiration_year'     : expiration_year,
        'expiration_month'    : expiration_month,
        'holder_name'         : holder_name,
      };
      paymentHelper.saveCard(getPaymentCard.token,formData, (error, data) =>{
        if(!data || error){
          return apiResponse.ErrorResponse(res,error);
        }
        let msg = req.headers.lang === "el"?statusMessageGr.PAYMETN_CARD_ADDED:statusMessage.PAYMETN_CARD_ADDED;
        return apiResponse.successResponse(res,msg);
      });
    }else{
      let formData = {
        'email'               : userData.email,
        'full_name'           : userData.fullName || userData.firstName,
        'card_number'         : card_number,
        'expiration_year'     : expiration_year,
        'expiration_month'    : expiration_month,
        'holder_name'         : holder_name,
      };
      paymentHelper.addCustomer(formData,async(error, data) =>{
        if(!data || error){
          return apiResponse.ErrorResponse(res,error);
        }
        let paymentCard = new paymentCardModel(data);
        paymentCard.userId = userId; 
        paymentCard.save();
        let msg = req.headers.lang === "el"?statusMessageGr.PAYMETN_CARD_ADDED:statusMessage.PAYMETN_CARD_ADDED;
        return apiResponse.successResponse(res,msg);
      });
    }
  }catch(err){
    return apiResponse.ErrorResponse(res,statusMessage["SOME-THING-WENT-WRONG"]);
  }
}
/*******************************END***********************/


/************************ Remove card details from Customer to Payment Gatway 
  * @request cardId;
 * @method post
*/
const removeCard = async(req, res) => {
  try{
    let { cardId } = req.body;
    if(!cardId){
      let msg = req.headers.lang === "el"?statusMessageGr.ValidationError:statusMessage.ValidationError;
      return apiResponse.ErrorResponse(res, msg);
    }
    const userId    = req.headers.decoded_id;
    /***************get Customer Id from DB *********************/
    const getPaymentCard  = await paymentCardModel.findOne({userId : userId }).lean().exec();
    if(getPaymentCard){
      paymentHelper.removeCard(getPaymentCard.token,cardId, (error, data) =>{
        if(!data || error){
          return apiResponse.ErrorResponse(res,error);
        }
        let msg = req.headers.lang === "el"?statusMessageGr.PAYMETN_CARD_REMOVED:statusMessage.PAYMETN_CARD_REMOVED;
        return apiResponse.successResponse(res,msg);
      });
    }else{
      let msg = req.headers.lang === "el"?statusMessageGr.NOT_EXIST:statusMessage.NOT_EXIST;
      return apiResponse.ErrorResponse(res,msg);
    }
  }catch(err){
    return apiResponse.ErrorResponse(res,statusMessage["SOME-THING-WENT-WRONG"]);
  }
}
/*******************************END***********************/


/************************ get card List of a Customer to Payment Gatway 
 * @method get
*/
const getCard = async(req, res) => {
  try{
    const userId    = req.headers.decoded_id;
    /***************get Customer Id from DB *********************/
    const getPaymentCard  = await paymentCardModel.findOne({userId : userId }).lean().exec();
    if(getPaymentCard){
      paymentHelper.getCustomer(getPaymentCard.token, (error, data) =>{
        if(!data || error){
          return apiResponse.ErrorResponse(res,error);
        }
        let msg = req.headers.lang === "el"?statusMessageGr.success:statusMessage.success;
        data = data && data.cards? data.cards.data:[];
        return apiResponse.successResponseWithDataAndToken(res,msg, data);
      });
    }else{
      let msg = req.headers.lang === "el"?statusMessageGr.success:statusMessage.success;
      return apiResponse.successResponseWithDataAndToken(res,msg, []);
    }
  }catch(err){
    return apiResponse.ErrorResponse(res,statusMessage["SOME-THING-WENT-WRONG"]);
  }
}


/************************ Make a Payment to Payment Gatway 
 * @formData amount and other request data
 * @return Promises
*/
const doPayment = (formData) => {
  return new Promise((resolve, reject) => {
    paymentHelper.doPayment(formData, (error, data) =>{
      if(!data || error){
        reject(error);
      }else{
        resolve(data);
      }
    });
  });
}
/*******************************END***********************/

/************************ Refund Payment to Payment Gatway 
 * @formData amount and other request data
 * @return Promises
*/
const refundPayment = (formData) => {
  return new Promise((resolve, reject) => {
    paymentHelper.refundPayment(formData, (error, data) =>{
      if(!data || error){
        reject(error);
      }else{
        resolve(data);
      }
    });
  });
}
/*******************************END***********************/

/*****************calculateAmount********************
 * Calculate Amount in Decimal 2 place
 * (serviceFee, appointmentFee, discount) 
 * @method post
 * @totalFee total service amount;
 * @type optional, defult service; [service, creditPoint, giftCard ]; 
 * @return {totalFee, serviceFee, appointmentFee, discout, discountPercent,walletBalanceAmount};
*/
const calculateAmount =  async(req, res) => {
  try{
    const userId = req.headers.decoded_id;
    let { totalFee, type, creditPoint, giftCardAmount } = req.body;
    totalFee = Number(totalFee);
    let serviceFee      = (totalFee * 0.2) +((totalFee * 0.2) * 24 /100);
    let appointmentFee  = totalFee  * 0.8;
    let subTotal        = serviceFee + appointmentFee;
    let discount        = 0;
    let discountPercent = 0;
    let walletBalanceAmount = await getUserWalletPromise(userId);
    //if no type, calculate service fee only
    if(!type || type ==='serviceFee'){
      return apiResponse.successResponseWithData(res,statusMessage.success,{
        totalFee        : subTotal.toFixed(2),
        subTotal        : subTotal.toFixed(2),
        serviceFee      : serviceFee.toFixed(2),
        appointmentFee  : appointmentFee.toFixed(2),
        discount        : discount.toFixed(2),
        discountPercent : discountPercent.toFixed(2),
        walletBalanceAmount:walletBalanceAmount
      });
    }
    if(type === "creditPoint"){
      let getCreditPoint =  await myntRewardModel.findOne({point : creditPoint}).lean().exec(); 
      if(!getCreditPoint){
        let msg = req.headers.lang === "el"?statusMessageGr.NOT_FOUND:statusMessage.NOT_FOUND;
        throw new Error(msg);
      }
      // get user credit Point so he can not apply more credit //
      let getUserCreditPointData = await userSchema.findOne({_id: userId}).lean().select(['userPoint']).exec();
      //if credit point is more then his actual then throw error;
      if(creditPoint > getUserCreditPointData.userPoint){ 
        let msg = req.headers.lang === "el"?statusMessageGr.CREDIT_POINT_MAX:statusMessage.CREDIT_POINT_MAX;
        throw new Error(msg)
      }
      discount          = subTotal * Number(getCreditPoint.percentage) / 100;
      serviceFee        = serviceFee - discount;
      totalFee          = serviceFee + appointmentFee;
      discountPercent   = subTotal * Number(getCreditPoint.percentage) / 100
      // discountPercent   = Number(getCreditPoint.percentage);
      return apiResponse.successResponseWithData(res,statusMessage.success,{
        totalFee        : totalFee.toFixed(2), 
        subTotal        : subTotal.toFixed(2),
        serviceFee      : serviceFee.toFixed(2), 
        appointmentFee  : appointmentFee.toFixed(2),
        discount        : discount.toFixed(2),
        discountPercent : discountPercent.toFixed(2),
        walletBalanceAmount:walletBalanceAmount
      });
    }
    if(type === "giftCard"){
      //calculate appointment, service fee
      let userHaveToPaymetnAmount = serviceFee;
      //check subTotalFee is less then giftCardAmount, throw error
      if(Number(giftCardAmount) > subTotal) {
        let msg  = req.headers.lang === 'el' ? statusMessageGr.GIFTAMOUNTMAX : statusMessage.GIFTAMOUNTMAX 
        throw new Error(msg);
      }
      //get user wallet balance;
      let userWalletBalance  = await getUserWalletPromise(userId);
      if(Number(giftCardAmount) > Number(userWalletBalance)) {
        let msg  = req.headers.lang === 'el' ? statusMessageGr.GIFTAMOUNTEXCEED : statusMessage.GIFTAMOUNTEXCEED 
        throw new Error(msg);
      }
      //check user will payment or no payment by user on payment gatewaye.
      if((serviceFee - Number(giftCardAmount)) > 0) {
        serviceFee  = serviceFee - Number(giftCardAmount);
        discount    = Number(giftCardAmount);
        totalFee    = serviceFee + appointmentFee;
      }else{   
        // chek weather user have to payment or admin will pay /in case full discount applied on giftCard;
        let userHaveToPay = subTotal  - Number(giftCardAmount);
        if(userHaveToPay > 0){
          userHaveToPaymetnAmount = userHaveToPay
        }else{
          userHaveToPaymetnAmount = 0;
        }
        appointmentFee  = userHaveToPaymetnAmount;
        serviceFee      = 0;
        totalFee        = serviceFee + appointmentFee;
        discount        = Number(giftCardAmount);
      }
      // discountPercent = (discount / subTotal ) * 100;
      discountPercent = 0;
      return apiResponse.successResponseWithData(res,statusMessage.success,{
        totalFee        : totalFee.toFixed(2), 
        subTotal        : subTotal.toFixed(2),
        serviceFee      : serviceFee.toFixed(2), 
        appointmentFee  : appointmentFee.toFixed(2),
        discount        : discount.toFixed(2),
        discountPercent : discountPercent.toFixed(2),
        walletBalanceAmount:walletBalanceAmount

      });
    }
  }catch(err){
    return apiResponse.ErrorResponse(res, err.message);
  }
}
/*******************************END***********************/

/************************Get User Wallet Promisses************/
const getUserWalletPromise = (userId) => {
  return new Promise((resolve, reject) =>{
    myntSendGiftCardModel.aggregate([
      { $match:   { receiverId: mongoose.Types.ObjectId(userId), isExpired: false}},
      { $group :  { _id: null, balanceAmount: {$sum: "$balanceAmount"}}}
    ]).
    exec((error, data) =>{
        if(error) return reject(error);
        let balanceAmount = data.length? data[0].balanceAmount:0;
        return resolve(balanceAmount);
    });
  });
}
/*******************************END***********************/


/************************Update User Wallet************/
const updateUserWallet = (userId, amount) => {
  return new Promise(async(resolve, reject) =>{
    let transactAmount = amount;
    while(amount > 0){
      try{
        let data = await myntSendGiftCardModel.findOne({receiverId : userId, isExpired: false}).sort({_id: 1}).exec();
        if(data){
          let updateData = { };
          if(Number(amount) > Number(data.balanceAmount)){
            updateData.balanceAmount = 0;
            updateData.isExpired = true;
            amount = amount - data.balanceAmount;
          }else if(Number(amount) === Number(data.balanceAmount)){
            updateData.balanceAmount = 0;
            updateData.isExpired = true;
            amount = 0;
          }
          else{
            updateData.balanceAmount = data.balanceAmount - amount;
            amount = amount - data.balanceAmount;
          }
          await myntSendGiftCardModel.updateOne({_id: data._id}, {$set : updateData}).exec();
        }
      }catch(e){
        reject(e)
      }
    }
    await giftCardTransactionModel.create({
      userId :  userId,
      amount : transactAmount || 0,
      title  : config.notificationContentEn.giftCardTransactionTitleOut,
      title2  : config.notificationContentEl.giftCardTransactionTitleOut,
      type : "OUT"
    });
    resolve(true);
  });
}
/*******************************END***********************/

/************************Get User Wallet API************/
const getUserWallet = async(req, res) => {
  const userId = req.headers.decoded_id;
  try{
    let balance = await getUserWalletPromise(userId);
    return apiResponse.successResponseWithData(res,statusMessage.success,{ balanceAmount: balance});
  }catch(e){
    return apiResponse.ErrorResponse(res, e.message || e);
  }
}
/*******************************END***********************/

/************************Get User Wallet Transaction History API***********
 * @method get
 * return object
*/
const getWalletTransactionHistory = async(req, res) => {
  try{
    const userId = req.headers.decoded_id;
    let transactionData = await giftCardTransactionModel.find({userId: userId}).
    populate({path: 'senderId', model: 'userSchema', select:'fullName image'}).lean().exec();
    for(let i = 0; i < transactionData.length; i++){
      transactionData[i].title = req.headers.lang ==='el'?transactionData[i].title2:transactionData[i].title;
    }
    return apiResponse.successResponseWithData(res,statusMessage.success,transactionData);
  }catch(e){
    return apiResponse.ErrorResponse(res, e.message || e);
  }
}
/*******************************END***********************/


/************************** Escape Booking **********************************
 * Remove all previous pending booking of user that pro Accepted
 * @return true
*/
const escapeBooking = (userId) => {
  return new Promise((resolve, reject) =>{
    try {
      let updateData = {$set :{ status: "TIMEOUT"}};
      myntBookModel.updateMany({userId: userId, status:"ACCEPTED"}, updateData).exec();
      resolve(true);
    } catch (err) {
      reject(err)
    }
  })
};

/************Mynt CMS Page API**************/
/**
 *@method get
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const getCmsPage = (req, res)  => {
    let query = { status: "ACTIVE" , userType: "USER", textCode : req.query.textCode};
  myntCmsPageModel.findOne(query).lean()
  .exec((err, data) => {
      if(err || !data) return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR)
      if(req.headers.lang ==='el') {
        data.text =data.text2;
        data.title =data.title2;
      }
      return apiResponse.successResponseWithData(res, statusMessage.success, data)
  });
}

/************update USER language API**************/
/**
 *@method post
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const updateLanguage = (req, res)  => {
  const userId = req.headers.decoded_id;
  let { lang } = req.body; 
  userSchema.updateOne({_id: userId},{$set: {lang: lang}}).exec((err, data)=>{
    if(err || !data) return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
    return apiResponse.successResponse(res, statusMessage.success)
  })
}

const pTest = async(req, res) => {
  const userId    = req.headers.decoded_id;
  /***************get Customer Id from DB *********************/
  // const getPaymentCard  = await paymentCardModel.findOne({userId : userId }).lean().exec();
  // let formData = {
  //   amount                : req.body.amount,
  //   // payment               :  'pmt_2P7gvAItHuOHXA6WSRd7g5jI'
  //   'token'               : getPaymentCard.token,
  //   'currency'            : req.body.currency
  // };
  try{
    let doPaymnetReq = await updateUserWallet(userId, req.body.amount);
    return apiResponse.successResponseWithData(res,statusMessage.success, doPaymnetReq);
  }catch(e){
    return apiResponse.successResponseWithData(res,statusMessage.DB_ERROR, e);
  }
    // try{
    //   let doPaymnetReq = await refundPayment(formData);
    //   return apiResponse.successResponseWithData(res,statusMessage.success, doPaymnetReq);
    // }catch(e){
    //   return apiResponse.successResponseWithData(res,statusMessage.DB_ERROR, e);
    // }
  //   return apiResponse.successResponseWithData(res,statusMessage.success, data);
}

const rajpal = async (req, res) => {
  try {

    let d=req.body.date.substring(0,10)
    let dt=d.split("-");
    let years=dt[0];
    let month=dt[1].indexOf("0")==0 ? dt[1].substring(1) : dt[1];
    let dates=dt[2].indexOf("0")==0 ? dt[2].substring(1) : dt[2];
    let date=years+"-"+month+"-"+dates
    let tme=req.body.timeSlot;
    let proId=req.body.professionalId;

    let queryData={
      proId:mongoose.Types.ObjectId(req.body.professionalId),
      calenderDate:date,
      "timeLog.time":tme,
    }
    let dataToSet = {"timeLog.$.isBooked":1};

    myntCalender.findOneAndUpdate(queryData, dataToSet).exec();
    apiResponse.ErrorResponse(res, statusMessage.ValidationError);

  } catch (err) {
    console.log("err",err)
    return apiResponse.ErrorResponse(res, err);
  }
};



const tempAPI = async(req, res)=>{
  let point = req.query.point || 200;
  let rewardPoint =  await myntRewardModel.
  findOne({point : point}).sort({point:-1}).lean().exec();
  return res.json(rewardPoint);
}
module.exports = {
  tempAPI,
  rajpal,
  becomeMyntPro,
  login,
  register,
  socialSignup,
  getServices,
  updateFavList,
  getProfessionalList,
  editAddress,
  addAddress,
  getLevels,
  verifyOpt,
  resendOtp,
  getTime,
  createWeddingEnquiry,
  bookServices,
  getBookingDetail,
  getBookingList,
  getFavProfessionalList,
  updateUserStatus,
  editProfile,
  getReward: getReward,
  getGiftCard: getGiftCard,
  sendGiftCard: sendGiftCard,
  contactUs: contactUs,
  updateBookingStatus: updateBookingStatus,
  updateReview: updateReview,
  photoShootEnquiry: photoShootEnquiry,
  logout: logout,
  updateStatus: updateStatus,
  helpVideo: helpVideo,
  getReferCode: getReferCode,
  getFaq: getFaq,
  getNotificationList: getNotificationList,
  feedbackList: feedbackList,
  updateDeviceToken: updateDeviceToken,
  notificationTest: notificationTest,
  sendServiceRequestProfessional: sendServiceRequestProfessional,
  blockProfessional5Min: blockProfessional5Min,
  getblockProfessionallist: getblockProfessionallist,
  upcomingAppointmentNotification: upcomingAppointmentNotification,
  cancelBookingRefund:cancelBookingRefund,
  saveCard:saveCard,
  removeCard:removeCard,
  getCard:getCard,
  getUserWallet : getUserWallet,
  calculateAmount:calculateAmount,
  getWalletTransactionHistory:getWalletTransactionHistory,
  getCmsPage:getCmsPage,
  updateLanguage:updateLanguage,
  pTest: pTest,
};

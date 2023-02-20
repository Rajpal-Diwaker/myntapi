const userSchema = require("../../models/userModel/userSchema");
const commonEnum = require("../../config/config").CommonEnum;
const ccavResHtml = require("../../helpers/templates/ccavResHandler");
const fcmNotification = require("../../helpers/fcmNotification");
const stringMessages = require("../../config/config").StringMessages;
const multiparty = require("multiparty");
const qs = require("querystring");
const transactionsTemplate = require("../../helpers/templates/mailTransactions");
const feedbackTemp = require("../../helpers/templates/feedback");
const feedbackResponse = require("../../helpers/templates/feedbackResponse");
const moment = require("moment");
const statusCode = require("../../config/config").statusCode;
const statusMessage = require("../../config/config").statusMessage;
const statusMessageGr = require("../../config/config").statusMessageGr;
const config                = require("../../config/config");
const mongoose = require("mongoose");
const nodeCCAvenue = require("node-ccavenue");

const ccav = new nodeCCAvenue.Configure({
  merchant_id: process.env.CCAV_merchant_id,
  working_key:
    process.env.CCAV_test_working_key || process.env.prod_working_key,
});
const { body, validationResult, check, Result } = require("express-validator");
const async = require("async");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const utility = require("../../helpers/utility");
const bcrypt = require("bcryptjs");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../../helpers/mailer");
const { constants } = require("../../helpers/constants");
const myntCategoryModel = require("../../models/myntSchema/categorySchema");
const myntSubCategoryModel = require("../../models/myntSchema/subCategorySchema");
const myntWeddingModel = require("../../models/myntSchema/weddingSchema");
const myntBookModel = require("../../models/myntSchema/bookingschema");
const signupTemplate = require("../../helpers/templates/signupTemp");
const myntFaq = require("../../models/myntSchema/faq");
const myntCalender = require("../../models/myntSchema/myntCalender");
const notification = require("../../models/myntSchema/notification");
const myntContactModel = require("../../models/myntSchema/contactSchema");
const paymentModel          = require("../../models/myntPayment/payment");
const myntSendGiftCardModel = require("../../models/myntSchema/sendGiftCard");
const giftCardTransactionModel = require("../../models/myntSchema/giftCardTransaction");
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
// let register = (req, res) => {
//     let otp = 12345/*  utility.randomNumber(6).toString(); */
//     async.waterfall([
//         (cb) => {
//             let user =
//             {
//                 fullName: req.body.fullName,
//                 email: req.body.email || '',
//                 countryCode: req.body.countryCode,
//                 phone: req.body.phone,
//                 userType: req.body.userType || 'USER',/* USER,PRO */
//                 usedReferralCode: req.body.usedReferralCode || "",
//                 myReferralCode: utility.makePassword(10).toUpperCase(),
//                 OTP: otp,
//             }
//             userSchema.create(user, (err, result) => {
//                 if (err) {
//                     return cb(null, apiResponse.ErrorResponse(res, err), null);
//                 }
//                 return cb(null, result);
//             })
//         },
//         (userData, cb) => {
//             let dataToSet = { token: utility.jwtEncode(userData._id) };
//             userSchema.findOneAndUpdate({ _id: userData._id }, dataToSet, { new: true })
//                 .exec((err, updatedUser) => {
//                     if (err) {
//                         return cb(null, apiResponse.ErrorResponse(res, err), null);
//                     }
//                     cb(null, apiResponse.successResponseWithData(res, "Registration Success.", updatedUser));
//                 })
//         }
//     ], (err, res) => { })
// }
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
        let orArray = [{ userType: 'PRO'}];
        user.phone ? orArray.push({ phone: user.phone }) : true;
        user.email ? orArray.push({ email: user.email }) : true;
        let query = {
          $and: orArray,
        };
        console.log(query);
        userSchema.findOne(query).exec((err, result) => {
          console.log(result);
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
            cb(
              null,
              apiResponse.successResponseWithData(
                res,
                "Registration Success.",
                updatedUser
              )
            );
          });
      },
    ],
    (err, res) => {}
  );
};

/**
 * //////////////////getProfessionalList////////////////////.
 * @returns {Object}
 */
let getProfessionalList = [
  (req, res) => {
    try {
      let criteria = {
        status: req.body.status || "ACTIVE",
        userType: req.body.userType || "PRO",
      };
      req.query.level ? (criteria.professionalLevel = req.query.level) : true;
      console.log(criteria);
      let query = [
        { $match: criteria },
        {
          $group: {
            _id: "$professionalLevel",
            professionalUser: {
              $push: {
                _id: "$_id",
                phone: "$countryCode",
                countryCode: "$countryCode",
                fullName: "$fullName",
                email: "$email",
                userType: "$userType",
                status: "$status",
                image: "$image",
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ].limit(1);
      userSchema.aggregate(query, (err, result) => {
        console.log("err", err);
        if (err || !result || result.length == 0) {
          if(req.headers.lang === "el")
            return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
          else
            return apiResponse.successResponseWithData(res,statusMessage.success,[]);
        }
        result = result[0].professionalUser.filter((el, i) => {
          el.price = "12";
          el.description = "description mynt lorem" + i;
          el.time = "45 Min";
          el.timeSlot = "07:00-07:30";
          el.rating = "4";
          return true;
        });
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
/**
 * User registration.
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
let updateFavList = (req, res) => {
  const { _id, status } = req.body;
  let userId = req.headers.decoded_id;
  async.waterfall(
    [
      (cb) => {
        let query = {
          _id: userId,
        };
        let dataToSet = {};
        if (status) {
          dataToSet.$push = {
            favProfessional: _id,
          };
        } else {
          dataToSet.$pull = {
            favProfessional: _id,
          };
        }
        console.log(query, dataToSet);
        userSchema.update(query, dataToSet, (err, dbData) => {
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
          apiResponse.successResponseWithData(res, statusMessageGr.success, result);
      else
          apiResponse.successResponseWithData(res, statusMessage.success, result);
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
let login = (req, res) => {
  try {
    let request = {
      email: (req.body.email).toLowerCase(),
      userType: "PRO",
    };
    userSchema.findOne(request).then((user) => {
      if (user) {
        if (user.status === "ACTIVE") {
          user.token = utility.jwtEncode(user._id);
          console.log(user);
          utility.createHash(req.body.password, (result) => {
            console.log("---------hash--------->>>>>", result);
          });

          console.log("compare", req.body.password);

          utility.compareHash(req.body.password, user.password, (pass) => {
            if (pass) {
              let dataToSet = { token: user.token };
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
                      return apiResponse.successResponseWithData(res,statusMessageGr.Login_sucess,user);
                  else
                      return apiResponse.successResponseWithData(res,statusMessage.Login_sucess,user);
                }
              );
            } else {
              if(req.headers.lang === "el")
                  return apiResponse.unauthorizedResponse(res,statusMessageGr.WRONG_PASSWORD);
              else
                  return apiResponse.unauthorizedResponse(res,statusMessage.WRONG_PASSWORD);
            }
          });
        } else {
          if(req.headers.lang === "el")
              return apiResponse.unauthorizedResponse(res,statusMessageGr.INACTIVE_USER);
          else
              return apiResponse.unauthorizedResponse(res,statusMessage.INACTIVE_USER);
        }
      } else {
        if(req.headers.lang === "el")
          return apiResponse.notFoundResponse(res, statusMessageGr.NOT_EXIST);
        else
          return apiResponse.notFoundResponse(res, statusMessage.NOT_EXIST);
      }
    });
  } catch (err) {
    return apiResponse.ErrorResponse(res, err);
  }
};


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
  const { address, state, city, zipcode, latitude, longitude } = req.body;
  const userId = req.headers.decoded_id;
  async.waterfall(
    [
      (cb) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          if(req.headers.lang === "el")
              cb(apiResponse.validationErrorWithData(res,statusMessageGr.ValidationError,errors.array()),null);
          else
              cb(apiResponse.validationErrorWithData(res,statusMessage.ValidationError,errors.array()),null);

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
              coordinates: [longitude, latitude],
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
  const addressId = req.params.addressId;
  const { address, state, city, zipcode, latitude, longitude } = req.body;
  async.waterfall(
    [
      (cb) => {
        let query = { "location._id": addressId };
        userSchema.findOne(query, (err, dbData) => {
          if (err) {
            return cb(apiResponse.ErrorResponse(res, err), null);
          } else if (!dbData) {
            if(req.headers.lang === "el")
              return cb(apiResponse.ErrorResponse(res, statusMessageGr.INVALID_ID),null);
            else
              return cb(apiResponse.ErrorResponse(res, statusMessageGr.INVALID_ID),null);
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

/****************  createWeddingEnquiry ************/
/****************  createWeddingEnquiry ************/
let createWeddingEnquiry = (req, res) => {
  const userId = req.headers.decoded_id;
  req.body.userId = userId;
  async.parallel(
    {
      create: (cb) => {
        myntWeddingModel.create(req.body, (err, result) => {
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
      if(req.headers.lang === "el")
        return apiResponse.successResponseWithData(res,statusMessageGr.success,result.gettime);
      else
        return apiResponse.successResponseWithData(res,statusMessage.success,result.gettime);
    }
  );
};

/****************  myBooking ************/
let myBooking = (req, res) => {
  const userId = req.headers.decoded_id;
  req.body.userId = userId;

  async.parallel(
    {
      upcomingBooking: (cb) => {
        let query = { professionalId: userId, status: { $in: ["CONFIRM"] } };
        myntBookModel
          .find(query)
          .sort({_id :-1})
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
            }
          })
          .exec((err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                  return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
              else
                  return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);
            } else {
              if(result.length>0){
                result.forEach((ele) => {
                  ele.serviceId.forEach((ele2) => {
                  console.log("ele.categoryName",ele2.categoryId)

                  if(req.headers.lang === "el"){
                    ele2.subCategoryName=ele2.subCategoryName2,
                    ele2.subCategoryDescription=ele2.subCategoryDescription2,
                    ele2.briefDescription=ele2.briefDescription2
                    ele2.categoryId.categoryName=ele2.categoryId.categoryName2
                    ele2.categoryId.categoryDescription=ele2.categoryId.categoryDescription2
                    }
                  })
                })
              }
              cb(null, result);
            }
          });
      },
      pastBooking: (cb) => {
        let query = {
          professionalId: userId,
          status: { $in: ["COMPLETED", "CANCELLED"] },
        };
        myntBookModel
          .find(query)
          .sort({_id :-1})
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
            }
          })
          .exec((err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                  return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
              else
                  return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);
            } else {
              if(result.length>0){
                result.forEach((ele) => {
                  ele.serviceId.forEach((ele2) => {
                  console.log("ele.categoryName",ele2.categoryId)

                  if(req.headers.lang === "el"){
                    ele2.subCategoryName=ele2.subCategoryName2,
                    ele2.subCategoryDescription=ele2.subCategoryDescription2,
                    ele2.briefDescription=ele2.briefDescription2
                    ele2.categoryId.categoryName=ele2.categoryId.categoryName2
                    ele2.categoryId.categoryDescription=ele2.categoryId.categoryDescription2
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
      let response = {
        upcomingBooking: result.upcomingBooking,
        pastBooking: result.pastBooking,
      };
      if(req.headers.lang === "el")
        return apiResponse.successResponseWithData(res,statusMessageGr.success,response);
      else
        return apiResponse.successResponseWithData(res,statusMessage.success,response);
    }
  );
};

/* signup */
let signup = (req, res) => {
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
            request.portfolio = [];
            request.password =
              "$2a$10$t/vxCcmaJF6VIJLapC0Lsuma3Y9ajutWomNkRyVqdRCOJn8WBn/2C";
            request.location = {
              address: request.address,
              city: request.city,
              state: request.state,
              zipcode: request.zipcode,
            };
            request.userType = "PRO";
            // request.bioData = bioData;
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

/****************  getBookingDetail ************/
let getBookingDetail = (req, res) => {
  const userId = req.headers.decoded_id;
  let bookingId = req.query.bookingId;
  async.parallel(
    {
      get: (cb) => {
        myntBookModel
          .findById(bookingId)
          .populate("professionalId", {
            phone: 1,
            countryCode: 1,
            email: 1,
            firstName: 1,
            fullName: 1,
            lastName: 1,
            image: 1,
            reviewAndRating:1
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
          // .populate('serviceId', { subCategoryDescription: 1, subCategoryName: 1, time: 1, _id: 1 })
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
          }).lean()
          .exec((err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                  return cb(apiResponse.notFoundResponse(res, statusMessageGr.NOT_FOUND),null);
              else
                  return cb(apiResponse.notFoundResponse(res, statusMessage.NOT_FOUND),null);
            } else {
              cb(null, result);
            }
          });
      },
    },
    (err, result) => {
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
      if(result.get){
        let reviewData = result.get.professionalId.reviewAndRating.find(ele => (ele.bookingId).toString() == (result.get._id).toString());
        result.get.rating = reviewData?reviewData.rating:"0";
        result.get.ratingDescription = reviewData?reviewData.review:"";
        result.get.time = result.get.time?(result.get.time).toString():"0";
        result.get.reviewCount = (result.get.professionalId.reviewAndRating.length).toString() || "0";
      }    
      if(req.headers.lang === "el")
        return apiResponse.successResponseWithData(res,statusMessageGr.success,result.get);
      else
        return apiResponse.successResponseWithData(res,statusMessage.success,result.get);
    }
  );
};


/*************************** editProfile *************************/
/*************************** editProfile *************************/
let editProfile = (req, res) => {
  const _id = req.headers.decoded_id;
  let empty = [];
  let form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 }); //setting max size of image to 10MB
  form.parse(req, (err, fields, files) => {
    // console.log(fields, files);
    async.parallel(
      {
        uploadImage: (cb) => {
          if (!files.files) {
            return cb(null, null);
          } else {
            utility.uploadMultipleImageIntoCloudinary(files, (image) => {
              // console.log(image);
              return cb(null, image);
            });
          }
        },
        uploadImage2: (cb) => {
          if (!files.portfolio) {
            return cb(null, null);
          } else {
            utility.uploadMultipleImageIntoCloudinary2(
              files.portfolio,
              (image) => {
                return cb(null, image);
              }
            );
          }
        },
        getProfileDetails: (cb) => {
          userSchema.findById(_id).exec((err, result) => {
            return cb(null, result);
          });
        },
      },
      async (err, result) => {
        let temp = {
          completeProfile: true,
        };

        result.uploadImage && result.uploadImage[0]
          ? (temp.image = result.uploadImage[0])
          : true;
        // fields.fullName ? (temp.fullName = fields.fullName[0]) : true;
        fields.firstName ? (temp.firstName = fields.firstName[0]) : true;
        fields.lastName ? (temp.lastName = fields.lastName[0]) : true;
        // fields.email ? (temp.email = fields.email[0]) : true;
        // fields.countryCode ? (temp.countryCode = fields.countryCode[0]) : true;
        // fields.phone ? (temp.phone = fields.phone[0]) : true;
        fields.bioData ? (temp.bioData = fields.bioData[0]) : true;
        // result.uploadImage2 && result.uploadImage2[0] ? temp.portfolio = result.uploadImage2 : true;

        let existPortfolio = await getPortfolioPic(_id);

        if (existPortfolio.portfolio.length) {
          result.uploadImage2 && result.uploadImage2[0]
            ? (temp.portfolio = result.uploadImage2)
            : true;

          if (!temp.portfolio) {
            console.log("portfolio undefined if condition", temp.portfolio);
          } else {
            temp.portfolio = temp.portfolio.concat(existPortfolio.portfolio);
          }

          console.log("AR", temp);
        } else {
          console.log("New Entry");
          result.uploadImage2 && result.uploadImage2[0]
            ? (temp.portfolio = result.uploadImage2)
            : true;
        }

        userSchema
          .findOneAndUpdate({ _id }, temp, { new: true })
          .lean(true)
          .exec((err, result) => {
            console.log(err);
            if (err || !result) {
              if(req.headers.lang === "el")
                return apiResponse.ErrorResponse(res,statusMessageGr.ValidationError);
              else
                return apiResponse.ErrorResponse(res,statusMessage.ValidationError);
            } else {
              result.portfolio =  result.portfolio.filter( ele2 => ele2);
              if(req.headers.lang === "el")
                return apiResponse.successResponseWithData(res,statusMessageGr.UPDATED,result);
              else
                return apiResponse.successResponseWithData(res,statusMessage.UPDATED,result);
            }
          });
      }
    );
  });
};

/******************** getPortfolioPic ********************/
/******************** getPortfolioPic ********************/
const getPortfolioPic = async (_id) => {
  try {
    return new Promise((resolve, reject) => {
      userSchema
        .find({ _id: _id })
        .select(["portfolio"])
        .exec((err, result) => {
          if (err || !result || result.length == 0) resolve([]);
          else resolve(result[0]);
        });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

/******************** checkBookingData ********************/
/******************** checkBookingData ********************/
const checkBookingData = async (_id) => {
  try {
    return new Promise((resolve, reject) => {
      myntBookModel
        .find({ _id: _id })
        .select(["expireDate", "status"])
        .exec((err, result) => {
          if (err || !result || result.length == 0) resolve([]);
          else resolve(result[0]);
        });
    });
  } catch (e) {
    return Promise.reject(e.toString());
  }
};

/******************** updateBookingStatus ********************/
/******************* updateBookingStatus *********************/
let updateBookingStatus = async (req, res) => {
  try {
    const userId = req.headers.decoded_id;
    let { status, bookingId, reason } = req.body;
    let query = { _id: bookingId };
    await removeTemporaryBooking();
    let data = await checkBookingData(bookingId);
    let checkTime = utility.timeDifference(data.expireDate, new Date());
    let update;
    if (data.status == "CONFIRM" || status =="CANCELLED" || status =="COMPLETED") {
      update = { $set: {}, $push: { activityLog: { userId, status, reason } } };
      status ? (update.$set.status = status) : true;
    } else {
      // checking booking timeout
      if (checkTime < 0 || checkTime > 2) {
        update = {
          $set: {},
          $push: { activityLog: { userId, status: "TIMEOUT", reason } },
        };
        status ? (update.$set.status = "TIMEOUT") : true;
      } else {
        update = {
          $set: {},
          $push: { activityLog: { userId, status, reason } },
        };
        status ? (update.$set.status = status) : true;
      }
    }
    myntBookModel.findOneAndUpdate(query, update, async (err, result) => {
      if (err || !result) {
        if(req.headers.lang === "el")
            apiResponse.ErrorResponseWithData(res,statusMessageGr["SOME-THING-WENT-WRONG"],err);
        else
            apiResponse.ErrorResponseWithData(res,statusMessage["SOME-THING-WENT-WRONG"],err);
      } else {

        if (status == "CONFIRM" || status =="CANCELLED" || status =="COMPLETED"){
          /**********************Release Profession for this slot and time */
          if(status =="CANCELLED"){

            let slotReleaseData = {
              date      :  result.date,
              timeSlot  :   result.timeSlot,
              professionalId :  result.professionalId
            }
            await slotRelease(slotReleaseData)
          }
          /*********************END********************/
          /**********************Check Specific Case, Change notification Type CANCELLED TO CANCELLEDSPECIFIC*/
          if(status =="CANCELLED" && result.bookingType == "SPECIFIC"){
            status = "CANCELLEDSPECIFIC";
            //do payment return process here//
            try{    
              if(result.serviceFee <=  0){
                if(result.creditPointApplied){ 
                  await userSchema.updateOne({_id: result.userId}, { $inc : { userPoint: result.creditPoint}}).exec();
                }
                if(result.giftCardApplied){
                  updateGiftAmountOnCancelbooking(result.giftCardAmount, result.userId)
                }
              }else{
                let getPaymentData = await paymentModel.findOne({bookingId: bookingId}).lean().exec();
                if(!getPaymentData){
                  let msg = req.headers.lang === "el"?statusMessageGr.NOT_FOUND:statusMessage.NOT_FOUND;
                  return apiResponse.ErrorResponseWithData(res,msg,[]);
                }
                // check creditPoint Applied if yes then return his credit also
                if(result.creditPointApplied){
                  await userSchema.updateOne({_id: result.userId}, { $inc : { userPoint: result.creditPoint}}).exec();
                }
                // check giftCard Applied if yes then return his gift Amount also
                if(result.giftCardApplied){
                  updateGiftAmountOnCancelbooking(result.giftCardAmount, result.userId)
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
                  userId        : result.userId,
                  proId         : result.professionalId,
                  sendStatus    : 1,
                  bookingId     : bookingId
                }
                await notification.create(notificationDataToSave);
              }
            }catch(e){
              return apiResponse.successResponseWithData(res,e,[]);
            }

          }
          /*********************END********************/
          await requestAcceptorRejectNotification(
            req.body,
            update,
            status,
            req.headers.lang
          );
          let resMsg = req.headers.lang === "el"?statusMessageGr.UPDATED:statusMessage.UPDATED;
          if(status =="COMPLETED"){
            resMsg = req.headers.lang === "el"?statusMessageGr.BOOKING_COMPLETED:statusMessage.BOOKING_COMPLETED;
          }
          apiResponse.successResponse(res, resMsg);
        } else {
          if (checkTime < 0 || checkTime > 2) {
            // await requestAcceptorRejectNotification(req.body,update,"TIMEOUT");
            let resMsg = req.headers.lang ==='el'? statusMessageGr.REQUEST_TIMEOUT : statusMessage.REQUEST_TIMEOUT;
            apiResponse.ErrorResponse(res, resMsg);
          } else {
            if(status == "CANCELLED" || status == "COMPLETED"){
              await requestAcceptorRejectNotification(
                req.body,
                update,
                req.body.status,
                req.headers.lang
              );
            }
            if(req.headers.lang === "el")
                apiResponse.successResponse(res, statusMessageGr.UPDATED);
            else
                apiResponse.successResponse(res, statusMessage.UPDATED);
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};

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

/****************  requestAcceptorRejectNotification ************/
/****************  requestAcceptorRejectNotification ************/
let requestAcceptorRejectNotification = (req, data, status, lang ="en") => {
  myntBookModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.bookingId)}},
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
        totalFee:1,
        userId: { firstName: 1, fullName:1,lastName: 1, deviceToken: 1, deviceType: 1, _id: 1,location: 1},
        professionalId: { firstName: 1, lastName: 1, deviceToken: 1, deviceType: 1, _id: 1,location: 1},
        serviceId: { subCategoryName: 1, time: 1 },
    }},
  ]).
  exec((err, responseData) => {
    if (responseData.length > 0) {
      let title , body ,titleEn, titleEl, descriptionEn, descriptionEl;
      let bookingDate = moment(responseData[0].date).format("DD-MM-YYYY");
    //send notification for cancel case
      if(status ==='CANCELLED'){
        title         = lang ==='el'? config.notificationContentEl.bookingCancelTitle:config.notificationContentEn.bookingCancelTitle;
        body          = lang ==='el'? config.notificationContentEl.bookingCancelPro:config.notificationContentEn.bookingCancelPro;
        titleEn       = config.notificationContentEn.bookingCancelTitle;
        titleEl       = config.notificationContentEl.bookingCancelTitle;
        descriptionEn = config.notificationContentEn.bookingCancelPro;
        descriptionEl = config.notificationContentEl.bookingCancelPro;
      }
      if(status === "COMPLETED"){
        let proName = responseData[0].professionalId.lastName? responseData[0].professionalId.firstName+' '+ (responseData[0].professionalId.lastName).slice(0 ,1).toUpperCase():responseData[0].professionalId.firstName;
        title         = lang ==='el'? config.notificationContentEl.bookingComplete:config.notificationContentEn.bookingComplete;
        body          = config.completedUserNotification({
          name      : proName,
          location  : responseData[0].userId.location[0].address,
          date      : bookingDate,
          time      : responseData[0].timeSlot,
          price     : responseData[0].totalFee
        }, lang );
        titleEn       = config.notificationContentEn.bookingComplete;
        titleEl       = config.notificationContentEl.bookingComplete;
        descriptionEn = config.completedUserNotificationDb({
          name      : proName,
          location  : responseData[0].userId.location[0].address,
          date      : bookingDate,
          time      : responseData[0].timeSlot,
          price     : responseData[0].totalFee //need to work later
        }, 'en' );
        descriptionEl = config.completedUserNotificationDb({
          name      : proName,
          location  : responseData[0].userId.location[0].address,
          date      : bookingDate,
          time      : responseData[0].timeSlot,
          price     : responseData[0].totalFee //need to work later
        }, 'el' );
      }
      if(status ==='CANCELLEDSPECIFIC'){
        title         = lang ==='el'? config.notificationContentEl.bookingCancelTitle:config.notificationContentEn.bookingCancelTitle;
        body          = lang ==='el'? statusMessageGr.USER_REFUND:statusMessage.USER_REFUND;
        titleEn       = config.notificationContentEn.bookingCancelTitle;
        titleEl       = config.notificationContentEl.bookingCancelTitle;
        descriptionEn = statusMessage.USER_REFUND;
        descriptionEl = statusMessageGr.USER_REFUND;
      }
      //check android device
      if (responseData[0].userId.deviceType == "A") {
        fcmNotification.androidNotification(
          responseData[0].userId.deviceToken,
          title,
          body,
          status,
          req.bookingId,
          responseData[0].professionalId
        );
      }
      //check ios device
      if (responseData[0].userId.deviceType == "I") {
        fcmNotification.iosNotification(
          responseData[0].userId.deviceToken,
          title,
          body,
          status,
          req.bookingId,
          responseData[0].professionalId
        );
      }
      // save notification to db
      notification.create({
        userType      : "USER", 
        type          : status,
        title         : titleEn, //english title
        description   : descriptionEn, //english description
        title2        : titleEl, //greek title
        description2  : descriptionEl, //Greek description
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

/****************  removeTemporaryBooking ************/
/****************  removeTemporaryBooking ************/
let removeTemporaryBooking = () => {
  myntBookModel.find({ status: "PENDING" }).
  select(['expireDate']).
  lean().
  exec(async(err, result) => {
    let updateIds = [];
    for(let i = 0; i < result.length; i++){
      let checkTime = utility.timeDifference(result[i].expireDate, new Date());
      if(checkTime < 0 || checkTime > 2) {
        updateIds.push(result[i]._id);
      }
    }
    if(updateIds.length > 0){
      await myntBookModel.updateMany({ _id: { $in:updateIds}},{ status: "TIMEOUT" }).exec();
    }
  });
};


/* ************************************** updateTimeSlot ************************************/
/* ************************************** updateTimeSlot ************************************/
let updateTimeSlot = (req, res) => {
  try {
    const userId = req.headers.decoded_id;
    let { date, time } = req.body;
    let query = {
      _id: userId,
    };
    let update = {
      $push: {
        timeSlot: { time, date },
      },
    };
    console.log(query, update);
    userSchema
      .findOneAndUpdate(query, update, { new: true, upsert: true })
      .select("timeSlot")
      .exec((err, result) => {
        console.log(err, result);
        if (err || !result) {
          if(req.headers.lang === "el")
              apiResponse.ErrorResponseWithData(res,statusMessageGr["SOME-THING-WENT-WRONG"],err);
          else
              apiResponse.ErrorResponseWithData(res,statusMessage["SOME-THING-WENT-WRONG"],err);
        } else {
          if(req.headers.lang === "el")
              apiResponse.successResponseWithData(res,statusMessageGr.UPDATED,result);
          else
              apiResponse.successResponseWithData(res,statusMessage.UPDATED,result);
        }
      });
  } catch (err) {
    console.log(err);
    return apiResponse.ErrorResponse(res, err);
  }
};


/*************************** update user status *************************/
/*************************** update user status *************************/
let updateStatus = (req, res) => {
  const userId = req.headers.decoded_id;
  if (!req.body.status) {
    if(req.headers.lang === "el")
      apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
    else
      apiResponse.ErrorResponse(res, statusMessage.ValidationError);
    return;
  }
  let request = {
    status: req.body.status,
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

/****************  getFaq ************/
/****************  getFaq ************/
let getFaq = (req, res) => {
  const userId = req.headers.decoded_id;
  async.parallel(
    {
      get: (cb) => {
        let queryS = {status:"ACTIVE", userType: "PRO"}
        myntFaq
          .find(queryS)
          .lean(true)
          .exec((err, result) => {
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

/****************  bookingHistory ************/
/****************  bookingHistory ************/
let bookingHistory = (req, res) => {
  const userId = req.headers.decoded_id;
  req.body.userId = userId;
  async.parallel(
    {
      upcomingBooking: (cb) => {
        let query = {
          professionalId: userId,
          status: { $in: ["COMPLETED", "ACCEPTED"] },
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
            select: ["subCategoryName", "subCategoryDescription","subCategoryName2", "subCategoryDescription2", "time"],
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
          .exec((err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
              else
                return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);
            } else {
              if(result.length>0){
                result.forEach((ele) => {
                  ele.serviceId.forEach((ele2) => {                
                  if(req.headers.lang === "el"){
                    ele2.subCategoryName=ele2.subCategoryName2,
                    ele2.subCategoryDescription=ele2.subCategoryDescription2,
                    ele2.briefDescription=ele2.briefDescription2
                    ele2.categoryId.categoryName=ele2.categoryId.categoryName2
                    ele2.categoryId.categoryDescription=ele2.categoryId.categoryDescription2
                    }
                  })
                })
              }
              cb(null, result);
            }
          });
      },
      pastBooking: (cb) => {
        let query = {
          professionalId: userId,
          status: { $in: ["REJECTED", "CANCELLED"] },
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
            select: ["subCategoryName", "subCategoryDescription","subCategoryName2", "subCategoryDescription2", "time"],
            populate: {
              path: "categoryId",
              model: "myntCategory",
              select: [
                "categoryName",
                "categoryDescription",
                "categoryName2",
                "categoryDescription2",
                "categoryImage",
                "_id",
              ],
            },
          })
          .exec((err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
              else
                return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);
            } else {
              if(result.length>0){
                result.forEach((ele) => {
                  ele.serviceId.forEach((ele2) => {                
                  if(req.headers.lang === "el"){
                    ele2.subCategoryName=ele2.subCategoryName2,
                    ele2.subCategoryDescription=ele2.subCategoryDescription2,
                    ele2.briefDescription=ele2.briefDescription2
                    ele2.categoryId.categoryName=ele2.categoryId.categoryName2
                    ele2.categoryId.categoryDescription=ele2.categoryId.categoryDescription2
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
      let response = {
        upcomingBooking: result.upcomingBooking,
        pastBooking: result.pastBooking,
      };
      if(req.headers.lang === "el")
        return apiResponse.successResponseWithData(res,statusMessageGr.success,response);
      else
        return apiResponse.successResponseWithData(res,statusMessage.success,response);
    }
  );
};

// /****************  feedbackList old 28 april change ************/
// /****************  feedbackList ************/
// let feedbackList = (req, res) => {
//   const userId = req.headers.decoded_id;
//   console.log("userId", userId);
//   async.parallel(
//     {
//       feedback: (cb) => {
//         userSchema
//           .find({ _id: userId })
//           .select(["reviewAndRating"])
//           .populate({
//             path: "reviewAndRating.userId",
//             select: ["fullName", "email", "image"],
//           })
//           .populate({
//             path: "reviewAndRating.bookingId",
//             select: ["description", "timeSlot", "bookingType", "serviceInfo"],
//             populate: {
//               path: "serviceId",
//               select: ["subCategoryName"],
//             },
//           })
//           .exec((err, result) => {
//             if (err || !result) {
//               return cb(
//                 apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),
//                 null
//               );
//             } else {
//               cb(null, result);
//             }
//           });
//       },
//     },
//     (err, result) => {
//       // delete result.feedback[0]._id;

//       let responceData = result.feedback[0].reviewAndRating;

//       return apiResponse.successResponseWithData(
//         res,
//         statusMessage.success,
//         responceData
//         // result.feedback[0].reviewAndRating
//       );
//     }
//   );
// };

/****************  feedbackList ************/
/****************  feedbackList ************/
let feedbackList = (req, res) => {
  const userId = req.headers.decoded_id;
  console.log("userId", userId);

  async.parallel(
    {
      feedback: (cb) => {
        userSchema
          .find({ _id: userId })
          .select(["reviewAndRating"])
          .populate({
            path: "reviewAndRating.userId",
            select: ["fullName", "email", "image"],
          })
          .populate({
            path: "reviewAndRating.bookingId",
            select: ["description", "timeSlot", "bookingType", "serviceInfo"],
            populate: {
              path: "serviceId",
              select: ["subCategoryName","subCategoryName2"],
              populate: {
                path: "categoryId",
                select: ["categoryName","categoryName2"],
            },
           },
          })
          .exec((err, result) => {
            if (err || !result) {
              if(req.headers.lang === "el")
                return cb(apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR),null);
              else
                return cb(apiResponse.ErrorResponse(res, statusMessage.DB_ERROR),null);
            } else {
              if(result.length>0){
                result.forEach((ele) => {
                  ele.reviewAndRating = ele.reviewAndRating.reverse();
                  ele.reviewAndRating.forEach((ele2) => {
                    ele2.bookingId.serviceId.forEach((ele3) => {
                       if(req.headers.lang === "el"){
                          ele3.subCategoryName=ele3.subCategoryName2
                          ele3.subCategoryDescription=ele3.subCategoryDescription2
                          ele3.briefDescription2=ele3.briefDescription2
                          ele3.categoryId.categoryDescription=ele3.categoryId.categoryDescription2
                          ele3.categoryId.categoryName=ele3.categoryId.categoryName2

                        }
                     })
                  })
                })
              }
              cb(null, result);
            }
          });
      },
    },
    (err, result) => {
      // delete result.feedback[0]._id;

      let responceData = result.feedback[0].reviewAndRating;

      if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res,statusMessageGr.success,responceData);
      else
          return apiResponse.successResponseWithData(res,statusMessage.success,responceData);
    });
};

/****************  setMyCalender ************/
let setMyCalender = (req, res) => {
  const userId = req.headers.decoded_id;
  let timeData = req.body.timeLog.split(",");
  myntCalender.findOne({calenderDate:req.body.calenderDate,proId:userId}, async(err, result) => {
    if (err || !result){
      if(req.headers.lang === "el"){
        return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
      }
      else{
        return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
      }
    }
    else{
      await myntCalender.updateOne({calenderDate:req.body.calenderDate,
        proId:userId},{$set:{ "timeLog.$[].isSelected": 0}}).exec();
      for(let i=0;i<timeData.length;i++){
        let queryData = {
          calenderDate:req.body.calenderDate,
          proId:userId,
          "timeLog.time":timeData[i]
        }
        await myntCalender.updateOne(queryData,{$set:{ "timeLog.$.isSelected": 1}}).exec();
      }
      if(req.headers.lang === "el"){
        return apiResponse.successResponseWithData(res,statusMessageGr.success);
      }
      else {
        return apiResponse.successResponseWithData(res,statusMessage.success);
      }
    }
  });
};

//**************** Old code setMyCalender change done from 28 April ************//
// let setMyCalender = (req, res) => {
//   const userId = req.headers.decoded_id;
//   let calenderData = req.body.calenderData;

//   for (i = 0; i < calenderData.length; i++) {
//     calenderData[i].status = "ACTIVE";
//     calenderData[i].proId = userId;
//   }

//   console.log("calenderData", calenderData);
//   myntCalender.create(calenderData, (err, result) => {
//     if (err || !result)
//       return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
//     else
//       return apiResponse.successResponseWithData(
//         res,
//         statusMessage.success,
//         result
//       );
//   });
// };

//****************  getMyCalender ************//
//****************  getMyCalender ************//
let getMyCalender = (req, res) => {
  const userId = req.headers.decoded_id;
  let currentUtcStartDate = new Date(moment().startOf('day'));
  let currentTime = moment().add(7.5 ,'hour');
  let hour   = currentTime.hour();
  let minute = currentTime.minute();
  if(minute <= 30) currentTime.set({minute: 30});
  if(minute >  30) currentTime.set({hour: hour + 1, minute: 0});
  let cDate = moment().format("YYYY-M-D");
  let query =[
    {$match:{ proId: mongoose.Types.ObjectId(userId), status: "ACTIVE"}},
    {
      "$addFields": {
        "date": {
          "$dateFromString": {
            "dateString": "$calenderDate"
          }
        }
      }
    },
    { "$match": { "date": {"$gte": currentUtcStartDate}}},
    {$sort: {date: 1}},
    {$project: {
      calenderDate:1,
      timeLog: 1
    }}
  ];
  myntCalender.aggregate(query)
  .exec(async (err, result) => {
    if(err){
      if(req.headers.lang === "el")
        return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
      else
        return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
    }
    else {
      if (!result.length) {
        calenderData = await currentMonthCalender(userId);
        myntCalender.create(calenderData, (err, resultData) => {
          if (err || !resultData){
            if(req.headers.lang === "el")
                return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
            else
                return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
          }else {
            myntCalender.find({ proId: userId, status: "ACTIVE" })
              .select(["_id", "calenderDate", "timeLog"])
              .exec(async (err, responceData) => {
                if (err || !responceData){
                  if(req.headers.lang === "el")
                    return apiResponse.ErrorResponse(res,statusMessageGr.DB_ERROR);
                  else
                    return apiResponse.ErrorResponse(res,statusMessage.DB_ERROR);
                }else {
                  responceData.filter(ele =>{
                    if(ele.calenderDate == cDate){
                      ele.timeLog = ele.timeLog.filter(ele3 =>{
                        return  moment(ele3.time, 'HH:mm').hour() >=  hour;
                      });
                    }
                    return ele;
                  })
                  if(req.headers.lang === "el")
                    return apiResponse.successResponseWithData(res,statusMessageGr.success,responceData);
                  else
                    return apiResponse.successResponseWithData(res,statusMessage.success,responceData);
                }
              });
            }
        });
      } else {
        //create nex (exact) 90 days record;
        let remainingDateLength = 90 - result.length;
        let remainingData =[];
        for(i = 1; i <=  remainingDateLength; i++){
          remainingData.push({
            calenderDate : moment().add(90 - i, 'd').format('YYYY-M-D'),
            timeLog: constants.time,
            proId: userId,
          })
        }
        if(remainingData.length > 0){
          await myntCalender.create(remainingData.reverse());
          result = await myntCalender.aggregate(query).exec();
        }
        result.filter(ele =>{
          if(ele.calenderDate == cDate){
            ele.timeLog = ele.timeLog.filter(ele3 =>{
              return  moment(ele3.time, 'HH:mm').hour() >=  hour;
            });
          }
          return ele;
        })
        if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res,statusMessageGr.success,result);
        else
          return apiResponse.successResponseWithData(res,statusMessage.success,result);
      }
    }
  });
};

/****************  resetMyCalenderSlot ************/
/****************  resetMyCalenderSlot ************/
let currentMonthCalender = (userId) => {
  let remainingData =[];
  for(i = 0; i <  90; i++){
    remainingData.push({
      calenderDate : moment().add(i, 'd').format('YYYY-M-D'),
      timeLog: constants.time,
      proId: userId,
    })
  }
  return remainingData;
};


//****************  viewMyCalender ************//
//****************  viewMyCalender ************//
let viewMyCalender = (req, res) => {
  const userId = req.headers.decoded_id;
  let now = new Date()
  let currentUtcStartDate = new Date(moment().startOf('day'));
  myntCalender.aggregate([
    {$match:{ proId: mongoose.Types.ObjectId(userId), status: "ACTIVE"}},
    {
      "$addFields": {
        "date": {
          "$dateFromString": {
            "dateString": "$calenderDate"
          }
        }
      }
    },
    { "$match": { "date": {"$gte": currentUtcStartDate},'timeLog.isSelected': 1}},
    { $sort: { date: 1 }},
    {$project: {
      calenderDate:1,
      timeLog: 1
    }}
  ])
  .exec(async (err, result) => {
    if(err){
      if(req.headers.lang === "el")
        return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
      else
        return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
    }
    else { 
      // result = result.filter((ele)=>{
      //   ele.timeLog = ele.timeLog.filter(isSelected => {
      //     return isSelected.isSelected == 1;
      //   });
      //   return ele.timeLog.length != 0;
      // });
      if(req.headers.lang === "el"){
        return apiResponse.successResponseWithData(res,statusMessageGr.success,result);
      }
      else{
        return apiResponse.successResponseWithData(res,statusMessage.success,result);
      }
    }
  });
};

/****************  resetMyCalenderSlot ************/
/****************  resetMyCalenderSlot ************/
let resetMyCalenderSlot = (req, res) => {
  const userId = req.headers.decoded_id;
  let { _id, time } = req.body;

  console.log("req.body-<>>>-", req.body);
  myntCalender.findOneAndUpdate(
    { _id: _id },
    { $pull: { timeLog: time } },
    (err, result) => {
      if (err || !result){
        if(req.headers.lang === "el")
          return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
        else
          return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
      }else{
        if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res, statusMessageGr.success);
        else
          return apiResponse.successResponseWithData(res, statusMessage.success);
      }
    }
  );
};

/****************  removeMyCalender ************/
/****************  removeMyCalender ************/
let removeMyCalender = (req, res) => {
  const userId = req.headers.decoded_id;
  let { _id } = req.body;
  console.log("req.body-<>>>-", req.body);

  myntCalender.findOneAndUpdate(
    { _id: _id },
    { status: "INACTIVE" },
    (err, result) => {
      if (err || !result){
        if(req.headers.lang === "el")
          return apiResponse.ErrorResponse(res, statusMessageGr.DB_ERROR);
        else
          return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
      }else{
        if(req.headers.lang === "el")
          return apiResponse.successResponseWithData(res, statusMessageGr.success);
        else
          return apiResponse.successResponseWithData(res, statusMessage.success);
      }
    }
  );
};

/****************  getNotificationList ************/
let getNotificationList = (req, res) => {
  const userId = req.headers.decoded_id;
  let titleField = req.headers.lang ==='el'?"$title2":"$title";
  let descriptionField = req.headers.lang ==='el'?"$description2":"$description";
  notification
    .aggregate([
      { $match: {
        proId: mongoose.Types.ObjectId(userId),
        userType: "PRO"
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
      { $unwind: "$proId"},
      {
        $project: {
          title: titleField,
          description: descriptionField,
          createdAt: 1,
          userId:{
            fullName :1,
            image : 1
          },
          proId:{
            firstName :1,
            lastName :1,
            image : 1
          },
          bookingId: 1,
          type: 1
        },
      },
    ])
    .exec((err, data) => {
      let msg = req.headers.lang === "el"?statusMessageGr.success:statusMessage.success;
      if(data.length){
        data.forEach((ele) => {
          if(ele.type ==='GIFTCARD'){
            ele.image = process.env.APP_URL+'/public/payment.png';
          }else{
            ele.image = process.env.APP_URL+'/public/booking.png';
          }
        });
      }
      if(err) return apiResponse.successResponseWithData(res, msg, []);
      return apiResponse.successResponseWithData(res, msg, data);
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

/****************  helpVideo ************/
/****************  helpVideo ************/
let helpVideo = (req, res) => {
  const userId = req.headers.decoded_id;
  req.body.userId = userId;
  console.log(req.body, userId);
  let result = {
    url:
      "https://techugocoms3.s3-ap-south-1.amazonaws.com/video/1615548413@VID-20210312-WA0007.mp4",
  };
  if(req.headers.lang === "el")
    return apiResponse.successResponseWithData(res,statusMessageGr.success,result);
  else
    return apiResponse.successResponseWithData(res,statusMessage.success,result);
};


/****************  changePassword ************/
/****************  changePassword ************/
let changePassword = async (req, res) => {
  const userId = req.headers.decoded_id;
  userSchema.findOne({ _id: userId, userType: "PRO" }).then((user) => {
    if (user) {
      if (user.status === "ACTIVE") {
        utility.createHash(req.body.oldPassword, (result) => {});
        utility.compareHash(req.body.oldPassword, user.password, (pass) => {
          if (pass) {
            if (req.body.newPassword === req.body.conPassword) {
              utility.createHash(req.body.newPassword, (newPassword) => {
                let pwd = { password: newPassword };
                userSchema.findOneAndUpdate(
                  { _id: userId },
                  { $set: pwd },
                  { new: true },
                  (err, dbdata) => {}
                );
              });
              if(req.headers.lang === "el")
                apiResponse.successResponseWithData(res,statusMessageGr.UPDATED);
              else
                apiResponse.successResponseWithData(res,statusMessage.UPDATED);
            } else {
              if(req.headers.lang === "el")
                apiResponse.ErrorResponse(res,statusMessageGr.CONPASSWORD);
              else
                apiResponse.ErrorResponse(res,statusMessage.CONPASSWORD);
            }
          } else {
            if(req.headers.lang === "el")
              apiResponse.ErrorResponse(res,statusMessageGr.INCORRECT_OLD_PASSWORD);
            else
              apiResponse.ErrorResponse(res,statusMessage.INCORRECT_OLD_PASSWORD);
          }
        });
      }
    } else {
      if(req.headers.lang === "el")
        apiResponse.unauthorizedResponse(res, statusMessageGr.INACTIVE_USER);
      else
        apiResponse.unauthorizedResponse(res, statusMessage.INACTIVE_USER);
    }
  });
};

/*************************** serviceRequest  *************************/
/*************************** serviceRequest  *************************/
let serviceRequest = async (req, res) => {
  const userId = req.headers.decoded_id;
  req.body.userId = userId;
  await removeTemporaryBooking();
  // let QueryUpcoming = {professionalId: mongoose.Types.ObjectId(userId) , status: { $nin: ["COMPLETED", "CANCELLED"]}};
  let QueryUpcoming = {
    professionalId: mongoose.Types.ObjectId(userId),
    status: { $in: ["PENDING"] },
  };

  myntBookModel.aggregate([
      { $match: QueryUpcoming }, //query
      {$lookup: {from: "userSchema",localField: "userId",foreignField: "_id",as: "userId",},},
      { $unwind: "$userId" },
      { $lookup: {from: "userSchema",localField: "professionalId",foreignField: "_id",as: "professionalId",},},
      { $unwind: "$professionalId" },
      { $lookup: {from: "myntSubCategory",localField: "serviceId",foreignField: "_id",as: "serviceId",},},
      { $unwind: "$serviceId" },
      { $lookup: {from: "myntCategory",localField: "serviceId.categoryId",foreignField: "_id",as: "serviceId.categoryId",},
      },{ $unwind: "$serviceId.categoryId" },
      { $group:{ _id:"$_id", "doc": { "$first": "$$ROOT" },},},
      { "$replaceRoot": { "newRoot": "$doc" }},
      { $project: { location: 1,timeSlot: 1,
          userId: { phone: 1,countryCode: 1,fullName: 1,email: 1,image: 1,firstName: 1,lastName: 1,},
          professionalId: { phone: 1,countryCode: 1,fullName: 1,email: 1,image: 1,firstName: 1,lastName: 1,},
          serviceId: { subCategoryName: 1,subCategoryName2: 1,subCategoryDescription: 1,subCategoryDescription2: 1,time: 1,
            categoryId: { categoryName: 1,categoryName2: 1,categoryImage: 1,categoryDescription: 1,categoryDescription2: 1},
          },
          serviceInfo: 1,
          description: 1,
          timeSlot: 1,
          serviceFee: 1,
          appointmentFee: 1,
          discount: 1,
          paymentMode: 1,
          serviceCompleted: 1,
          bookingType: 1,
          status: 1,
          date: 1,
          activityLog: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { _id: -1 } },
    ])
    // .limit(1)
    .exec((err, data) => {
      if (err){
        if(req.headers.lang === "el")
            return apiResponse.successResponseWithData(res,statusMessageGr.success,[]);
        else
            return apiResponse.successResponseWithData(res,statusMessage.success,[]);
      }
      if(data.length>0){
        data.forEach((ele) => {
          console.log(JSON.stringify(ele.serviceId))
          if(req.headers.lang === "el"){
            ele.serviceId.subCategoryName=ele.serviceId.subCategoryName2
            ele.serviceId.subCategoryDescription=ele.serviceId.subCategoryDescription2
            ele.serviceId.categoryId.categoryDescription=ele.serviceId.categoryId.categoryDescription2
            ele.serviceId.categoryId.categoryName=ele.serviceId.categoryId.categoryName2
          }
        })
      }
      if(req.headers.lang === "el")
        return apiResponse.successResponseWithData(res,statusMessageGr.success,data);
      else
        return apiResponse.successResponseWithData(res,statusMessage.success,data);
    });
};

/*************************** deleteImage  *************************/
/*************************** deleteImage  *************************/
let deleteImage = (req, res) => {
  const userId = req.headers.decoded_id;
  userSchema.findByIdAndUpdate(
    { _id: userId },
    { $pull: { portfolio: { $in: [req.body.imageName] } } },
    (err, result) => {
      console.log(err);
      if (err || !result) {
        if(req.headers.lang === "el")
          apiResponse.ErrorResponse(res, statusMessageGr.ValidationError);
        else
          apiResponse.ErrorResponse(res, statusMessage.ValidationError);
      } else {
        if(req.headers.lang === "el")
            apiResponse.successResponseWithData(res,statusMessageGr.UPLOAD,result);
        else
            apiResponse.successResponseWithData(res,statusMessage.UPLOAD,result);
      }
    }
  );
};


/*************************** AddOneMoreDaysToCalender  *************************/
/*************************** AddOneMoreDaysToCalender  *************************/
let AddOneMoreDaysToCalender = (req, res) => {
  const userId = req.headers.decoded_id;

  let now = new Date()
  let currentDate = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
  let next30days = new Date(now.setDate(now.getDate() + 31))
  let endDate = next30days.getFullYear() +"-" +(next30days.getMonth()+1) +"-" +now.getDate();

  console.log("currentDate",currentDate,"endDate",endDate,"next30days",next30days)

  let queryData={proId:userId,status:"ACTIVE",calenderDate:{$gte:currentDate}};

  myntCalender.distinct("proId")
    .exec(async (err, result) => {
      console.log(err);
      if (err || !result) {
        apiResponse.ErrorResponse(res, statusMessage["Validation Error"]);
      } else {

        if(result.length){

          let saveData=[];
          for(let i=0;i<result.length;i++){
            let ob={
              proId:result[i],
              calenderDate:endDate,
              status:"ACTIVE",
              timeLog:constants.time
            };
            saveData.push(ob);
          }
          if(saveData.length){
            myntCalender.create(saveData, (err, resultData) => {
              if (err || !resultData)
                return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
              else {
                console.log("saveData",saveData)
              }
            })
          }

          console.log("saveData",saveData)
          apiResponse.successResponseWithData(
            res,
            statusMessage.success,
            saveData
          );

        }else{
          apiResponse.successResponseWithData(
            res,
            statusMessage.success,
            result
          );
        }
      }
    });
};
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



/************Mynt CMS Page API**************/
/**
 *@method get
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const getCmsPage = (req, res)  => {
  let query = { status: "ACTIVE" , userType: "PRO", textCode : req.query.textCode};
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


/************Send BookoingConfirmationCode API**************/
/**
 *@method post
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const bookingCompletionCode = (req, res)  => {
  let bookingId = req.body.bookingId;
  myntBookModel.findOne({_id: bookingId}).populate('userId').lean().exec((err, data)=>{
    if(err || !data) return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR);
    //send notification to user for verification code
    //check device Android
    let body = `This is your verification code ${data.bookingCompletionCode} for booking completion, please share this with your professional.`;
    if (data.userId.deviceType == "A") {
      fcmNotification.androidNotification(
        data.userId.deviceToken,
        'Booking completion code',
        body,
        "BOOKINGCOMPLETIONCODE",
        bookingId,
        data.professionalId

      );
    }
    //check device ios
    if (data.userId.deviceType == "I") {
      fcmNotification.iosNotification(
        data.userId.deviceToken,
        'Booking completion code',
        body,
        "BOOKINGCOMPLETIONCODE",
        bookingId,
        data.professionalId

      );
    }
    return apiResponse.successResponse(res, statusMessage.success)
  });
}
/*********************************END***********************/

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


module.exports = {
  AddOneMoreDaysToCalender:AddOneMoreDaysToCalender,
  login: login,
  socialSignup,
  getServices,
  updateFavList,
  getProfessionalList,
  editAddress,
  addAddress,
  createWeddingEnquiry,
  myBooking,
  signup: signup,
  getBookingDetail,
  editProfile,
  updateBookingStatus: updateBookingStatus,
  updateTimeSlot: updateTimeSlot,
  updateStatus: updateStatus,
  getFaq: getFaq,
  bookingHistory: bookingHistory,
  feedbackList: feedbackList,
  setMyCalender: setMyCalender,
  resetMyCalenderSlot: resetMyCalenderSlot,
  getMyCalender: getMyCalender,
  viewMyCalender: viewMyCalender,
  removeMyCalender: removeMyCalender,
  getNotificationList: getNotificationList,
  logout: logout,
  contactUs: contactUs,
  updateDeviceToken: updateDeviceToken,
  helpVideo: helpVideo,
  changePassword: changePassword,
  serviceRequest: serviceRequest,
  getCmsPage:getCmsPage,
  deleteImage: deleteImage,
  bookingCompletionCode: bookingCompletionCode,
  updateLanguage:updateLanguage
};

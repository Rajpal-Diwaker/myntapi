/* eslint-disable no-unused-vars */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* territory model start*/
const signupTemplate            = require("../../helpers/templates/signupTemp");
const forgotPasswordEmailTemp   = require("../../helpers/templates/forgot-password");
/**notification schema ends */
const statusCode                = require('../../config/config').statusCode;
const statusMessage             = require('../../config/config').statusMessage;
const { validationResult }      = require("express-validator");
//helper file to prepare responses.
const apiResponse               = require("../../helpers/apiResponse");
const utility                   = require("../../helpers/utility");
const bcrypt                    = require("bcryptjs");
const mailer                    = require("../../helpers/mailer"); /* used */
const multiparty                = require('multiparty');
const async                     = require('async');
var mongoose                    = require('mongoose');
var path                        = require('path')
const mailSubject               = require('../../config/config').MAIL_SUBJECT;
//Moment js for date and time
const moment                    = require('moment');


/* mynt start here */
const userSchema                = require("../../models/userModel/userSchema");
const myntCategoryModel         = require('../../models/myntSchema/categorySchema');
const myntSubCategoryModel      = require('../../models/myntSchema/subCategorySchema');
const myntWeddingModel          = require('../../models/myntSchema/weddingSchema');
const myntBookModel             = require('../../models/myntSchema/bookingschema');
const myntFaq                   = require("../../models/myntSchema/faq")
const rewardPointSchema         = require("../../models/myntSchema/rewardspointSchema");
const tutorialHelpModel         = require("../../models/myntSchema/tutorialHelp");
const myntSettingModel          = require("../../models/myntSchema/myntSetting");
const myntGiftCardModel         = require("../../models/myntSchema/giftCardSchema");
const myntCmsPageModel          = require("../../models/myntSchema/myntCmsPage");
const myntPhotoShootModel       = require("../../models/myntSchema/photoshootRequest");
const myntContactModel          = require("../../models/myntSchema/contactSchema");

/* mynt start here */
/**
 * User registration.
 *
 * @param {string}      categoryname
 * @param {string}      image
 * @returns {Object}
 */
let addCategory = [
    (req, res) => {
        try {
            let form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 }); //setting max size of image to 10MB
            form.parse(req, (err, fields, files) => {
                async.parallel({
                    uploadImage: (cb) => {
                        utility.uploadMultipleImageIntoCloudinary(files, (image) => {
                            return cb(null, image)
                        })
                    }
                }, (err, result) => {
                    console.log(err, result)
                    let temp = {
                        categoryDescription: fields.categoryDescription[0],
                        categoryName: fields.categoryName[0],
                        categoryDescription2: fields.categoryDescription2[0],
                        categoryName2: fields.categoryName2[0],
                        categoryImage: result.uploadImage
                    }
                    myntCategoryModel.create(temp, (err, result) => {
                        console.log(err, result);
                        if (err || !result) {
                            return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
                        }
                        else {
                            return apiResponse.successResponse(res, statusMessage.ADDED)
                        }
                    })
                })
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
// /**
//  * User registration.
//  * @returns {Object}
//  */
let categoryList = [
    (req, res) => {
        try {
            let criteria = {}
            req.query.status && req.query.status === "ACTIVE" ? criteria.status = "ACTIVE" : true;
            let query = [
                { $match: criteria },
                {
                    "$lookup": {
                        "from": 'myntSubCategory',
                        "let": {
                            "categoryId": "$_id",
                        },
                        "pipeline": [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$categoryId", "$$categoryId"] },
                                            // { $eq: ["$status", "ACTIVE"] }
                                        ]
                                    }
                                }
                            }
                        ],
                        "as": "subCategory"
                    }
                }
            ]
            myntCategoryModel.aggregate(query, (err, result) => {
                console.log("err", err);
                if (err || !result || result.length == 0) {
                    return apiResponse.successResponseWithData(res, statusMessage.success, [])
                }
                result.map(category => {
                    if (category && category.subCategory) {
                        category.subCategoryCount = category.subCategory.length
                    }
                })
                apiResponse.successResponseWithData(res, statusMessage.success, result)
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

// /***********Get CategoryList List ***************
//  * @method get
//  * @params { status, searchText, page, limit}
//  * @return {object} 
//  */
//  const categoryList = (req, res) => {
//     let query = {};
//     let sort  = { _id: 1};
//     let start = Number(req.query.page) || 1;
//     let limit = Number(req.query.limit) || 50;
//     let startDate = req.query.startDate;
//     let endDate= req.query.endDate;
//     let searchText = req.query.searchText;
// 	start = (start - 1) * limit;
//     if(req.query.status) query.status     = { $in: req.query.status};
//     if(startDate && endDate){
//         query.createdAt =  { $gte: new Date(moment(startDate, 'DD-MM-YYYY').startOf('d')), $lte: new Date(moment(endDate,'DD-MM-YYYY').endOf('d'))}
//     }
//     if(searchText) {
//         let searchQ = {
//             $or: [
//                 { 'categoryName': { $regex: searchText, $options: "sim" } },
//                 { 'categoryName2': { $regex: searchText, $options: "sim" } },
//                 { 'subCategory.subCategoryName': { $regex: searchText, $options: "sim" } },
//                 { 'subCategory.subCategoryName2': { $regex: searchText, $options: "sim" } }
//             ]
//         };
//         query = { ...query, ...searchQ };
//     }
//     let promiseArray = [
//         myntCategoryModel.aggregate([
//         {$lookup: { from: 'myntSubCategory', localField:'_id', foreignField:'categoryId', as: 'subCategory'}},
//         {$match: query},
//         {$sort: sort},
//         {$skip: start},
//         {$limit: limit}
//         ]).exec(),
//         myntCategoryModel.aggregate([
//         {$lookup: { from: 'myntSubCategory', localField:'_id', foreignField:'categoryId', as: 'subCategory'}},
//         {$match: query},
//         {$count: 'count'}
//         ]).exec()
//     ];
//     Promise.all(promiseArray).then(data => {
//         data[1] =  data[1] && data[1][0] && data[1][0].count? data[1][0].count: 0;
//         return apiResponse.successResponseWithData(res, statusMessage.success, data)
//     }).catch(err => {
//           return apiResponse.ErrorResponse(res, 'Something went wrong')    
//     });
// }
// /**********************************END****************************/




/**
 * User registration.
 * @returns {Object}
 */
let getServices =
    (req, res) => {
        try {
            let criteria = {
                categoryId: req.query.categoryId
            }
            req.query.status && req.query.status === "ACTIVE" ? criteria.status = "ACTIVE" : true;
            myntSubCategoryModel.find(criteria)
                .populate('categoryId')
                .exec((err, result) => {
                    console.log("err", err);
                    if (err || !result || !result.length) {
                        return apiResponse.successResponseWithData(res, statusMessage.success, [])
                    }
                    apiResponse.successResponseWithData(res, statusMessage.success, result)
                })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
/* updatesubcategory */
let updateSubCategory = [
    (req, res) => {
        try {
            let { editFlag, _id } = req.body
            console.log(req.body);
            let temp = {
                categoryId: req.body.categoryId,
                subCategoryName: req.body.subCategoryName,
                subCategoryDescription: req.body.subCategoryDescription,
                briefDescription: req.body.briefDescription,
                subCategoryName2: req.body.subCategoryName2,
                subCategoryDescription2: req.body.subCategoryDescription2,
                briefDescription2: req.body.briefDescription2,
                time: req.body.time,
                price: { level1, level2, level3 } = req.body
            }
            if (editFlag == true) {
                let query = { _id }
                myntSubCategoryModel.findOneAndUpdate(query, { $set: temp }).exec((err, result) => {
                    if (err || !result) {
                        apiResponse.ErrorResponse(res, statusMessage["Validation Error"])
                    }
                    else {
                        apiResponse.successResponse(res, statusMessage.UPDATED)
                    }
                })
            }
            else {
                myntSubCategoryModel.create(temp, (err, result) => {
                    if (err || !result) {
                        apiResponse.ErrorResponse(res, statusMessage["Validation Error"])
                    }
                    else {
                        apiResponse.successResponse(res, statusMessage.ADDED)
                    }
                })
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
//editCategory
/**
 *
 * @param {*} req
 * @param {*} res
 */
let editCategory = [
    (req, res) => {
        const _id = req.params.categoryId;
        let empty = []
        try {
            let form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 }); //setting max size of image to 10MB
            form.parse(req, (err, fields, files) => {
                console.log(fields, files);
                async.parallel({
                    uploadImage: (cb) => {
                        if (!files.files) {
                            return cb(null, empty);
                        }
                        utility.uploadMultipleImageIntoCloudinary(files, (image) => {
                            console.log("image", image);
                            cb(null, image)
                        })
                    },
                    deleteImage: (cb) => {
                        if (!fields.deleteImage) {
                            return cb(null, "");
                        }
                        let query = {
                            _id
                        }
                        let update = {
                            $pull: { categoryImage: { $in: fields.deleteImage[0].split(',') } }
                        };

                        myntCategoryModel.findOneAndUpdate(query, update, { multi: true }).exec((err, result) => {
                            console.log(err, result);
                            cb(null, result)
                        })
                    }
                }, (err, result) => {
                    // console.log(err, result)
                    let temp = {
                        categoryName: fields.categoryName[0],
                        categoryDescription: fields.categoryDescription[0]
                    }
                    result.uploadImage && result.uploadImage[0] ? temp.categoryImage = result.uploadImage : true;
                    let update = {
                        $set: {
                            categoryName: fields.categoryName[0],
                            categoryDescription: fields.categoryDescription[0],
                            categoryName2: fields.categoryName2[0],
                            categoryDescription2: fields.categoryDescription2[0]
                        },
                        $push: {}
                    }
                    if (temp.categoryImage) {
                        update.$push.categoryImage = temp.categoryImage
                    }
                    myntCategoryModel.findOneAndUpdate({ _id }, update, { new: true }, (err, result) => {
                        console.log(err);
                        if (err || !result) {
                            return apiResponse.ErrorResponse(res, statusMessage["Validation Error"])
                        }
                        else {
                            return apiResponse.successResponseWithData(res, statusMessage.UPDATED, result)
                        }
                    })
                })
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
/**
 * getProfessionalList
 * @returns {Object}
 */
let getUserList = [
    (req, res) => {
        try {
            console.log(req.query)
            let criteria = {}
            req.query.status ? criteria.status = { $in: req.query.status } : true;
            req.query.userType ? criteria.userType = req.query.userType : true;
            console.log(JSON.stringify(criteria))
            userSchema.find(criteria)
                .select(['yearOfExperience','workedWithCeleb','workedWithTV','','position', 'location', 'createdAt', 'professionalLevel', '_id', 'image', 'phone', 'countryCode', 'fullName', 'email', 'image', 'firstName', 'lastName', 'status', 'userType'])
                .populate('position')
                .sort({ _id: -1 })
                .exec((err, result) => {
                    console.log("err", err);
                    if (err || !result || result.length == 0) {
                        return apiResponse.successResponseWithData(res, statusMessage.success, [])
                    }
                    apiResponse.successResponseWithData(res, statusMessage.success, result)
                })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
/**
 * getweddingList
 * @returns {Object}
 */
let getWeddingList = (req, res) => {
    try {
        console.log(req.query)
        let criteria = {}
        req.query.status ? criteria.status = { $in: req.query.status } : true;
        myntWeddingModel.find(criteria)
            .populate('userId', { image: 1, phone: 1, countryCode: 1, email: 1, firstName: 1, fullName: 1, lastName: 1, _id: 1 })
            .sort({ _id: -1 })
            .exec((err, result) => {
                console.log("err", err);
                if (err || !result || result.length == 0) {
                    return apiResponse.successResponseWithData(res, statusMessage.success, [])
                }
                apiResponse.successResponseWithData(res, statusMessage.success, result)
            })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}
/**
 * getBookingServies
 * @returns {Object}
 */
let getBookingServies = (req, res) => {
    try {
        let criteria = {}
        req.query.status ? criteria.status = { $in: req.query.status } : true;
        if(req.query.userId) criteria.userId = req.query.userId;
        myntBookModel.find(criteria)
            .populate('userId', { image: 1, phone: 1, countryCode: 1, email: 1, firstName: 1, fullName: 1, lastName: 1, _id: 1 })
            .populate('professionalId', { image: 1, phone: 1, countryCode: 1, email: 1, firstName: 1, fullName: 1, lastName: 1, _id: 1 })
            .populate({
                path: 'serviceId',
                select: ['subCategoryName', 'subCategoryDescription', 'time'],
                populate: {
                    path: 'categoryId',
                    model: 'myntCategory',
                    select: ['categoryName', 'categoryImage', 'categoryDescription', '_id']
                }
            })
            .sort({ _id: -1 })
            .exec((err, result) => {
                console.log("err", err);
                if (err || !result || result.length == 0) {
                    return apiResponse.successResponseWithData(res, statusMessage.success, [])
                }
                apiResponse.successResponseWithData(res, statusMessage.success, result)
            })
    } catch (err) {
        return apiResponse.ErrorResponse(res, err);
    }
}
/* updateBookingstatus */
let updateBookingstatus =
    (req, res) => {
        try {
            console.log(req.query);
            let { status, _id } = req.query;
            let query = {
                _id
            }
            let update = {
                $set: {}
            }
            status ? update.$set.status = status : true;
            console.log(query, update);
            myntBookModel.findOneAndUpdate(query, update, (err, result) => {
                if (err || !result) {
                    apiResponse.ErrorResponseWithData(res, statusMessage["SOME-THING-WENT-WRONG"], err)
                }
                else {
                    apiResponse.successResponse(res, statusMessage.UPDATED)
                }
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
/* updateWeddingstatus */
let updateWeddingstatus =
    (req, res) => {
        try {
            console.log(req.query);
            let { status, _id } = req.query;
            let query = {
                _id
            }
            let update = {
                $set: {}
            }
            status ? update.$set.status = status : true;
            console.log(query, update);
            myntWeddingModel.findOneAndUpdate(query, update, (err, result) => {
                if (err || !result) {
                    apiResponse.ErrorResponseWithData(res, statusMessage["SOME-THING-WENT-WRONG"], err)
                }
                else {
                    apiResponse.successResponse(res, statusMessage.UPDATED)
                }
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
/* updateUserStatus */
let updateUserStatus = [
    (req, res) => {
        try {
            let password = req.query.password || utility.makePassword(10).toString();
            console.log(password);
            console.log(req.query);
            let { status, _id, requestFlag } = req.query;
            let query = {
                _id
            }
            let update = {
                $set: {}
            }
            status ? update.$set.status = status : true;
            console.log(query, update);
            userSchema.findOneAndUpdate(query, update, (err, result) => {
                if (err || !result) {
                    apiResponse.ErrorResponseWithData(res, statusMessage["SOME-THING-WENT-WRONG"], err)
                }
                else {
                    apiResponse.successResponse(res, statusMessage.UPDATED)
                    if (requestFlag && status == 'ACTIVE') {
                        userSchema.findOne({ _id }).select({ email: 1, firstName: 1, fullName: 1 }).exec((err, result) => {
                            // console.log(result);
                            utility.createHash(password, (hash) => {
                                // console.log('---------hash--------->>>>>', hash)
                                let query = {
                                    _id
                                }
                                let update = {
                                    $set: {
                                        password: hash
                                    }
                                }
                                userSchema.findOneAndUpdate(query, update).exec((error, update) => {
                                    // console.log(error, update);
                                })
                                mailer.sendCred(result.email, mailSubject.REGISTRATION_DONE, signupTemplate(result, password))
                            })
                        })
                    }
                }
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
/* updateUserlevel */
let updateUserlevel = [
    (req, res) => {
        try {
            console.log(req.query);
            let { status, _id, professionalLevel } = req.query;
            let query = {
                _id
            }
            let update = {
                $set: {}
            }
            status ? update.$set.status = status : true;
            professionalLevel ? update.$set.professionalLevel = professionalLevel : true;
            console.log(query, update);
            userSchema.findOneAndUpdate(query, update, (err, result) => {
                if (err || !result) {
                    apiResponse.ErrorResponseWithData(res, statusMessage["SOME-THING-WENT-WRONG"], err)
                }
                else {
                    apiResponse.successResponse(res, statusMessage.UPDATED)
                }
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
//login
let login = (req, res) => {
    const { email, password } = req.body;
    async.waterfall([
        (cb) => {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                cb(apiResponse.validationErrorWithData(res, "Validation Error.", errors.array()), null);
                return;
            }
            cb(null);
        },
        (cb) => {
            userSchema.findOne({ email: email.toLowerCase() }, (err, dbData) => {
                if (err || !dbData) {
                    cb(apiResponse.ErrorResponse(res, statusMessage.ADMIN_NOT_EXIST), null);
                } else {
                    cb(null, dbData);
                }
            })
        },
        (user, cb) => {
            if (!bcrypt.compareSync(password, user.password)) {
                return cb(apiResponse.ErrorResponse(res, statusMessage.WRONG_PASSWORD), null)
            }
            userSchema.findOneAndUpdate({ _id: user._id }, { token: utility.jwtEncode(user._id) }, { new: true }, (err, dbData) => {
                cb(null, apiResponse.successResponseWithData(res, statusMessage.success, dbData))
            })
        }
    ], (err, res) => { })
}
let updateMasterStatus = [
    (req, res) => {
        try {
            console.log(req.query);
            let { status, _id, type } = req.query;
            let query = {
                _id
            }
            let update = {
                $set: {}
            }
            status ? update.$set.status = status : true;
            console.log(query, update);
            if (type == '1') {
                myntCategoryModel.findOneAndUpdate(query, update, (err, result) => {
                    if (err || !result) {
                        apiResponse.ErrorResponseWithData(res, statusMessage["SOME-THING-WENT-WRONG"], err)
                    }
                    else {
                        apiResponse.successResponse(res, statusMessage.UPDATED)
                    }
                })
            } else {
                myntSubCategoryModel.findOneAndUpdate(query, update, (err, result) => {
                    if (err || !result) {
                        apiResponse.ErrorResponseWithData(res, statusMessage["SOME-THING-WENT-WRONG"], err)
                    }
                    else {
                        apiResponse.successResponse(res, statusMessage.UPDATED)
                    }
                })
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
//getCustomerCount
/**
 *
 * @param {*} req
 * @param {*} res
 */
let getUserCount = [
    (req, res) => {
        let userType = req.query.userType;
        console.log(userType);
        try {
            async.parallel({
                totalNumberOfCustomer: (cb) => {
                    let query = {
                        userType
                    }
                    console.log(query);
                    userSchema.find(query).count().exec((err, result) => {
                        cb(null, result)
                    })
                },
                loggedCustomer: (cb) => {
                    let query = {
                        userType,
                        token: { $ne: '' }
                    }
                    userSchema.find(query).count().exec((err, result) => {
                        cb(null, result)
                    })
                },
                activeCustomer: (cb) => {
                    let query = {
                        userType,
                        status: 'ACTIVE'
                    }
                    userSchema.find(query).count().exec((err, result) => {
                        cb(null, result)
                    })
                }
            }, (err, result) => {
                console.log(result);
                return apiResponse.successResponseWithData(res, statusMessage.success, result)
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
//getCustomerCount
/**
 *
 * @param {*} req
 * @param {*} res
 */
let getProfessionalListDetails =
    (req, res) => {
        console.log(req.query);
        let professionalId = req.query.professionalId;
        try {
            async.parallel({
                bookingAccepted: (cb) => {
                    let query = {
                        professionalId,
                        status: 'ACTIVE'
                    }
                    console.log(query);
                    myntBookModel.find(query).count().exec((err, result) => {
                        cb(null, result)
                    })
                },
                bookingCompleted: (cb) => {
                    let query = {
                        professionalId,
                        status: 'COMPLETED'
                    }
                    console.log(query);
                    myntBookModel.find(query).count().exec((err, result) => {
                        cb(null, result)
                    })
                },
                bookingCancel: (cb) => {
                    let query = {
                        professionalId,
                        status: 'CANCELLED'
                    }
                    myntBookModel.find(query).count().exec((err, result) => {
                        cb(null, result)
                    })
                },
                allBooking: (cb) => {
                    let query = [
                        { $match: { professionalId: mongoose.Types.ObjectId(professionalId) } },
                        {
                            $lookup: {
                                from: "myntSubCategory",
                                localField: "serviceId",    // field in the orders collection
                                foreignField: "_id",  // field in the items collection
                                as: "servicesInfo"
                            }
                        },
                        {
                            "$unwind": "$servicesInfo"
                        },
                        {
                            $lookup: {
                                from: "userSchema",
                                localField: "userId",    // field in the orders collection
                                foreignField: "_id",  // field in the items collection
                                as: "userInfo"
                            }
                        },
                        {
                            "$unwind": "$userInfo"
                        },
                    ]
                    myntBookModel.aggregate(query)
                        .exec((err, result) => {
                            cb(null, result)
                        })
                }
            }, (err, result) => {
                return apiResponse.successResponseWithData(res, statusMessage.success, result)
            })
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
//=========================================================================================
//-----------------------------------------------------------------


/****************  getFaq ************/
let getFaq = (req, res) => {
    const userId = req.headers.decoded_id;
    async.parallel({
        get: (cb) => {
            myntFaq.find().lean(true).exec((err, result) => {
                console.log("err", err);
                if (err || !result || result.length == 0) {
                    return apiResponse.successResponseWithData(res, statusMessage.success, [])
                }
                result  = result.map(ele => {
                    ele.answer = req.headers.lang ==='el'?ele.answer2 :ele.answer;
                    ele.question = req.headers.lang ==='el'?ele.question2 :ele.question;
                    return ele;
                })
                apiResponse.successResponseWithData(res, statusMessage.success, result)
            })
        }
    }, (err, result) => {
        if (result.get)
            return apiResponse.successResponseWithData(res, statusMessage.success, result.get)
    })
}


/****************  addFaq ************/
let addFaq = (req, res) => {
    const userId = req.headers.decoded_id;

    let temp = {
        title: req.body.title,
        description: req.body.description,
    }
    myntFaq.create(temp, (err, result) => {
        console.log(err, result);
        if (err || !result) {
            return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        }
        else {
            return apiResponse.successResponse(res, statusMessage.ADDED)
        }
 })
}


/************Feedback List API**************/
/**
 *
 * @param {*} date Apply Date Filter like "T" for Today, "M" for last Month, "W" or "C" for custom date
 * @param {*} startDate if date is custom then recieve startDate
 * @param {*} endDate if date is custom then recieve endDate
 * @param {*} length return number of documet
 * @param {*} start skip document
 */
const feedbackList = (req, res)  => {
    let start = Number(req.query.start) || 0;
    let length = Number(req.query.length) || 100;
    let Query = { userType :'PRO'};
    let startDate = new Date();
    let endDate = new Date();
    // use date filter like "Today","Week", "Month"
    if(req.query.date){
        if(req.query.date =='T') startDate = moment().startOf('day');
        else if(req.query.date =='W') startDate = moment().subtract(7,'d');
        else if(req.query.date =='M') startDate = moment().subtract(1,'month');
        else if(req.query.date =='Y') startDate = moment().subtract(1,'year');
        else if(req.query.date =='C') { 
            startDate = moment(req.query.startDate, 'DD-MM-YYYY')
            endDate= moment(req.query.endDate,'DD-MM-YYYY');
        }
        Query = { 
        ...Query, 
        ...{
            "reviewAndRating.createdAt": { $gte: new Date(startDate) , $lte: new Date(endDate)}
        }};
    }
    userSchema.aggregate([
        { $unwind: "$reviewAndRating"},
        { $lookup: { from: 'userSchema', localField: 'reviewAndRating.userId', foreignField: '_id', as: 'reviewAndRating.userId'}},
        { $unwind:  "$reviewAndRating.userId"},
        { $lookup: { from: 'myntBooking', localField: 'reviewAndRating.bookingId', foreignField: '_id', as: 'reviewAndRating.bookingId'}},
        { $unwind: "$reviewAndRating.bookingId"},
        { $lookup: { from: 'myntSubCategory', localField: 'reviewAndRating.bookingId.serviceId', foreignField: '_id', as: 'reviewAndRating.bookingId.serviceId'}},
        // { $unwind: "$reviewAndRating.bookingId.serviceId"},
        { $match: Query }, //query
        //group by id to combine  rating into signle array of object 
        { $group : { 
            _id: "$_id", 
            rating : {  $avg : { $toInt: "$reviewAndRating.rating"}} ,
            review : { $push : "$reviewAndRating"},
            fullName: { $first : "$fullName"},
            userName : { $first : "$userName"},
            firstName: { $first : "$firstName"},
            lastName: { $first : "$lastName"},
            image: {$first: "$image"}
        }},
        //select Fields 
        { $project: {
            rating : { $ifNull: [ "$rating", 0 ]}, //check if avarage null, replace with 0
            review : { 
                userId: {
                    fullName : 1,
                    userName : 1,
                    firstName: 1,
                    lastName: 1,
                    image:1
                },
                bookingId: {
                    serviceId: 1,
                    timeSlot: 1,
                    totalFee: 1,
                    time:1
                },
                rating: 1,
                review: 1,
                status: 1,
                createdAt:1,
                updatedAt: 1
            },
            fullName : 1,
            userName : 1,
            firstName: 1,
            lastName: 1,
            image: 1
            
        }},
        // { $skip: start },
        // { $limit: length },
    ])
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });

}

/************Credit & Rewards List API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const getCreditList = (req, res)  => {
    rewardPointSchema.find().lean()
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });
}


/************Add Credit & Rewards API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const addCredit = (req, res)  => {
    let credit = new rewardPointSchema(req.body);
    credit.save((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponse(res, statusMessage.ADDED)
    });
}


/************Update Credit & Rewards API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const updateCredit = (req, res)  => {
    let id = req.params.id;
    rewardPointSchema.findByIdAndUpdate(id, { $set: req.body }, (err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponseWithData(res, statusMessage.UPDATED, data)
    });
}

/************Delete Credit & Rewards API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} param id
 */
 const deleteCredit = (req, res)  => {
    let id = req.params.id;
    rewardPointSchema.findByIdAndDelete(id).exec((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, 'Something went wrong', err)
        return apiResponse.successResponseWithData(res, statusMessage.DELETED, data)
    });
}

/************Add/Create SubAdmin API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const addSubAdmin = (req, res)  => {
    let form = new userSchema(req.body);
    let password = '123456';
    utility.createHash(password, (hash)=>{
        form.userType= "SUB_ADMIN";
        form.password = hash
        form.save((err, data) => {
            if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
            /*===================================send Mail to user ===================== */	
            mailer.sendCred(req.body.email, 'Congratulation! Account Created | MYNT', `Hello ${data.fullName},<br /> Your team has invite you to join the MYNT ADMMIN. Use the following credential to login.<br /> Email: ${data.email}<br/> Password: 123456`);
            /*===================================send Mail to user ===================== */
            return apiResponse.successResponse(res, statusMessage.ADDED)
        });
    });
}

/************SubAdmin List API**************/
/**
 *
 * @param {*} date Apply Date Filter like "T" for Today, "M" for last Month, "W" or "C" for custom date
 * @param {*} startDate if date is custom then recieve startDate
 * @param {*} endDate if date is custom then recieve endDate
 * @param {*} length return number of documet
 * @param {*} start skip document
 */
 const subAdminList = (req, res)  => {
    let start = Number(req.query.start) || 0;
    let length = Number(req.query.length) || 100;
    let Query = { userType :'SUB_ADMIN'};
    let startDate = new Date();
    let endDate = new Date();
    // use date filter like "Today","Week", "Month"
    if(req.query.date){
        if(req.query.date =='T') startDate = moment().startOf('day');
        else if(req.query.date =='W') startDate = moment().subtract(7,'d');
        else if(req.query.date =='M') startDate = moment().subtract(1,'month');
        else if(req.query.date =='Y') startDate = moment().subtract(1,'year');
        else if(req.query.date =='C') { 
            startDate = moment(req.query.startDate, 'DD-MM-YYYY')
            endDate= moment(req.query.endDate,'DD-MM-YYYY');
        }
        Query = { 
        ...Query, 
        ...{
            "reviewAndRating.createdAt": { $gte: new Date(startDate) , $lte: new Date(endDate)}
        }};
    }
    userSchema.find(Query).lean()
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });

}

/************Update SubAdmin API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const updateSubAdmin = (req, res)  => {
    let id = req.params.id;
    userSchema.findByIdAndUpdate(id, { $set: req.body }, (err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponseWithData(res, statusMessage.UPDATED, data)
    });
}

/************Delete SubAdmin API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} param id
 */
 const deleteSubAdmin = (req, res)  => {
    let id = req.params.id;
    userSchema.findByIdAndDelete(id).exec((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, 'Something went wrong', err)
        return apiResponse.successResponseWithData(res, statusMessage.DELETED, data)
    });
}



/************Add/Create Tutorial Help API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const addTutorialHelp = (req, res)  => {
    let form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 * 100 }); //setting max size of image to 1000MB
    form.parse(req, (err, fields, files) => {
        let extention = path.extname(files.file[0].originalFilename)
        let allowedVideo = ['.mp4','.mov','.wmv','.avi','.webm'];
        if(allowedVideo.indexOf(extention)> -1){
            utility.uploadVideoIntoCloudinary(files.file, (err, image) => {
                if(err) return apiResponse.ErrorResponseWithData(res, 'Error While Uploading Video', err)
                let formData = {
                    videoLink: image[0],
                    thumbnail:image[0],
                    userType:fields.userType[0],
                };
                const tutorialHelpM = new tutorialHelpModel(formData);
                tutorialHelpM.save((err, data)=>{
                    if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
                    return apiResponse.successResponse(res, statusMessage.ADDED)
                })
            })
        }else{
            return apiResponse.ErrorResponseWithData(res, 'Only video format is allowed to upload', allowedVideo)
        }
    })
}



/************Tutorial Help List API**************/

 const tutorialHelpList = (req, res)  => {
    let userType = req.query.userType;
    let query = {}; 
    if(userType){
        query = {userType:userType}
    }
    tutorialHelpModel.find(query).lean()
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, err)
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });

}

/************Delete tutorial Help API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} param id
 */
 const deleteTutorialHelp = (req, res)  => {
    let id = req.params.id;
    tutorialHelpModel.findByIdAndDelete(id).exec((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, 'Something went wrong', err)
        return apiResponse.successResponseWithData(res, statusMessage.DELETED, data)
    });
}

/************Update Tutorial Help API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const updateTutorialHelp = (req, res)  => {
    let id = req.params.id;
    let form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 * 100 }); //setting max size of image to 1000MB
    form.parse(req, (err, fields, files) => {
        if(files && files.file && files.file.length > 0){
            let extention = path.extname(files.file[0].originalFilename)
            let allowedVideo = ['.mp4','.mov','.wmv','.avi','.webm'];
            if(allowedVideo.indexOf(extention)> -1){
                utility.uploadVideoIntoCloudinary(files.file, (err, image) => {
                    if(err) return apiResponse.ErrorResponseWithData(res, 'Error While Uploading Video', err)
                    let formData = {
                        videoLink: image[0],
                        thumbnail:image[0]
                    };
                    if(fields.userType && fields.userType[0]){
                        formData.userType = fields.userType[0];
                    }
                    if(fields.status && fields.status[0]){
                        formData.status = fields.status[0];
                    }
                    tutorialHelpModel.findByIdAndUpdate(id, { $set: formData }, (err, data) => {
                        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
                        return apiResponse.successResponseWithData(res, statusMessage.UPDATED, data)
                    });
                })
            }else{
                return apiResponse.ErrorResponseWithData(res, 'Only video format is allowed to upload', allowedVideo)
            }
        }else{
            let formData = { };
            if(fields.userType && fields.userType[0]){
                formData.userType = fields.userType[0];
            }
            if(fields.status && fields.status[0]){
                formData.status = fields.status[0];
            }
            tutorialHelpModel.findByIdAndUpdate(id, { $set: formData }, (err, data) => {
                if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
                return apiResponse.successResponseWithData(res, statusMessage.UPDATED, data)
            });     
        }
    })
}



/************Faq List API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} userType userType PRO, USER
 */
 const getFaqList = (req, res)  => {
    let userType = req.query.userType;
    let query = {}; 
    if(userType){
        query = {userType:userType}
    }
    myntFaq.find(query).lean()
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });
}


/************Add Faq API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const addFaqList = (req, res)  => {
    let faq = new myntFaq(req.body);
    faq.save((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponse(res, statusMessage.ADDED)
    });
}


/************Update Faq API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const updateFaqList = (req, res)  => {
    let id = req.params.id;
    myntFaq.findByIdAndUpdate(id, { $set: req.body }, (err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponseWithData(res, statusMessage.UPDATED, data)
    });
}

/************Delete Faq API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} param id
 */
 const deleteFaqList = (req, res)  => {
    let id = req.params.id;
    myntFaq.findByIdAndDelete(id).exec((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, 'Something went wrong', err)
        return apiResponse.successResponseWithData(res, statusMessage.DELETED, data)
    });
}

/************Update Settings API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const updateSetting = (req, res)  => {
    let id = req.params.id;
    myntSettingModel.findOne({_id: id }).lean().exec((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, 'No Data Exist', err)
        let updateData = data;
        if(req.body.bookingAmount){updateData.bookingAmount = req.body.bookingAmount}
        if(req.body.sender){updateData.referAndEarn.sender = req.body.sender}
        if(req.body.receiver){updateData.referAndEarn.receiver = req.body.receiver}
        if(req.body.status){updateData.status= req.body.status}
        myntSettingModel.findByIdAndUpdate(id, { $set: updateData }, (err, data) => {
            if(err) return apiResponse.ErrorResponseWithData(res, 'Error while updating', err)
            return apiResponse.successResponseWithData(res, statusMessage.UPDATED, data)
        });
    })
}


/************Mynt Setting API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const getMyntSetting = (req, res)  => {
    myntSettingModel.find().lean()
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });
}

/************Mynt Gift Card API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const getGiftCard = (req, res)  => {
    myntGiftCardModel.find().lean()
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });
}

/************Add Gift Card API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const addGiftCard = (req, res)  => {
    let gift = new myntGiftCardModel(req.body);
    gift.save((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponse(res, statusMessage.ADDED)
    });
}


/************Update Gift Card API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const updateGiftCard = (req, res)  => {
    let id = req.params.id;
    myntGiftCardModel.findByIdAndUpdate(id, { $set: req.body }, (err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponseWithData(res, statusMessage.UPDATED, data)
    });
}

/************Delete Gift Card API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} param id
 */
 const deleteGiftCard = (req, res)  => {
    let id = req.params.id;
    myntGiftCardModel.findByIdAndDelete(id).exec((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, 'Something went wrong', err)
        return apiResponse.successResponseWithData(res, statusMessage.DELETED, data)
    });
}



/************Mynt CMS Page API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const getCmsPage = (req, res)  => {
    myntCmsPageModel.find().lean()
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });
}

/************Add CMS Page API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const addCmsPage = (req, res)  => {
    let page = new myntCmsPageModel(req.body);
    page.save((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponse(res, statusMessage.ADDED)
    });
}


/************Update CMS Page API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} body request body data
 */
 const updateCmsPage = (req, res)  => {
    let id = req.params.id;
    myntCmsPageModel.findByIdAndUpdate(id, { $set: req.body }, (err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, statusMessage["Validation Error"], err)
        return apiResponse.successResponseWithData(res, statusMessage.UPDATED, data)
    });
}

/************Delete CMS Page API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} param id
 */
 const deleteCmsPage = (req, res)  => {
    let id = req.params.id;
    myntCmsPageModel.findByIdAndDelete(id).exec((err, data) => {
        if(err) return apiResponse.ErrorResponseWithData(res, 'Something went wrong', err)
        return apiResponse.successResponseWithData(res, statusMessage.DELETED, data)
    });
}


/************Mynt PhotoShoot API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const getPhotoShoot = (req, res)  => {
    myntPhotoShootModel.find()
    .populate([{ path: 'userId', model:'userSchema', select:'fullName phone countryCode'}])
    .lean()
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });
}

/************Mynt contact API**************/
/**
 *
 * @param {*} req express request object
 * @param {*} res express response object
 */
 const getContact = (req, res)  => {
     let query = {};
     if(req.query && req.query.userType){
        query = { 'userId.userType': req.query.userType}
     }
    myntContactModel.aggregate([
        { $lookup : { from:'userSchema' ,localField: 'userId', foreignField: '_id' , as: 'userId'}},
        { $unwind: '$userId'},
        { $match: query},
        { $project : {
            createdAt:1,
            email: 1,
            firstName: 1,
            image:1,
            lastName: 1,
            message: 1,
            status:1,
            updatedAt: 1,
            userId: {
                userType:1,
                fullName:1,
                firstName:1,
                lastName:1
            }
        }}
    ])
    .exec((err, data) => {
        if(err) return apiResponse.successResponseWithData(res, statusMessage.success, [])
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    });
}

/***********FORGET PASSWORD SEND LINK TO EMAIL***************
 * @method post
 * @param {*} req express request object
 * @param {*} res express response object
 * @body email
 * @return string success 
 */
 const forgetPassword = async(req, res)  => {
    try{
        let { email } = req.body;
        let user = await userSchema.findOne({email: email, userType:{ $in:['ADMIN','SUB_ADMIN']}}).lean().exec();
        if(!user) throw new Error('Email does not exist in our record.')
        let randomString = utility.makePassword(50).toString();
        let timeStamp  = moment().add(1, 'd').format();
        let updateData = { $set: { resetPasswordCode: randomString, resetPasswordExpiry : timeStamp }};
        userSchema.findByIdAndUpdate(user._id,updateData).exec((err,data) =>{
            if(err) throw new Error(err);
            //send email to with reset link;
            let Url  = process.env.APP_URL+'/#/login/change-password/'+randomString; 
            mailer.sendCred(email, 'Reset Password | MYNT', forgotPasswordEmailTemp({name: user.fullName, url: Url}));
            return apiResponse.successResponse(res, 'We have sent you a reset link on your Email. Please check your email to reset Password');
        }); 
    }catch(e){
        return apiResponse.ErrorResponse(res, e.message || e);
    }
 }
/****************************END***************************/

/***********CHANGE PASSWORD ***************
 * @method post
 * @param {*} req express request object
 * @param {*} res express response object
 * @body { newpsw, resetPasswordCode }
 * @return string success 
 */
 const changePassword = async(req, res)  => {
    try{
        let currentDate = moment().startOf('days');
        let { newpsw, resetPasswordCode } = req.body;
        let user = await userSchema.findOne({resetPasswordCode: resetPasswordCode}).lean().exec();
        if(!user) throw new Error('Your link is expired');
        console.log(currentDate.isAfter(moment(new Date(user.resetPasswordExpiry)).startOf('days'), 'd'));
        if(currentDate.isAfter(moment(new Date(user.resetPasswordExpiry)).startOf('days'), 'd')){
            throw new Error('Your link is expired');
        }
        utility.createHash(newpsw,(hash) =>{
            let timeStamp  = moment().subtract(1, 'd').format();
            let updateData = { $set: { password : hash, resetPasswordCode: hash, resetPasswordExpiry : timeStamp }};
            userSchema.findByIdAndUpdate(user._id,updateData).exec((err,data) =>{
                if(err) throw new Error(err);
                return apiResponse.successResponse(res, 'Your Password has been successfully changes.');
            }); 
        })
    }catch(e){
        return apiResponse.ErrorResponse(res, 'Your link is expired');
    }
 }
/****************************END***************************/

/***********Get Professional List ***************
 * @method get
 * @params { userType, status, searchText, page, limit}
 * @return {object} 
 */
const getProfessionalList = (req, res) => {
    let query = {};
    let sort  = { _id: -1};
    let start = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 50;
    let startDate = req.query.startDate;
    let endDate= req.query.endDate;
    let searchText = req.query.searchText;
	  start = (start - 1) * limit;
    if(req.query.userType) query.userType = req.query.userType;
    if(req.query.status) query.status     = { $in: req.query.status};
    if(startDate && endDate){
        query.createdAt =  { $gte: new Date(moment(startDate, 'DD-MM-YYYY').startOf('d')), $lte: new Date(moment(endDate,'DD-MM-YYYY').endOf('d'))}
    }
    if(searchText) {
        let searchQ = {
            $or: [
                { 'email': { $regex: searchText, $options: "sim" } },
                { 'phone': { $regex: searchText, $options: "sim" } },
                { 'firstName': { $regex: searchText, $options: "sim" } },
                { 'lastName': { $regex: searchText, $options: "sim" } },
            ]
        };
        query = { ...query, ...searchQ };
    }
    let promiseArray = [
        userSchema.find(query).populate('position').sort(sort).skip(start).limit(limit).lean().exec(),
        userSchema.find(query).countDocuments()
    ];
    Promise.all(promiseArray).then(data => {
        return apiResponse.successResponseWithData(res, statusMessage.success, data)
    }).catch(err => {
        return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR)    
    });
}
/**********************************END****************************/

/***********Get Professional List ***************
 * @method get
 * @params { id}
 * @return {object} 
 */
 const getProfessionalById = (req, res) => {
  let query = {_id : req.query.id};
  userSchema.findOne(query).populate('position').lean().exec((err, data) =>{
    if(err || !data) return apiResponse.ErrorResponse(res, statusMessage.DB_ERROR)  
    let rating = data.reviewAndRating.map(ele => Number(ele.rating));
    data.rating = rating.reduce((a, b)=> a + b, 0)/rating.length|| '0';
    data.rating = Number(data.rating).toFixed(1);
    return apiResponse.successResponseWithData(res, statusMessage.success, data)
  })
}
/**********************************END****************************/


/***********Get Professional List ***************
 * @method get
 * @params {proId, status, searchText, page, limit}
 * @return {object} 
 */
 const getProfessionalBooking = (req, res) => {
  let query = { professionalId : mongoose.Types.ObjectId(req.query.proId)};
  let sort  = { _id: -1};
  let start = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 50;
  let startDate = req.query.startDate;
  let endDate= req.query.endDate;
  let searchText = req.query.searchText;
  start = (start - 1) * limit;
  if(req.query.status) query.status     = { $in: req.query.status};
  if(startDate && endDate){
      query.createdAt =  { $gte: new Date(moment(startDate, 'DD-MM-YYYY').startOf('d')), $lte: new Date(moment(endDate,'DD-MM-YYYY').endOf('d'))}
  }
  if(searchText) {
      let searchQ = {
          $or: [
              { 'userId.fullName': { $regex: searchText, $options: "sim" } }
          ]
      };
      query = { ...query, ...searchQ };
  }
  let promiseArray = [
      myntBookModel.aggregate([
        {$lookup: { from: 'myntSubCategory', localField:'serviceId', foreignField:'_id', as: 'serviceId'}},
        {$lookup: { from: 'userSchema', localField:'userId', foreignField:'_id', as: 'userId'}},
        {$unwind: "$userId"},
        {$match: query},
        {$sort: sort},
        {$skip: start},
        {$limit: limit}
      ]).exec(),
      myntBookModel.aggregate([
        {$lookup: { from: 'myntSubCategory', localField:'serviceId', foreignField:'_id', as: 'serviceId'}},
        {$lookup: { from: 'userSchema', localField:'userId', foreignField:'_id', as: 'userId'}},
        {$unwind: "$userId"},
        {$match: query},
        {$count: 'count'}
      ]).exec()
  ];
  Promise.all(promiseArray).then(data => {
      data[1] =  data[1] && data[1][0] && data[1][0].count? data[1][0].count: 0;
      return apiResponse.successResponseWithData(res, statusMessage.success, data)
  }).catch(err => {
        return apiResponse.ErrorResponse(res, 'Something went wrong')    
  });
}
/**********************************END****************************/

const testEmail = (req, res)  => {
    let mail = req.query.email || 'nasirkamal61@gmail.com';
    mailer.sendCred(mail, mailSubject.REGISTRATION_DONE, signupTemplate({fullName:'Nasir Kamal'}, '123456'))
    return res.json({status: true,message:'Successfully Sent'});
    // mailer.sendEmail('nasirkamal61@gmail.com', mailSubject.REGISTRATION_DONE, signupTemplate({fullName:'Nasir Kamal'}, '123456'))
}
module.exports = {
    /* mynt start here */
    addCategory,
    editCategory,
    categoryList,
    updateSubCategory,
    getUserList,
    updateUserStatus,
    updateUserlevel,
    login: login,
    updateMasterStatus: updateMasterStatus,
    getServices: getServices,
    getWeddingList: getWeddingList,
    updateWeddingstatus: updateWeddingstatus,
    getBookingServies: getBookingServies,
    updateBookingstatus: updateBookingstatus,
    getUserCount: getUserCount,
    getProfessionalListDetails: getProfessionalListDetails,
    getFaq:getFaq,
    addFaq:addFaq,
    getFeedbackList: feedbackList,
    getCreditList:getCreditList,
    addCredit: addCredit,
    updateCredit: updateCredit,
    deleteCredit:deleteCredit,
    addSubAdmin:addSubAdmin,
    subAdminList:subAdminList,
    updateSubAdmin:updateSubAdmin,
    deleteSubAdmin:deleteSubAdmin,
    addTutorialHelp:addTutorialHelp,
    tutorialHelpList:tutorialHelpList,
    deleteTutorialHelp:deleteTutorialHelp,
    updateTutorialHelp:updateTutorialHelp,
    getFaqList:getFaqList,
    addFaqList: addFaqList,
    updateFaqList: updateFaqList,
    deleteFaqList:deleteFaqList,
    updateSetting:updateSetting,
    getMyntSetting:getMyntSetting,
    getGiftCard:getGiftCard,
    addGiftCard: addGiftCard,
    updateGiftCard: updateGiftCard,
    deleteGiftCard: deleteGiftCard,
    getCmsPage:getCmsPage,
    updateCmsPage: updateCmsPage,
    addCmsPage:addCmsPage,
    deleteCmsPage:deleteCmsPage,
    getPhotoShoot:getPhotoShoot,
    getContact:getContact,
    forgetPassword:forgetPassword,
    changePassword :changePassword,
    testEmail:testEmail,
    getProfessionalList:getProfessionalList,
    getProfessionalById: getProfessionalById,
    getProfessionalBooking: getProfessionalBooking

}
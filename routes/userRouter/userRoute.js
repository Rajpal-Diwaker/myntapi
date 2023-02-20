const express = require("express");
const userService = require("../../controllers/userController/userService");
const validation = require("../../validation/userValidation");
const authUser = require("../../middlewares/authenticate").authUser;
const consessiveAuth = require("../../middlewares/authenticate").consessiveAuth;
// const activityLog = require("../../middlewares/userActivityLog")


const router = express.Router();
router.post("/register", validation.register, userService.register);
router.post("/socialSignup",validation.socialSignup, userService.socialSignup);
router.post("/addAddress",authUser,validation.addAddress ,userService.addAddress);
router.post("/login", userService.login);
router.post("/verifyOpt",authUser, validation.verfiyOtp, userService.verifyOpt); /* not in use now */
router.get("/resendOtp",authUser, userService.resendOtp);/* not in use now */
router.put("/updateAddress/:addressId",authUser, userService.editAddress);
router.post("/updateAddress",authUser, userService.editAddress);
router.get("/getServices",authUser, userService.getServices);
router.put("/updateFavList",authUser, userService.updateFavList);
router.post("/updateFavList",authUser, userService.updateFavList);
router.get("/getProfessionalList",authUser, userService.getProfessionalList); // for normal case
router.get("/getLevels", userService.getLevels);
router.get("/getTime", userService.getTime);
router.post("/createWeddingEnquiry",authUser, userService.createWeddingEnquiry);
router.post("/bookServices",authUser, userService.bookServices);
router.get("/getBookingDetail",authUser, userService.getBookingDetail);
router.get("/getBookingList",authUser, userService.getBookingList);
router.get("/getFavProfessionalList",authUser, userService.getFavProfessionalList); // for Specfic case
router.post("/updateUserStatus",authUser, userService.updateUserStatus);
router.post("/editProfile",authUser, userService.editProfile);
router.get("/getReward",authUser, userService.getReward);
router.get("/getGiftCard",authUser, userService.getGiftCard);
router.post("/sendGiftCard",authUser,validation.sendGiftCard, userService.sendGiftCard);

// ******** created by Rajpal Start****************//
router.post("/contactUs",authUser, userService.contactUs);
router.post("/updateBookingStatus",authUser, userService.updateBookingStatus);
router.post("/updateReview",authUser, userService.updateReview);
router.post("/photoShootEnquiry",authUser, userService.photoShootEnquiry);
router.post("/logout",authUser, userService.logout);
router.post("/updateStatus",authUser, userService.updateStatus);
router.get("/helpVideo",authUser, userService.helpVideo);
router.get("/getReferCode",authUser, userService.getReferCode);
router.get("/getFaq",authUser, userService.getFaq);
router.get("/getNotificationList",authUser, userService.getNotificationList);
router.get("/feedbackList", authUser, userService.feedbackList);
router.post("/becomeMyntPro", userService.becomeMyntPro);
router.post("/updateDeviceToken",authUser, userService.updateDeviceToken);
router.post("/notificationTest", userService.notificationTest);
router.get("/sendServiceRequestProfessional",authUser, userService.sendServiceRequestProfessional);
router.post("/blockProfessional5Min",authUser, userService.blockProfessional5Min);
router.post("/getblockProfessionallist",authUser, userService.getblockProfessionallist);
router.get("/upcomingAppointmentNotification",userService.upcomingAppointmentNotification);
router.post("/cancelBookingRefund",authUser, userService.cancelBookingRefund);

router.post("/saveCard",authUser, userService.saveCard);
router.post("/removeCard",authUser, userService.removeCard);
router.get("/getCard",authUser, userService.getCard);
router.post("/calculateAmount", authUser,  validation.calculateAmount, userService.calculateAmount);
router.get("/getUserWallet",authUser, userService.getUserWallet);
router.get("/getWalletTransactionHistory",authUser, userService.getWalletTransactionHistory);
router.get("/cmsPage", userService.getCmsPage);
router.post("/updateLanguage",authUser, userService.updateLanguage);

router.post("/pTest", authUser, userService.pTest);
router.post("/rajpal",userService.rajpal);
router.get("/tempAPI",userService.tempAPI);

module.exports = router;





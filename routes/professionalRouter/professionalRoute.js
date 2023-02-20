const express = require("express");
const proService = require("../../controllers/professionalController/proService");
const validation = require("../../validation/userValidation");
const authUser = require("../../middlewares/authenticate").authUser;
// const activityLog = require("../../middlewares/userActivityLog")
const router = express.Router();
// router.post("/register", validation.register, proService.register);
router.post("/socialSignup", proService.socialSignup);
router.post("/addAddress", authUser, validation.addAddress, proService.addAddress);
router.post("/login", proService.login);
router.put("/updateAddress/:addressId", authUser, proService.editAddress);
router.get("/getServices", proService.getServices);
router.put("/updateFavList", authUser, proService.updateFavList);
router.get("/getProfessionalList", proService.getProfessionalList);
router.post("/createWeddingEnquiry", authUser, proService.createWeddingEnquiry);
router.get("/myBooking", authUser, proService.myBooking);
router.post("/signup", proService.signup);
router.get("/getBookingDetail", authUser, proService.getBookingDetail);
router.post("/editProfile", authUser, proService.editProfile);
router.post("/updateBookingStatus",authUser, proService.updateBookingStatus);
router.post("/updateTimeSlot",authUser, proService.updateTimeSlot);
router.post("/updateStatus",authUser, proService.updateStatus);

// ******** created by Rajpal Start****************//
router.get("/getFaq",authUser, proService.getFaq);
router.get("/bookingHistory", authUser, proService.bookingHistory);
router.get("/feedbackList", authUser, proService.feedbackList);
router.post("/setMyCalender", authUser, proService.setMyCalender);
router.get("/getMyCalender", authUser, proService.getMyCalender);
router.get("/viewMyCalender", authUser, proService.viewMyCalender);
router.post("/resetMyCalenderSlot", authUser, proService.resetMyCalenderSlot);
router.post("/removeMyCalender", authUser, proService.removeMyCalender);
router.get("/getNotificationList",authUser, proService.getNotificationList);
router.get("/logout",authUser, proService.logout);
router.post("/contactUs",authUser, proService.contactUs);
router.post("/updateDeviceToken",authUser, proService.updateDeviceToken);
router.get("/helpVideo",authUser, proService.helpVideo);
router.post("/changePassword",authUser, proService.changePassword);
router.get("/serviceRequest", authUser, proService.serviceRequest);
router.post("/deleteImage", authUser, proService.deleteImage);
router.get("/AddOneMoreDaysToCalender", authUser, proService.AddOneMoreDaysToCalender);
router.get("/cmsPage", proService.getCmsPage);
router.post("/bookingCompletionCode",authUser, proService.bookingCompletionCode);
router.post("/updateLanguage",authUser, proService.updateLanguage);



module.exports = router;
var express = require("express");
var path = require('path');
const adminServices = require("../../controllers/adminController/adminServices");
const validation = require('../../validation/adminValidation');
const auth = require("../../middlewares/authenticate").authAdmin;
var router = express.Router();
const multer = require("multer");
const excelFilter = (req, file, cb) => {
  console.log("FFFFFFFFFFFf", file)
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("FFFFFFFFFFFfdddddd", file)
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
/* mynt start here */
router.post("/addCategory", adminServices.addCategory);
router.post("/login", validation.login, adminServices.login);
router.put("/editCategory/:categoryId", adminServices.editCategory);
router.get("/categoryList", adminServices.categoryList);
router.get("/getServices", adminServices.getServices);
router.post("/updateSubcategory", adminServices.updateSubCategory);
router.get("/getUserList", adminServices.getUserList);
router.put("/updateUserStatus", adminServices.updateUserStatus);
router.put("/updateMasterStatus", adminServices.updateMasterStatus);
router.put("/updateUserlevel", adminServices.updateUserlevel);
router.put("/updateWeddingstatus", adminServices.updateWeddingstatus);
router.get("/getWeddingList", adminServices.getWeddingList);
router.put("/updateBookingstatus", adminServices.updateBookingstatus);
router.get("/getBookingServies", adminServices.getBookingServies);
router.get("/getUserCount", adminServices.getUserCount);
router.get("/getProfessionalListDetails", adminServices.getProfessionalListDetails);
router.get("/getFaq", adminServices.getFaq);
router.post("/addFaq", adminServices.addFaq);
router.get("/feedbackList", auth,  adminServices.getFeedbackList);
router.get("/credit", auth,  adminServices.getCreditList);
router.post("/credit", auth,  validation.addCredit, adminServices.addCredit);
router.put("/credit/:id", auth, validation.updateCredit, adminServices.updateCredit);
router.delete("/credit/:id",auth , adminServices.deleteCredit);
router.post("/subAdmin",  auth, validation.addSubAdmin, adminServices.addSubAdmin);
router.get("/subAdmin", auth, adminServices.subAdminList);
router.put("/subAdmin/:id",  auth, validation.updateSubAdmin, adminServices.updateSubAdmin);
router.delete("/subAdmin/:id", auth, adminServices.deleteSubAdmin);

router.post("/tutorialHelp", auth,  adminServices.addTutorialHelp);
router.get("/tutorialHelp", auth , adminServices.tutorialHelpList);
router.put("/tutorialHelp/:id", auth, adminServices.updateTutorialHelp);
router.delete("/tutorialHelp/:id", auth, adminServices.deleteTutorialHelp);

router.get("/faqList",   auth, adminServices.getFaqList);
router.post("/faqList",   auth , validation.addFaqList, adminServices.addFaqList);
router.put("/faqList/:id", auth, validation.updateFaqList, adminServices.updateFaqList);
router.delete("/faqList/:id", auth, adminServices.deleteFaqList);

router.get("/myntSetting", auth, adminServices.getMyntSetting);
router.put("/myntSetting/:id", auth, adminServices.updateSetting);

router.get("/giftCard", auth,   adminServices.getGiftCard);
router.post("/giftCard",  auth, validation.addGiftCard, adminServices.addGiftCard);
router.put("/giftCard/:id", auth, validation.updateGiftCard, adminServices.updateGiftCard);
router.delete("/giftCard/:id",auth, adminServices.deleteFaqList);

router.get("/cmsPage",  auth,  adminServices.getCmsPage);
router.post("/cmsPage",  auth, validation.addCmsPage, adminServices.addCmsPage);
router.put("/cmsPage/:id",auth, validation.updateCmsPage, adminServices.updateCmsPage);
router.delete("/cmsPage/:id", auth,adminServices.deleteCmsPage);

router.get("/photoShoot",  auth,  adminServices.getPhotoShoot);
router.get("/contact",  adminServices.getContact);

router.post("/forgetPassword", validation.forgetPassword, adminServices.forgetPassword);
router.post("/changePassword", validation.changePassword, adminServices.changePassword);

router.get("/getProfessionalList", auth, adminServices.getProfessionalList)
router.get("/getProfessionalById", auth, adminServices.getProfessionalById)
router.get("/getProfessionalBooking", auth, adminServices.getProfessionalBooking)
router.get("/testEmail",    adminServices.testEmail);
/* mynt end here */
module.exports = router;
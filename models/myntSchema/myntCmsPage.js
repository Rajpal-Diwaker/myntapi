let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntCmsPage = new Schema({
    title: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    title2: {
        type: String,
        default: ''
    },
    text2: {
        type: String,
        default: ''
    },
    textCode: {
      type: String,
      default: Math.floor(Math.random() * (100 - 0 + 1))
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },
    userType: {
      type: String,
      enum: ["USER", "PRO"],
      default: "USER"
  }
}, { timestamps: true });
let model = mongoose.model("myntCmsPage", myntCmsPage, "myntCmsPage");
module.exports = model;

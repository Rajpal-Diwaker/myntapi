let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntFaq = new Schema({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    question: {
        type: String,
        default: ''
    },
    answer: {
        type: String,
        default: ''
    },
    title2: {
        type: String,
        default: ''
    },
    description2: {
        type: String,
        default: ''
    },
    question2: {
        type: String,
        default: ''
    },
    answer2: {
        type: String,
        default: ''
    },
    userType: {
        type: String,
        enum: ['USER', 'PRO'],
        uppercase: true,
        default: "USER"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("myntFaq", myntFaq, "myntFaq");
module.exports = model;
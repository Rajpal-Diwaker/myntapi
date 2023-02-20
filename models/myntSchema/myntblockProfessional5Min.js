let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntblockProfessional5Min = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    serviceId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myntSubCategory',
        default: null
    }],
    // date: {
    //     type: Date,
    //     default: Date
    // },
    date: {
        type: String,
        default: ''
    },
    timeSlot: {
        type: String,
        default: ''
    },
    expireDate: {
        type: Date,
        default: ""
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        uppercase: true,
        default: "ACTIVE"
    },
}, { timestamps: true });
let model = mongoose.model("myntblockProfessional5Min", myntblockProfessional5Min, "myntblockProfessional5Min");
module.exports = model;
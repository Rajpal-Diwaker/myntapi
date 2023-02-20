let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let notification = new Schema({
    type: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    description: {
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
    // userId: {
    //     type: String,
    //     default: ''
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    proId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myntBooking',
        default: null
    },
    deviceId: {
        type: String,
        default: ''
    },
    deviceType: {
        type: String,
        default: ''
    },
    sendStatus: {
        type: Number,
        default: 0
    },
    isRead: {
        type: Number,
        default: 0
    },
    userType: {
        type: String,
        enum: ["USER", "PRO", "ADMIN"],
        default: "USER"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("notification", notification, "notification");
module.exports = model;
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let proFeedback = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myntBooking',
        default: null
    },
    proId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    rating: {
        type: String,
        default: '0',
    },
    review: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("proFeedback", proFeedback, "proFeedback");
module.exports = model;

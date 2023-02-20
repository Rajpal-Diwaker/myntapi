let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let photoRequest = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    email: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    countryCode: {
        type: String,
        default: "+91"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("photoRequest", photoRequest, "photoRequest");
module.exports = model;
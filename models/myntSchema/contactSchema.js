let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let contactSchema = new Schema({
    firstName: {
        type: String,
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    image: {
        type: Array,
        default: []
    },
    phone: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("contactSchema", contactSchema, "contactSchema");
module.exports = model;

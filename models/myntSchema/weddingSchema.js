let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntWeddingSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema'
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    countryCode: {
        type: String,
        default: '+91'
    },
    interestedServices:{
        type: String,
        default: ''
    },
    services: {
        type: String,
        default: ''
    },
    weddingDate: {
        type: String,
        default: ''
    },
    location: {
        flatNo: {
            type: String,
            default: "Point"
        },
        address: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        zipcode: {
            type: String,
            default: ""
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    pricingEvent: {
        type: String,
        default: ''
    },
    specialRequest: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("myntWeddingSchema", myntWeddingSchema, "myntWeddingSchema");
module.exports = model;
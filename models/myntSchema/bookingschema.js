let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntBooking = new Schema({
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
    serviceInfo: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date
    },
    timeSlot: {
        type: String,
        default: ''
    },
    serviceFee: {
        type: String,
        default: ''
    },
    totalFee: {
        type: String,
        default: ''
    },
    appointmentFee: {
        type: String,
        default: ''
    },
    discount: {
        type: String,
        default: ''
    },
    paymentMode: {
        type: String,
        default: ''
    },
    serviceCompleted: {
        type: Boolean,
        default: false
    },
    creditPointApplied: {
        type: Boolean,
        default: false
    },
    creditPoint: {
        type: Number,
        default: 0
    },
    giftCardApplied: {
        type: Boolean,
        default: false
    },
    giftCardAmount: {
        type: Number,
        default: 0
    },
    activityLog: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userSchema',
            default: null
        },
        status: {
            type: String,
            default: ''
        },
        reason: {
            type: String,
            default: ''
        },
        createAt: {
            type: Date,
            default: Date
        }
    }],
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
        /* new key add by client */
        floor: {
            type: String,
            default: ""
        },
        nameOnDoorbell: {
            type: String,
            default: ""
        },
        otherInfo: {
            type: String,
            default: ""
        },
        /* new key add by client */
        zipcode: {
            type: String,
            default: ""
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    bookingType: {
        type: String,
        enum: ['NORMAL', 'SPECIFIC'],
        uppercase: true,
        default: "NORMAL"
    },
    time: {
        type: Number,
        default: [0, 0]
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE",'CONFIRM', 'CANCELLED','ACCEPTED','PENDING', 'REJECTED', 'COMPLETED','TIMEOUT'],
        uppercase: true,
        default: "PENDING"
    },
    expireDate: {
        type: Date,
        default: ""
    },
    serviceRemaingFee: {
        type: String,
        default: ''
    },
    retryCount:{
        type : Number,
        default: 0
    },
    level: {
        type: String ,
        default: ''
    },
    price: {
        type: String ,
        default: ''
    },
    levelTime: {
        type: String ,
        default: ''
    },
    paymentStatus: {
        type: String,
        enum: ['CONFIRM', 'CANCELLED','PENDING'],
        uppercase: true,
        default: "PENDING"
    },
    bookingCompletionCode: {
        type: String,
        default: ''
    },
    totalFeeBeforeTax: {
        type: String,
        default: ''
    },
    adminDueAmount:{
        type: String,
        default: ''
    },
}, { timestamps: true });
let model = mongoose.model("myntBooking", myntBooking, "myntBooking");
module.exports = model;
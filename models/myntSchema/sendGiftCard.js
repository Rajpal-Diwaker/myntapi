const moment = require("moment");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let sendGiftCard = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
    },
    giftCardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'giftCardSchema',
    },
    amount: Number,
    balanceAmount: Number,
    email :String,
    expiryDate: {
        type: Date,
        default: moment().add(1, 'y')
    },
    isExpired: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    },

}, { timestamps: true });
var giftModel = mongoose.model("sendGiftCard", sendGiftCard, "sendGiftCard");
module.exports = giftModel;

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let giftCardTransaction = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        default: null
    },
    amount: Number,
    title: {
        type: String,
        default: ''
    },
    title2: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ["IN", "OUT"],
        default: "IN"
    },

}, { timestamps: true });
var giftCardTransactionModel = mongoose.model("giftCardTransaction", giftCardTransaction, "giftCardTransaction");
module.exports = giftCardTransactionModel;

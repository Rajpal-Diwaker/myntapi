const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;


const payment           = new Schema({
    userId              : { type: mongoose.Schema.Types.ObjectId, ref: 'userSchema',default: null},
    bookingId           : { type: mongoose.Schema.Types.ObjectId, ref: 'myntBooking',default: null},
    paymentId           : { type: String, default: ''},
    amount              : { type: Number, default: 0 },
    refundAmount        : { type: Number, default: 0 },
    creditPointApplied  : { type: Boolean, default: false},
    creditPoint         : { type: Number, default: 0 },
    refundStatus        : { type: Boolean, default: false},
    refundId            : { type: String, default: ''},
    refundedAmount      : { type: Number, default: 0 },
    isRequestForRefund  : { type: Boolean, default: false},
    type                : { type: String, enum: ['GIFTCARD', 'BOOKING'], default:'BOOKING'}

},{ timestamps: true });

const paymentModel = mongoose.model("payment", payment, "payment");
module.exports = paymentModel;
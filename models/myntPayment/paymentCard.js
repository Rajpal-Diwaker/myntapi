const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;


const paymentCard           = new Schema({
    userId          : { type: mongoose.Schema.Types.ObjectId, ref: 'userSchema',default: null},
    token           : { type: String, default: ''},
    email           : { type: String, default: ''},
    full_name       : { type: String, default: ''}
},{ timestamps: true });

const paymentCardModel = mongoose.model("paymentCard", paymentCard, "paymentCard");
module.exports = paymentCardModel;
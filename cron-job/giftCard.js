const moment                    = require('moment') ;
const cronJob                   = require('cron').CronJob;
const myntSendGiftCardModel     = require('../models/myntSchema/sendGiftCard'); 

/****************************Check User giftCard Expired, if Yes then, update db
 * so he can not use that gift card
 * Run this function Every Midnight.
 */
exports.isUserGiftCardExpired = new cronJob('00 00 00 * * *', async() => {
    let currentDate = moment().startOf('d');
    let query        = { isExpired: false, expiryDate : { $lt: currentDate }};
    myntSendGiftCardModel.updateMany(query, { $set : { isExpired: true }}).exec();
});

/****************************END*************************/
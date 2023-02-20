let mongoose = require("mongoose");
const util = require('../../helpers/constants');
let Schema = mongoose.Schema;
let giftCardSchema = new Schema({
    price: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ''
    },
    name2: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
var giftModel = mongoose.model("giftCardSchema", giftCardSchema, "giftCardSchema");
module.exports = giftModel;


function init() {

    giftModel.findOne({}, (error, success) => {
        if (error) {
            console.log(error);
        } else {
            if (success == null) {

                giftModel.create([
                    {
                        price: 100,
                        name: 'lorem'
                    },
                    {
                        price: 200,
                        name: 'lorem'
                    },
                    {
                        price: 300,
                        name: 'lorem'
                    },
                    
                ], (error, success) => {
                    console.log("Successfully login ", error, success);
                });
            }
        }
    });
}
init();
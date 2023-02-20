let mongoose = require("mongoose");
const util = require('../../helpers/constants');
let Schema = mongoose.Schema;
let rewardPointSchema = new Schema({

    point: {
        type: String,
        default: ''
    },
    percentage: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });


var reward = mongoose.model("rewardPointSchema", rewardPointSchema, "rewardPointSchema");
module.exports = reward;


function init() {

    reward.findOne({}, (error, success) => {
        if (error) {
            console.log(error);
        } else {
            if (success == null) {

                reward.create([
                    {
                        point: 100,
                        percentage: 5
                    },
                    {
                        point: 200,
                        percentage: 10
                    },
                    {
                        point: 300,
                        percentage: 15
                    },
                    {
                        point: 400,
                        percentage: 20
                    }
                ], (error, success) => {
                    console.log("Successfully login ", error, success);
                });
            }
        }
    });
}
init();
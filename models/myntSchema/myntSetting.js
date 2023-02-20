let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntSetting = new Schema({
    referAndEarn: {
        sender          : { type: Number, default: 50 },
        receiver        : { type: Number, default: 50 },
    },
    bookingAmount   : { type: Number, default: 3000 },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("myntSetting", myntSetting, "myntSetting");
module.exports = model;
function init() {
  model.findOne({}, (error, success) => {
    if (error) {
      console.log(error);
    } else {
      if (success == null) {
          let seed  = new model();
          seed.save();
      }
    }
  });
}
init();

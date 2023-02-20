let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let tutorialHelp = new Schema({      
    videoLink: String,
    thumbnail: String,
    userType: {
        type: String,
        enum: ['USER', 'PRO'],
        uppercase: true,
        default: "USER"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        uppercase: true,
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("tutorialHelp", tutorialHelp, "tutorialHelp");
module.exports = model;
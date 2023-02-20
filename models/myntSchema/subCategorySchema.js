let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntSubCategory = new Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'myntCategory'
    },
    subCategoryName: {
        type: String,
        default: ''
    },
    subCategoryName2: {
        type: String,
        default: ''
    },
    subCategoryDescription: {
        type: String,
        default: ''
    },
    briefDescription: {
        type: String,
        default: ''
    },
    subCategoryDescription2: {
        type: String,
        default: ''
    },
    briefDescription2: {
        type: String,
        default: ''
    },
    price:{
        level1:{
            type:String,
            default:''
        },
        level2:{
            type:String,
            default:''
        },
        level3:{
            type:String,
            default:''
        }
    },
    time: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("myntSubCategory", myntSubCategory, "myntSubCategory");
module.exports = model;
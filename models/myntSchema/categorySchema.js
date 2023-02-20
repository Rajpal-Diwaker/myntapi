let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntCategory = new Schema({
    categoryName: {
        type: String,
        default: ''
    },
    categoryName2: {
        type: String,
        default: ''
    },
    categoryImage: {
        type: Array,
        default: []
    },
    categoryDescription: {
        type: String,
        default: ''
    },
    categoryDescription2: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, { timestamps: true });
let model = mongoose.model("myntCategory", myntCategory, "myntCategory");
module.exports = model;

function init() {
    model.findOne({}, (error, success) => {
        if (error) {
            console.log(error);
        } else {
            if (success == null) {
                model.create(
                    {
                        categoryName: 'Hair',
                        categoryImage: 'https://images.pexels.com/photos/1539936/pexels-photo-1539936.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                        categoryDescription: 'lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                    },
                    {
                        categoryName: 'Makeup',
                        categoryImage: 'https://images.pexels.com/photos/5610399/pexels-photo-5610399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                        categoryDescription: 'lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                    },
                    {
                        categoryName: 'Nails',
                        categoryImage: 'https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                        categoryDescription: 'lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                    },
                    {
                        categoryName: 'Hair Removal Treatments',
                        categoryImage: 'https://images.pexels.com/photos/5619448/pexels-photo-5619448.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                        categoryDescription: 'lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                    },
                    {
                        categoryName: 'Fitness',
                        categoryImage: 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
                        categoryDescription: 'lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                    },
                    {
                        categoryName: 'Wedding',
                        categoryImage: 'https://images.pexels.com/photos/3014857/pexels-photo-3014857.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                        categoryDescription: 'lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
                    },
                    (error, success) => {
                        //console.log("Successfully login ", error, success);
                    });
            }
        }
    });
}
init();
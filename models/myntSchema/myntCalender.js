let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let myntCalender = new Schema(
  {
    // calenderDate: {
    //   type: Date,
    //   default: Date,
    // },
    calenderDate: {
      type: String,
      default: "",
    },
    // timeLog: {
    //   type:Array,
    //   default:[]
    // },
     timeLog: [{
        time: {
            type: String,
            default: ''
        },
        isSelected: {
            type: Number,
            default: 0
        },
        isBooked: {
          type: Number,
          default: 0
      },
    }],
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    proId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userSchema",
      default: null,
    },
  },
  { timestamps: true }
);
let model = mongoose.model("myntCalender", myntCalender, "myntCalender");
module.exports = model;

// function init() {
//   model.findOne({}, (error, success) => {
//     if (error) {
//       console.log(error);
//     } else {
//       if (success == null) {
//         model.create(
//           {
//             calenderDate: "2021/1/21",
//             timeLog: ["07:00 AM", "07:30 AM" ],
//             proId: "6035fd467be24b46856257bb",
//           },
//           (error, success) => {
//             //console.log("Successfully login ", error, success);
//           }
//         );
//       }
//     }
//   });
// }
// init();

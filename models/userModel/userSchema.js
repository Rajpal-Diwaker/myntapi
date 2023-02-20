let mongoose = require("mongoose");
const util = require('../../helpers/constants');
let Schema = mongoose.Schema;
global.autoIncrement = require('mongoose-auto-increment');
let connection = mongoose.createConnection(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
// let connection = mongoose.createConnection(process.env.MONGODB_URL, {
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true, 
// 	auto_reconnect: true,
// 	poolSize: 1,
// 	user:"admin",
//     pass:"ukevespodE8TOp",
//     authSource:"admin",
//     keepAlive: true,
// });
autoIncrement.initialize(connection);

let userSchema = new Schema({
	uniqueId: {
		type: Number,
		unique: true  /* auto increment */
	},
	OTP: {
		type: Number
	},
	phone: {
		type: String,
		default: ""
	},
	DOB: {
		type: Date
	},
	gender: {
		type: String,
		enum: ["MALE", "FEMALE", "OTHER"]
	},
	countryCode: {
		type: String,
		default: "+91"
	},
	completeProfile: {
		type: Boolean,
		default: false
	},
	verifyEmail: {
		type: Boolean,
		default: false
	},
	verifyPhone: {
		type: Boolean,
		default: false
	},
	fullName: {
		type: String,
		default: ""
	},
	email: {
		type: String,
		default: ""
	},
	userName: {
		type: String,
		default: ""
	},
	OTP: {
		type: String,
		default: ""
	},
	password: {
		type: String,
		default: ''
	},
	location: [{
		flatNo: {
			type: String,
			default: "Point"
		},
		/* new key add by client */
		floor: {
			type: String,
			default: ""
		},
		nameOnDoorbell: {
			type: String,
			default: ""
		},
		otherInfo: {
			type: String,
			default: ""
		},
		/* new key add by client */

		address: {
			type: String,
			default: ""
		},
		state: {
			type: String,
			default: ""
		},
		city: {
			type: String,
			default: ""
		},
		zipcode: {
			type: String,
			default: ""
		},
		coordinates: {
			type: [Number],
			default: [0, 0]
		}
	}],
	myReferralCode: {
		type: String,
		default: ''
	},
	myReferralCodePrice: {
		type: Number,
		default: 0
	},
	usedReferralCode: {
		type: String,
		default: ''
	},
	registrationDate: {
		type: Date,
		default: Date
	},
	signupType: {
		type: String,
		enum: ['MANUAL', 'SOCIAL'],
		default: "MANUAL",
		uppercase: true
	},
	userType: {
		type: String,
		enum: ['USER', 'PRO', 'ADMIN','SUB_ADMIN'],
		default: "USER",
		uppercase: true
	},
	permission: { //permission array list of module for sub-admin user
		type: Array,
		uppercase: true,
		default: []
	},
	inactiveTime: {
		type: Date,
		default: null
	},
	status: {
		type: String,
		enum: ["ACTIVE", "INACTIVE", 'PENDING', "DELETED", "BLOCK", 'REJECTED'],
		default: "ACTIVE"
	},
	token: {
		type: String,
		default: ""
	},
	deviceIds: {
		ios: [String],
		android: [String],
		web: [String]
	},
	image: {
		type: String,
		default: ""
	},
	thumbnail: {
		type: String,
		default: ""
	},
	// old changes
	// favProfessional: [{
	// 	/* fav user id inserted into favpr */
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'userSchema'
	// }],
	// New change made by Rajpal
	favProfessional: [{
		// 	/* fav user id inserted into favpr */
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'userSchema',
			default: null
		},
		bookingId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'myntBooking',
			default: null
		},
	}],
	deviceToken: {
		type: String,
		default: ""
	},
	deviceType: {
		type: String,
		default: ""
	},
	/* professional information start here */
	firstName: {
		type: String,
		default: ""
	},
	lastName: {
		type: String,
		default: ""
	},
	message: {
		type: String,
		default: ""
	},
	position: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'myntSubCategory'
	}],
	yearOfExperience: {
		type: String,
		default: 0
	},
	workedWithCeleb: {
		type: String,
		default: ''
	},
	workedWithTV: {
		type: String,
		default: ''
	},
	professionalLevel: {
		type: String,
		default: ''
	},
	portfolio: {
		type:Array,
		default:[]
	},
	bioData: {
		type:String,
		default:''
	},
	reason: {
		type:String,
		default:''
	},
	reviewAndRating: [{
		type: new mongoose.Schema({
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'userSchema',
				default: null
			},
			bookingId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'myntBooking',
				default: null
			},
			rating: {
				type: String,
				default: '0',
			},
			review: {
				type: String,
				default: ''
			},
			status: {
				type: String,
				enum: ["ACTIVE", "INACTIVE"],
				default: "ACTIVE"
			}
		},
		{
			timestamps: true }
		)
	}],
	timeSlot: [{
		date: {
			type: Date,
			default: Date
		},
		time: [],
		status: {
			type: String,
			enum: ["ACTIVE", "INACTIVE"],
			default: "ACTIVE"
		}
	}],
	userPoint: {
		type: Number,
		default: 0
	},
	resetPasswordCode: {
		type: String,
		default: ''
	},
	resetPasswordExpiry: {
		type: Date,
		default: new Date()
	},
	lang: {
		type: String,
		default: "en"
	},
}, { timestamps: true });
userSchema.plugin(autoIncrement.plugin, {
	model: 'userSchema',
	field: 'uniqueId',
	startAt: 500,
	incrementBy: 1
});
var userModel = mongoose.model("userSchema", userSchema, "userSchema");
module.exports = userModel;


function init() {

	userModel.findOne({}, (error, success) => {
		if (error) {
			console.log(error);
		} else {
			if (success == null) {

				userModel.create({
					fullName: util.constants.admin.name,
					email: util.constants.admin.email,
					password: '$2b$10$sJ7O0ggP3SwSGJg9LiLFNuaM4pogJW8pr10gTyl3nEgFKITbrju1i',/* 123456 */
					userType: "ADMIN",

				}, (error, success) => {
					//console.log("Successfully login ", error, success);
				});
			}
		}
	});
}
init();
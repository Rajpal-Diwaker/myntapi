var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
const giftCardCron = require("./cron-job/giftCard");
var cors = require("cors");
const process = require('process');
require('./test/test');
// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");

/* testing for process */
process.on('beforeExit', (code) => {
	console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
	console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');



/* testing of process end */
console.log('------------', process.env.MONGODB_URL);
global.autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(process.env.MONGODB_URL, {
	useNewUrlParser: true, useUnifiedTopology: true, auto_reconnect: true,
	poolSize: 5
});

autoIncrement.initialize(connection);
console.log("PORT", process.env.PORT);
mongoose.connect(MONGODB_URL, {
	useNewUrlParser: true, useUnifiedTopology: true, auto_reconnect: true,
	poolSize: 5
})
// global.autoIncrement = require('mongoose-auto-increment');
// var connection = mongoose.createConnection(process.env.MONGODB_URL, {
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true, 
// 	auto_reconnect: true,
// 	poolSize: 5,
// 	user:"admin",
//     pass:"ukevespodE8TOp",
//     authSource:"admin",
//     keepAlive: true,
// });

// autoIncrement.initialize(connection);
// console.log("PORT", process.env.PORT);
// mongoose.connect(MONGODB_URL, {
// 	useNewUrlParser: true, 
// 	useUnifiedTopology: true, 
// 	auto_reconnect: true,
// 	poolSize: 1,
// 	user:"admin",
//     pass:"ukevespodE8TOp",
//     authSource:"admin",
//     keepAlive: true,
// })
.then(() => {
	//don't show the log when it is test
	if (process.env.NODE_ENV !== "test") {
		console.log("Connected to %s", MONGODB_URL);
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	}
})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
var db = mongoose.connection;

var app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public/")));

bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

//To allow cross-origin requests
// app.use(cors());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, noauth, token, noauthother");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next()
});


/* swagger start here */

const swaggerUI = require("swagger-ui-express");
const swaggerDOC = require("./swaggerDocumentation/swagger.json");
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerDOC));

//Route Prefixes
// app.use("/", indexRouter);
app.use("/api/", apiRouter);

// app.use("/download", express.static(path.join(__dirname, "uploads")));

app.use("/privacyPolicy", express.static(path.join(__dirname, "public/privacy-policy.html")));
app.use("/termsConditions", express.static(path.join(__dirname, "public/term-condition.html")));
app.use("/apple-app-site-association", express.static(path.join(__dirname, "apple-app-site-association")));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/", express.static(path.join(__dirname, "../myntadminBuild")));


// throw 404 if URL not found
app.all("*", function (req, res) {
	console.log("res",res)
	return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});
// run cron job here
giftCardCron.isUserGiftCardExpired.start();

// mynt = require("./models/userModel/userSchema");
// mynt.updateMany({}, {$set: {lang:"en"}}).exec();
module.exports = app;

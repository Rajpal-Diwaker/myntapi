const cloudinary = require('cloudinary');
const async = require('async');

const excelToJson = require('convert-excel-to-json');
const nodemailer = require("nodemailer");
const reciptHtml = require("../helpers/templates/recipt");
const workingKey = process.env.CCAV_test_working_key || process.env.prod_working_key;
const crypto = require('crypto');
const moment = require("moment");
// let orderSchema = require("../models/orderModel/orderSchema");
// let invoiceOrderDetail = require("../controllers/hubController/hubServices").invoiceOrderDetail;

var fs = require('fs');
var path = require('path');
var os = require('os');
cloudinary.config({
	cloud_name: "ddbjnqpbw",
	/* live "sumit9211" */
	api_key: "945786786635724",
	/* 885582783668825 */
	/* live 868525178894725 */
	api_secret: "IIp75dRxpAoh1BxMFLymIEpf9nU" /* 0dT6FoxdcGb7UjTKtUGQbAVdOJI */ /* live  MM9hrN2Uvrz0oMfN5SwxaYOdaIc */
});

const AWS = require('aws-sdk');

const ID = 'AKIASZBAW35XIKDGEMOC';
const SECRET = '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';
const BUCKET_NAME = 'gyan-hd';
const s3 = new AWS.S3({
	accessKeyId: ID,
	secretAccessKey: SECRET
});
const CONTENT_ENCODIND = "base64";
var http = require('http');
var urlencode = require('urlencode');

const bcrypt = require("bcryptjs");
/* encode and decode JWT token start */
const jwt = require("jsonwebtoken");
module.exports = {

	//cron timing constants
	ORDER_CRON_TIME_HOUR: 13,
	ORDER_CRON_TIME_MINUTE: 30,
	calcTime(offset, date) {
		// create Date object for current location
		var d = new Date(date);
		console.log(d)

		// convert to msec
		// subtract local time zone offset
		// get UTC time in msec
		var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

		// create new Date object for different city
		// using supplied offset
		var nd = new Date(utc + (3600000 * offset));

		// return time as a string
		return nd.toLocaleString();
	},
	makePassword: (length) => {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
	jwtDecode: (token, callback) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				callback(err, null)
				return;
			} else {
				callback(null, decoded.id)
			}
		})
	},

	jwtEncode: (auth) => {
		//console.log("token generate")
		var token = jwt.sign({ id: auth }, process.env.JWT_SECRET, {})
		return token;
	},
	/**
	 * uploading to cloudnary
	 */
	uploadMultipleImageIntoCloudinary: async (req, res) => {
		// res_promises will be an array of promises
		if (req.files) {
			let res_promises = req.files.map(file => new Promise((resolve, reject) => {
				cloudinary.v2.uploader.upload(file.path, function (error, result) {
					// console.log("multiple image,", error, result)
					if (error) reject(error)
					else resolve(result.secure_url)
				})
			}))
			// Promise.all will fire when all promises are resolved
			Promise.all(res_promises)
				.then((result) => {
					res(result)
				})
				.catch((error) => { res(error) })
		}
		else {
			res([])
		}
	},

	/**
	 * uploading to cloudnary2
	 */
	uploadMultipleImageIntoCloudinary2: async (files, res) => {
		// res_promises will be an array of promises
		if (files) {
			let res_promises = files.map(file => new Promise((resolve, reject) => {
				cloudinary.v2.uploader.upload(file.path, function (error, result) {
					// console.log("multiple image,", error, result)
					if (error) reject(error)
					else resolve(result.secure_url)
				})
			}))
			// Promise.all will fire when all promises are resolved
			Promise.all(res_promises)
				.then((result) => {
					res(result)
				})
				.catch((error) => { res(error) })
		}
		else {
			res([])
		}
	},
	/**
	 * uploading to cloudnary2
	 */
	 uploadVideoIntoCloudinary: async (files, cb) => {
		if (files) {
			let res_promises = files.map(file => new Promise((resolve, reject) => {
				cloudinary.v2.uploader.upload(file.path,
					{resource_type: "video"},
					function (error, result) {
					if (error) reject(error)
					else resolve(result.secure_url)
				})
			}))
			// Promise.all will fire when all promises are resolved
			Promise.all(res_promises)
				.then((result) => {
					cb(false, result)
				})
				.catch((error) => { cb(error, null) })
		}
		else {
			cb(true,null)
		}
	},
	/**
	 * uploading to s3 bucket
	 */
	uploadMultipleImageIntoCloud: async (req, res) => {

		if (req.files) {
			let res_promises = req.files.map(file => new Promise((resolve, reject) => {
				var fileExtension;

				fileExtension = file.originalFilename.replace(/^.*\./, '');
				fileExtension = fileExtension == 'file' ? 'jpeg' : fileExtension
				fileData = fs.readFileSync(file.path);
				var fileName = new Date().getTime();

				var params = {
					Bucket: BUCKET_NAME,
					Key: `${fileName}.${fileExtension}`,
					Body: fileData,
					// ContentEncoding: 'base64',
					ContentType: file.type,
					// ContentType: 'files/jpeg',
					ACL: 'public-read'
				};
				s3.putObject(params, function (err, pres) {
					var url = `https://${BUCKET_NAME}.s3-ap-south-1.amazonaws.com/${fileName}.${fileExtension}`;
					//  console.log("=====>", url)
					if (err) resolve(err)
					else {
						resolve(url)
					}
				})
			}))
			// Promise.all will fire when all promises are resolved
			Promise.all(res_promises)
				.then((result) => {
					// console.log('==result===', result)
					res(result)
				})
				.catch((error) => { res(error) })
		}
		else {
			res([''])
		}
	},

	// uploadImageIntoCloudAnand: async (files, res) => {
	// 	// res_promises will be an array of promises
	// 	if (files) {
	// 		let res_promises = files.map(file => new Promise((resolve, reject) => {
	// 			cloudinary.v2.uploader.upload(file.path, function (error, result) {
	// 				console.log("multiple image,",error,result)
	// 				if (error) reject(error)
	// 				else resolve(result.secure_url)
	// 			})
	// 		}))
	// 		// Promise.all will fire when all promises are resolved
	// 		Promise.all(res_promises)
	// 			.then((result) => {
	// 				res(result)
	// 			})
	// 			.catch((error) => { res(error) })
	// 	}
	// 	else {
	// 		res([])
	// 	}
	// },
	uploadImageIntoCloudAnand: async (files, res) => {

		if (files) {
			let res_promises = files.map(file => new Promise((resolve, reject) => {
				var fileExtension;

				fileExtension = file.originalFilename.replace(/^.*\./, '');
				fileExtension = fileExtension == 'file' ? 'jpeg' : fileExtension
				fileData = fs.readFileSync(file.path);
				var fileName = new Date().getTime();

				var params = {
					Bucket: BUCKET_NAME,
					Key: `${fileName}.${fileExtension}`,
					Body: fileData,
					// ContentEncoding: 'base64',
					ContentType: file.type,
					// ContentType: 'files/jpeg',
					ACL: 'public-read'
				};
				s3.putObject(params, function (err, pres) {
					var url = `https://${BUCKET_NAME}.s3-ap-south-1.amazonaws.com/${fileName}.${fileExtension}`;
					//  console.log("=====>", url)
					if (err) resolve(err)
					else {
						resolve(url)
					}
				})
			}))
			// Promise.all will fire when all promises are resolved
			Promise.all(res_promises)
				.then((result) => {
					// console.log('==result===', result)
					res(result)
				})
				.catch((error) => { res(error) })
		}
		else {
			res([''])
		}
	},
	// createImageThumnail: async (data, callback) => {
	// //	console.log("data", data);

	// 	let Jimp = require('jimp')
	// 	Jimp.read(data.files[0].path, function (err, img) {
	// 		//console.log("err", err, img)
	// 		if (err) throw err;
	// 		img.resize(10, 10).getBase64(Jimp.AUTO, function (e, img64) {

	// 			cloudinary.uploader.upload(img64, (result1) => {
	// 				console.log("err,result", err, result1)
	// 				if (result1.url) {
	// 					callback(null, result1.url)
	// 				} else {
	// 					callback(true, null);
	// 				}
	// 			})


	// 		});
	// 	});
	// },
	createImageThumnail: async (data, callback) => {
		// console.log('=======================', data, '3223223232323', data.image[0].path)
		var Jimp = require('jimp')
		Jimp.read(data.files[0].path, function (err, img) {
			//   console.log("err", err, img)
			if (err) throw err;
			img.resize(10, 10).getBase64(Jimp.AUTO, function (e, img64) {
				var fileData = new Buffer(img64.replace(/^data:image\/\w+;base64,/, ""), CONTENT_ENCODIND);
				var fileName = new Date().getTime() + '.jpg';
				var params = {
					Bucket: BUCKET_NAME,
					Key: fileName,
					Body: fileData,
					ContentEncoding: CONTENT_ENCODIND,
					ContentType: 'image/jpeg',
					ACL: 'public-read'
				};
				s3.putObject(params, function (err, pres) {
					var url = `https://${BUCKET_NAME}.s3-ap-south-1.amazonaws.com/${fileName}`;
					//   console.log(url);

					callback(null, url)
				});

			});
		});
	},
	// createImageThumnailAnand: async (files, callback) => {
	// 	//	console.log("data", data);

	// 		let Jimp = require('jimp')
	// 		Jimp.read(files[0].path, function (err, img) {
	// 			//console.log("err", err, img)
	// 			if (err) throw err;
	// 			img.resize(10, 10).getBase64(Jimp.AUTO, function (e, img64) {

	// 				cloudinary.uploader.upload(img64, (result1) => {
	// 					console.log("err,result", err, result1)
	// 					if (result1.url) {
	// 						callback(null, result1.url)
	// 					} else {
	// 						callback(true, null);
	// 					}
	// 				})


	// 			});
	// 		});
	// 	},
	createImageThumnailAnand: async (files, callback) => {
		var Jimp = require('jimp')
		Jimp.read(files[0].path, function (err, img) {
			//   console.log("err", err, img)
			if (err) throw err;
			img.resize(10, 10).getBase64(Jimp.AUTO, function (e, img64) {
				var fileData = new Buffer(img64.replace(/^data:image\/\w+;base64,/, ""), CONTENT_ENCODIND);
				var fileName = new Date().getTime() + '.jpg';
				var params = {
					Bucket: BUCKET_NAME,
					Key: fileName,
					Body: fileData,
					ContentEncoding: CONTENT_ENCODIND,
					ContentType: 'image/jpeg',
					ACL: 'public-read'
				};
				s3.putObject(params, function (err, pres) {
					var url = `https://${BUCKET_NAME}.s3-ap-south-1.amazonaws.com/${fileName}`;
					//   console.log(url);

					callback(null, url)
				});

			});
		});
	},

	randomNumber: function (length) {
		var text = "";
		var possible = "123456789";
		for (var i = 0; i < length; i++) {
			var sup = Math.floor(Math.random() * possible.length);
			text += i > 0 && sup == i ? "0" : possible.charAt(sup);
		}
		return Number(text);
	},
	createHash: function (value, callback) {
		console.log('value', value)
		bcrypt.genSalt(Number(process.env.saltRounds), function (err, salt) {
			bcrypt.hash(value, salt, function (err, hash) {
				callback(hash)
			});
		});
	},
	compareHash: function (value, hash, callback) {
		console.log('Oldvalue', value,'Newvalue', hash)
		bcrypt.compare(value, hash, function (err, res) {
			callback(res)
		});

	},
	today: () => {
		let date = new Date().toISOString();
		date = date.slice(0, 10);
		return (date);
	},
	currentDate: () => {
		let date = new Date();
		return (date);
	},
	currentDate5MinAdd: (number) => {
		let oldDateObj = new Date();
		let newDateObj = new Date();
		newDateObj.setTime(oldDateObj.getTime() + (number * 60 * 1000));
		// newDateObj.setTime(oldDateObj.getTime() + (5 * 60 * 1000));
		console.log("Indian Time =>",newDateObj.toLocaleString())
		return (newDateObj);
	},
	 timeDifference :(date1,date2) =>{
		// getting date
		let difference = date1.getTime() - date2.getTime();

		// days difference
		let daysDifference = Math.floor(difference/1000/60/60/24);
		difference -= daysDifference*1000*60*60*24

		// hours difference
		let hoursDifference = Math.floor(difference/1000/60/60);
		difference -= hoursDifference*1000*60*60

		// minutes difference
		let minutesDifference = Math.floor(difference/1000/60);
		difference -= minutesDifference*1000*60

		// second difference
		let secondsDifference = Math.floor(difference/1000);

		console.log('difference = ' +
		  daysDifference + ' day/s ' +
		  hoursDifference + ' hour/s ' +
		  minutesDifference + ' minute/s ' +
		  secondsDifference + ' second/s ');

		return minutesDifference;
	},
	momentTimeDifference: (d1, d2) => {
		let nd1 = moment(d1);
		let nd2 = moment(d2); 
		let duration = moment.duration(nd2.diff(nd1));
		return duration.asMinutes();
	},
	convertDate: (dateString) => {
		let dateString2=new Date(dateString).toLocaleString()
		let dateParts = dateString2.split(",");
		let dateParts2 = dateParts[0].split("/");
		let dateObject = dateParts2[2] +"/" +dateParts2[0] +"/" + dateParts2[1];
		return dateObject;
	},
	fromDate: (date) => {
		date = date ? new Date(date) : date;
		let result = date ? new Date(date).toISOString().slice(0, 10) : ""
		return result;
	},
	toDate: (date) => {
		date = date ? new Date(date) : date;
		let result = date ? new Date(date.setDate(date.getDate() + parseInt(1))).toISOString().slice(0, 10) : ""
		return result;
	},
	tomorrow: (numberOfDays) => {
		let date = new Date()
		date = new Date(date.setDate(date.getDate() + parseInt(numberOfDays))).toISOString().slice(0, 10);
		return date;
	},
	dayLag: (numberOfDays, inputDate) => {
		let date = new Date(inputDate)
		date = new Date(date.setDate(date.getDate() + parseInt(numberOfDays))).toISOString().slice(0, 10);
		return date;
	},
	encrypt: (plainText) => {
		var m = crypto.createHash('md5');
		m.update(workingKey);
		var key = m.digest();
		var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
		var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
		var encoded = cipher.update(plainText, 'utf8', 'hex');
		encoded += cipher.final('hex');
		return encoded;
	},
	twelveHourFormat: () => {
		var dt = new Date(new Date().getTime() + 5.5 * 3600 * 1000 + 15 * 60 * 1000);
		var hours = dt.getHours(); // gives the value in 24 hours format
		var AmOrPm = hours >= 12 ? 'PM' : 'AM';
		hours = (hours % 12) || 12;
		var minutes = dt.getMinutes().toString();
		minutes = minutes.length == 1 ? `0${minutes}` : minutes;
		var finalTime = hours + ":" + minutes + " " + AmOrPm;
		return finalTime;
	},

	sendmail: (to, subject, text, html, callback) => {
		let transporter = nodemailer.createTransport({
			host: process.env.EMAIL_SMTP_HOST,
			port: process.env.EMAIL_SMTP_PORT,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.EMAIL_SMTP_USERNAME, // generated ethereal user
				pass: process.env.EMAIL_SMTP_PASSWORD, // generated ethereal password
			},
		});

		// send mail with defined transport object
		transporter.sendMail({
			from: process.env.EMAIL_SMTP_FROM, // sender address
			to: to, // list of receivers
			subject: subject, // Subject line
			text: text, // plain text body
			html: html, // html body
		}, (err, res) => {
			console.log(err, res);
			callback("send mail log--->>>", err, res);
		})
	},
	sendAttachmentmail: (to, subject, text, html, attachments, callback) => {
		let transporter = nodemailer.createTransport({
			host: process.env.EMAIL_SMTP_HOST,
			port: process.env.EMAIL_SMTP_PORT,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.EMAIL_SMTP_USERNAME, // generated ethereal user
				pass: process.env.EMAIL_SMTP_PASSWORD, // generated ethereal password
			},
		});

		// send mail with defined transport object
		transporter.sendMail({
			from: process.env.EMAIL_SMTP_FROM, // sender address
			to: to, // list of receivers
			subject: subject, // Subject line
			text: text, // plain text body
			html: html, // html
			attachments: attachments
		}, (err, res) => {
			console.log(err, res);
			callback("send mail log--->>>", err, res);
		})
	},
	convertToPdf: (orderId) => {
		var fileName = new Date().getTime() + ".pdf";
		invoiceOrderDetail(orderId, (err, orderDetail) => {
			if (err) return;
			// var pdf = require('html-pdf');
			var html_to_pdf = require('html-pdf-node');

			var html = reciptHtml(orderDetail);
			let options = { format: 'A4' };
			let file = { content: html };
			html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
				var params = {
					Bucket: BUCKET_NAME,
					Key: fileName,
					Body: pdfBuffer,
					ContentEncoding: CONTENT_ENCODIND,
					ContentType: 'pdf/pdf',
					ACL: 'public-read'
				};
				s3.putObject(params, function (err, pres) { });
			})
			// var options = { format: 'Letter' };
			// pdf.create(html).toBuffer(function (err, buffer) {

			// 	var params = {
			// 		Bucket: BUCKET_NAME,
			// 		Key: fileName,
			// 		Body: buffer,
			// 		ContentEncoding: CONTENT_ENCODIND,
			// 		ContentType: 'pdf/pdf',
			// 		ACL: 'public-read'
			// 	};
			// 	s3.putObject(params, function (err, pres) { });

			// });
		})

		var url = `https://${BUCKET_NAME}.s3-ap-south-1.amazonaws.com/${fileName}`;
		console.log(url);
		return url;
	},


	excelToJsonData: (source) => {
		let file = process.cwd() + `/uploads/${source}`
		const result = excelToJson({
			sourceFile: file,
			sheets: [
				{
					name: 'Order History',
					columnToKey: {
						A: 'orderId',
						B: 'hubName',
						C: 'customerId',
						D: 'fullName',
						E: 'phone',
						F: 'address',
						G: 'location',
						H: 'product',
						I: 'quantity',
						J: 'unitPrice',
						K: 'amount',
						L: 'deliveryDate',
						M: 'deliveryTime'
					}
				},
				{
					name: 'last Recharge',
					columnToKey: {
						A: 'phone',
						B: 'walletAmount',
						C: 'lastRecharge'
					}
				},
				{
					name: 'Profile',
					columnToKey: {
						A: 'fullName',
						B: 'email',
						C: 'phone',
						D: 'walletAmount',
						E: 'lattitude',
						F: 'lognitude',
						G: 'address',
						// H: 'customerType',
						// I: 'device',
						// J: 'deviceVersion',
						// K: 'address',
						// L: 'subArea',
						// M: 'areaId',
						// N: 'locationArea',
						// O: 'townId',
						// P: 'region',
						// Q: 'hub',
						// R: 'deliveryExecutive',
						// S: 'creditLimit',
						// T: 'walletAmount',
						// U: 'source',
						// V: 'latitude',
						// W: 'longitude',
						// X: 'registeredDate',
						// Y: 'registeredTime',
						// Z: 'status'
					}
				},
				{
					name: 'Area',
					columnToKey: {
						A: 'areaId',
						B: 'areaName',
						C: 'lattitude',
						D: 'lognitude'
					}
				},
				{
					name: 'Subscription',
					columnToKey: {
						A: 'phone',
						B: 'productCode',
						C: 'sun',
						D: 'mon',
						E: 'tue',
						F: 'wed',
						G: 'thur',
						H: 'fri',
						I: 'sat',
						J: 'fromDate',
						K: 'subscriptionType',
						L: 'status'
					}
				},
				{
					name: 'ProductCodes',
					columnToKey: {
						A: '_id',
						B: 'itemName',
						C: 'productCode',
					}
				},
				// usersWallet
				{
					name: 'usersWallet',
					columnToKey: {
						A: 'phone',
						B: 'amount',
						C: 'reasion'
					}
				},
			]
		});
		return result
	},
	// areaXlsToJSON:(source)=>{
	// 	let file = process.cwd()+`/uploads/${source}`
	// 	const result = excelToJson({
	// 		sourceFile: file,
	// 		sheets:[
	// 		{
	// 			name: 'Area',
	// 			columnToKey: {
	// 				A: 'areaId',
	// 				B: 'areaName',
	// 				C: 'lattitude',
	// 				D: 'lognitude'
	// 			}
	// 		}
	// 	]
	// 	});
	// 	console.log("TTTTTTTTTTTTTT",result)
	// 	return result
	// },
	subscriptionExcelToJson: (source) => {
		let file = process.cwd() + `/uploads/${source}`
		const result = excelToJson({
			sourceFile: source,
			columnToKey: {
				A: 'S.No',
				B: 'customerId',
				C: 'name',
				D: 'phone',
				E: 'productName',
				F: 'productId',
				G: 'code',
				H: 'deliveryAddress',
				I: 'addLat',
				J: 'addLong',
				K: 'deliveredBy',
				L: 'subsCriptionId',
				M: 'subscriptionType',
				N: 'subscriptionQty',
				O: 'remainigQty',
				P: 'sunday',
				Q: 'monday',
				R: 'tuesday',
				S: 'wednesday',
				T: 'thrusday',
				U: 'friday',
				V: 'saturday',
				W: 'all',
				X: 'type',
				Y: 'startDate',
				Z: 'date',
				AA: 'endDate',
				AB: 'status'

			}
		})
		return result;
	},
	sendMessage: (data) => {
		var msg = urlencode(data.message);
		var toNumber = data.number;
		var username = 'developer@gyandairy.com';
		var hash = '6d29d7497047648c8aa0980c81c93328038dc2d7ce0b4ecf98495b6d0a5c7e66'; // The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.
		var sender = 'GYANHD';
		var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + toNumber + '&message=' + msg;
		var options = {
			host: 'api.textlocal.in', path: '/send?' + data
		};
		callback = function (response) {
			var str = '';//another chunk of data has been recieved, so append it to `str`
			response.on('data', function (chunk) {
				str += chunk;
			});//the whole response has been recieved, so we just print it out here
			response.on('end', function () {
				console.log("Message sent sucessfully", str);
				// return str;

			});
		}//console.log('hello js'))
		http.request(options, callback).end();//url encode instalation need to use $ npm install urlencode

	}

}
/* encode and decode JWT token end */

// module.exports.excelToJsonData("/home/techugo-prakash/Desktop/New App Requirment.xlsx")
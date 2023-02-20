const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
/* let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
    auth: {
        user: process.env.EMAIL_SMTP_USERNAME,
        pass: process.env.EMAIL_SMTP_PASSWORD
    }
}); */
/* 
exports.send = function (from, to, subject, html)
{
    // send mail with defined transport object
    // visit https://nodemailer.com/ for more options
    return transporter.sendMail({
        from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
        to: to, // list of receivers e.g. bar@example.com, baz@example.com
        subject: subject, // Subject line e.g. 'Hello ✔'
        //text: text, // plain text body e.g. Hello world?
        html: html // html body e.g. '<b>Hello world?</b>'
    });
}; */


const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: "us-east-1"
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendEmail = (to, subject, message, from) => {
    const params = {
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: message
                },
                /* replace Html attribute with the following if you want to send plain text emails. 
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
             */
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        ReturnPath: '<noreply@example.com>',
        Source: '<noreply@example.com>'
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            return console.log(err, err.stack);
        } else {
            console.log("Email sent.", data);
        }
    });
};

let sendMailTest = (email, subject, text, callback) => {
    /* ><br><h3>Email :"  ${email}  "</h3><h3>Password :"${text} "</h3> */
    var html = `<p>Welcome to WAKI!</p><br><p>Thanks for choosing WAKI:-</p<br>Regards<br>WAKI Team.`
    const mailBody = {
        from: 'youremail@gmail.com',
        to: 'sumit@techugo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'themyntapp@gmail.com',
            pass: 'mynt1!2@3#4$'
        },
        // port: 587,
        // host: 'smtp.gmail.com'

    }).sendMail(mailBody, callback)
};
// var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
        user: 'themyntapp@gmail.com',
        pass: 'mynt1!2@3#4$'
    }
			
});
/* Username: themyntapp@gmail.com

Password: mynt1!2@3#4$ */
const sendCred = (to, subject, html) => {
    
    var mailOptions = {
        from: 'themyntapp@gmail.com',
        to:to,
        subject:subject,
        html:html
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// EMalil js Helper to send Gmail mail
var EM = {}
var EmailJs 			= require("emailjs");
EM.from 				= 'no-reply@nasirkamal61@gmail.com';
EM.server = new EmailJs.SMTPClient({
	host 	    : process.env.NL_EMAIL_HOST || 'smtp.gmail.com',
	user 	    : process.env.NL_EMAIL_USER || 'nasirkamal61@gmail.com',
	password    : process.env.NL_EMAIL_PASS || '**********',
	ssl		    : true
})

EM.subAdminRegistrationEmail = function(data, callback){
	EM.server.send({
		from         : EM.from,
		to           : data.to,
		subject      : data.subject,
		attachment   : [{data:data.url, alternative:true}]
	}, callback );
}
module.exports = { sendEmail, sendCred ,EM };
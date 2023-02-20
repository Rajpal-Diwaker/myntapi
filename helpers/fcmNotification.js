/* eslint-disable linebreak-style */
/* eslint-disable indent */
const FCM = require('fcm-node');
let process = require("process");
// var serverKey =  "AAAAFRKFTdE:APA91bEfkFylJ14UcaMLRt_RIFOZ56glPvWNxfQEyaBF85w5aXIuDmaqA6UDdZy4Ku9h1iZQhM88dxMFwo2YFQbC57l7CJMvzw9ILvEMvqP3WJosRGBl2PDSqOBVojzVDPqH2Cyt2YSy"; //put your server key here
var serverKey =  "AAAAfXThlmQ:APA91bFKFlZvQJiFGse0dzKw4MZ-i56PK8026ZJdtYT8F769MxEjtWPPs9b2QTGr7ewZAq4fsgV9XcM-YRwGZYhCalK6DEnNTcn8ePLJ6R0_WtdTy-JIfkHhGODLfJBQ9BtmL0H3HcYT"; //put your server key here
var fcm = new FCM(serverKey);
var Queue = require('bull');
// var notificationsQueue = new Queue('notifications', { redis: { port: 6379, host: '127.0.0.1' } }); // Specify Redis connection using object

module.exports = {
     sendNotif : (deviceTokens,title,body) => {
            var message = {
              "to": deviceTokens,
              "data": {
              "is_incoming": "no",
              "sender": "admin",
              "time": new Date(),
              "body": body,
              "msg":key,
              "type":subsId,
              "title":title,
              },
              "priority": "high"
              };

            fcm.send(message, function (err, response) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully sent with response: ", response);
              }
            });
       },

    iosNotification : (deviceTokens,title,body,type,bookingId=null, proId = null)=> {
        var message = {
            to: deviceTokens,
            notification: {
                title: title, // title of the notification
                body: body,    //message of the notification
                type: type,    //message of the notification
                bookingId: bookingId,    //Booking ID
                proId:  proId //professsional Id
            }
        };
        console.log("iosNotification-><<>message",message)
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!->iosNotification",err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    },

    androidNotification : (deviceTokens,title,body,type,bookingId=null,  proId = null)=>{
        let message = {
            "to": deviceTokens,
            "data": {
                "is_incoming": "no",
                "time": new Date(),
                "body": body,
                "title":title,
                type: type,    //message of the notification
                bookingId:bookingId,
                proId:  proId //professsional Id
            },
            "priority": "high"
            };

            console.log("androidNotification-><<>message",message)
          fcm.send(message, function (err, response) {
            if (err) {
            //   console.log(err);
              console.log("Something has gone wrong!->iosNotification",err);
            } else {
              console.log("Successfully sent with response: ", response);
            }
          });

    },
    webNotification : (deviceTokens,title,body)=>{
        var message = {
            //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            registration_ids: deviceTokens,
            // collapse_key: 'green',

            notification: {
                title: title, // title of the notification
                body: body,    //message of the notification
                icon:'assets/img/logo.png',
                // actions:action.toString(),

            }
        };
            // send notification with defined fcm object
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!",err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });

    },
    //Schedule the job
    scheduleMessage : async (deviceTokens, date, hour, data, payload, options, repeatDays) => {
        let time = hour;
    var date = date.toString().split("/");
    var hour = hour.toString().split(":");
    console.log(date[2], date[1], date[0], hour[0], hour[1], 0);
    var jobDate = new Date(date[2], date[1] - 1, date[0], hour[0], hour[1]);
    var nextJobDate = `${date[0]}/${date[1]+repeatDays}/${date[2]}`
    console.log(jobDate);
    console.log(new Date());
    var jobDelay = ((jobDate.getTime() / 1000) - (Math.floor(new Date().getTime() / 1000)));

    console.log(jobDate.getTime() / 1000);
    console.log(Math.abs(jobDelay));
    console.log(Math.floor(new Date().getTime() / 1000));

    // const job = await notificationsQueue.add({
    //     deviceTokens:deviceTokens,
    //     payload: payload,
    //     data:data,
    //     date:nextJobDate,
    //     hour: time,
    //     repeatDays:repeatDays,
    //     options: options
    // }, { delay: Math.abs(jobDelay) });
    // console.log(date + " " + hour);
    }
}

//Process qued job
// notificationsQueue.process(async (job, done) => {
//     console.log(job.data);
//     module.exports.sendNotification(job.data.deviceTokens, job.data.payload.notification.title,job.data.payload.notification.body,"AUTOMATIC_NOTIFICATION","","");
//     module.exports.scheduleMessage(job.data.deviceTokens,job.data.date,job.data.hour,job.data.data,job.data.payload,job.data.options,job.data.repeatDays) //call
// });
// module.exports.sendNotification(["c9YhnobuoQU:APA91bG5aaHtRflM2tgh3hrMf5CEjxmrg9oafL_gH-T6YRoPVhlZ9XId9ym51frO70QGbqvSHLF-u3aOvTUlMXRQ6b2a_9lhuP3dvg8d2AQO2009V8Yy8KiHsuzZyXK_0ODBr-9D6rJV"],"notification testing","hi folks,if you recieve the message just test me on my skype")



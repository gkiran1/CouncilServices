import { Injectable, Component } from '@angular/core';
import { Observable, Subject } from "rxjs/Rx";

var https = require('https');
var email = require('emailjs/email');

@Injectable()
export class Notifications {
    sendPush(emails: string[]) {
         var credentials = {
            IonicApplicationID: "a687fb87",
            IonicApplicationAPItoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYTcxOWU1MS1iNDJlLTQ2NWEtYTdiOS03MTAxMWZhNGQ3YmIifQ.aE4k3dL_vjZBIDxxdDu1wYIJMBjXIUUWYy9lcmLCW5A"
        };
        var notification = {
            "emails":emails,
        "profile": "ionpush",
            "notification": {
                "title": "Hi",
                "message": "Hello world!",
                "android": {
                    "title": "Hey",
                    "message": "Hello Android!"
                },
                "ios": {
                    "title": "Howdy",
                    "message": "Hello iOS!"
                }
            }
        };
        var options = {
	hostname: 'api.ionic.io',
	path: '/push/notifications',
	method: 'POST',
	headers: {
	  "Content-Type" : "application/json",
	  "Authorization": "Bearer " + credentials.IonicApplicationAPItoken
	}
  };

  var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(JSON.stringify(notification));
  req.end();

    }

    sendMail(to:string, subject:string, body: string) {
         var server = email.server.connect({
            user: "pkcouncils",// "AKIAJGVSLVYWN7HUBMJA", 
            password: "Admin@123",//,"AtEKBfKDYls8QSZ622qLDHugXb9bDsJbwQ7+zeFiNrEx", 
            host: "smtp.gmail.com",// "email-smtp.us-west-2.amazonaws.com", 
            ssl: true,
            port: 465,
            //tls:     true,
            timeout: 60000
        });
        var headers = {
            text: body,
            from: "pkcouncils@gmail.com",
            to: to,
            subject: subject

        };
        var message = email.message.create(headers);
        server.send(message);
    }
}
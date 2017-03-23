import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
//import { Observable, Subject } from "rxjs/Rx";
import { Headers, Http, Response } from '@angular/http';
import { Notifications } from 'providers/notifications';
import { Observable, Subject } from "rxjs/Rx";

var https = require('https');
var email = require('emailjs/email');


@Injectable()
export class AfDataService {
  users: FirebaseListObservable<any[]>;
  rootRef: any;
  emails = [];

  constructor(public af: AngularFire, public notifications: Notifications) {
    this.users = af.database.list('users');
    this.rootRef = firebase.database().ref();
  }

  agendasTrigger() {
    var em: string[] = [];
    var agendaName = '';
    var notificationObj;

    this.rootRef.child('agendas').endAt().limitToLast(1).on('child_added', function (snapshot) {

      agendaName = snapshot.val()['agendacouncil'];

      notificationObj = {
        'notificationId': snapshot.getKey(),
        'notificationType': 'Agenda',
        'councilName': snapshot.val()['agendacouncil'],
        'councilId': snapshot.val()['councilid'],
        'description': '',
        'createdDate': new Date().toDateString(),
        'createdTime': new Date().toTimeString(),
        'createdBy': snapshot.val()['createdby']
      }

      var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
      councilUsersRef.once('value').then(function (usrsSnapshot) {
        usrsSnapshot.forEach(usrObj => {
          var usrRef = firebase.database().ref().child('users/' + usrObj.val()['userid']);
          usrRef.once('value').then(function (usrSnapshot) {
            if (usrSnapshot.val()['isactive'] === true) {
              em.push(usrSnapshot.val()['email']);
            }
          });
        });

        Promise.resolve(em).then(res => {
          if (res.length > 0) {
            var credentials = {
              IonicApplicationID: "15fb1041",
              IonicApplicationAPItoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMmZkODU1NS02NzkyLTRhN2MtYTVkZS0yYjYxNjM3OTIxOTMifQ.1tvI00lNMfm1VZUjH9t2gzd5fAIefRjasuHOlgBntuk"
            };
            var notification = {
              "emails": res,
              "profile": "councilsapppush",
              "notification": {
                "title": "LDS Councils",
                "message": 'New Agenda - ' + agendaName,
                "android": {
                  "title": "LDS Councils",
                  "message": 'New Agenda - ' + agendaName
                },
                "ios": {
                  "title": "LDS Councils",
                  "message": 'New Agenda - ' + agendaName
                }
              }
            };
            var options = {
              hostname: 'api.ionic.io',
              path: '/push/notifications',
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + credentials.IonicApplicationAPItoken
              }
            };
            var req = https.request(options, function (res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });
            req.on('error', function (e) {
              console.log('problem with request: ' + e.message);
            });
            req.write(JSON.stringify(notification));
            req.end();

            firebase.database().ref().child('notifications').push({
              notificationid: notificationObj.notificationId,
              notificationtype: notificationObj.notificationType,
              councilname: notificationObj.councilName,
              councilid: notificationObj.councilId,
              description: notificationObj.description,
              createddate: notificationObj.createdDate,
              createdtime: notificationObj.createdTime,
              createdby: notificationObj.createdBy
            }).catch(err => { throw err });

          }
        });
      });
    });
  }

  assignmentsTrigger() {
    var em: string[] = [];
    var assignmentName;
    var notificationObj;

    this.rootRef.child('assignments').endAt().limitToLast(1).on('child_added', function (snapshot) {

      assignmentName = snapshot.val()['description'];

      notificationObj = {
        'notificationId': snapshot.getKey(),
        'notificationType': 'Assignment',
        'councilName': snapshot.val()['councilname'],
        'councilId': snapshot.val()['councilid'],
        'description': snapshot.val()['description'],
        'createdDate': new Date().toDateString(),
        'createdTime': new Date().toTimeString(),
        'createdBy': snapshot.val()['createdby']
      }

      var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
      councilUsersRef.once('value').then(function (usrsSnapshot) {
        usrsSnapshot.forEach(usrObj => {
          var usrRef = firebase.database().ref().child('users/' + usrObj.val()['userid']);
          usrRef.once('value').then(function (usrSnapshot) {
            if (usrSnapshot.val()['isactive'] === true) {
              em.push(usrSnapshot.val()['email']);
            }
          });
        });

        Promise.resolve(em).then(res => {
          if (res.length > 0) {
            var credentials = {
              IonicApplicationID: "15fb1041",
              IonicApplicationAPItoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMmZkODU1NS02NzkyLTRhN2MtYTVkZS0yYjYxNjM3OTIxOTMifQ.1tvI00lNMfm1VZUjH9t2gzd5fAIefRjasuHOlgBntuk"
            };
            var notification = {
              "emails": res,
              "profile": "councilsapppush",
              "notification": {
                "title": "LDS Councils",
                "message": 'New Assignment - ' + assignmentName,
                "android": {
                  "title": "LDS Councils",
                  "message": 'New Assignment - ' + assignmentName
                },
                "ios": {
                  "title": "LDS Councils",
                  "message": 'New Assignment - ' + assignmentName
                }
              }
            };
            var options = {
              hostname: 'api.ionic.io',
              path: '/push/notifications',
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + credentials.IonicApplicationAPItoken
              }
            };
            var req = https.request(options, function (res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });
            req.on('error', function (e) {
              console.log('problem with request: ' + e.message);
            });
            req.write(JSON.stringify(notification));
            req.end();

            firebase.database().ref().child('notifications').push({
              notificationid: notificationObj.notificationId,
              notificationtype: notificationObj.notificationType,
              councilname: notificationObj.councilName,
              councilid: notificationObj.councilId,
              description: notificationObj.description,
              createddate: notificationObj.createdDate,
              createdtime: notificationObj.createdTime,
              createdby: notificationObj.createdBy
            }).catch(err => { throw err });

          }
        });

      });
    });
  }

  discussionsTrigger() {
    var em: string[] = [];
    var discussionName;
    var notificationObj;

    this.rootRef.child('discussions').endAt().limitToLast(1).on('child_added', function (snapshot) {

      discussionName = snapshot.val()['topic'];

      notificationObj = {
        'notificationId': snapshot.getKey(),
        'notificationType': 'Assignment',
        'councilName': snapshot.val()['councilname'],
        'councilId': snapshot.val()['councilid'],
        'description': discussionName,
        'createdDate': new Date().toDateString(),
        'createdTime': new Date().toTimeString(),
        'createdBy': snapshot.val()['createdBy']
      }

      var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
      councilUsersRef.once('value').then(function (usrsSnapshot) {
        usrsSnapshot.forEach(usrObj => {
          var usrRef = firebase.database().ref().child('users/' + usrObj.val()['userid']);
          usrRef.once('value').then(function (usrSnapshot) {
            if (usrSnapshot.val()['isactive'] === true) {
              em.push(usrSnapshot.val()['email']);
            }
          });
        });

        Promise.resolve(em).then(res => {
          if (res.length > 0) {
            var credentials = {
              IonicApplicationID: "15fb1041",
              IonicApplicationAPItoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMmZkODU1NS02NzkyLTRhN2MtYTVkZS0yYjYxNjM3OTIxOTMifQ.1tvI00lNMfm1VZUjH9t2gzd5fAIefRjasuHOlgBntuk"
            };
            var notification = {
              "emails": res,
              "profile": "councilsapppush",
              "notification": {
                "title": "LDS Councils",
                "message": 'New Discussion - ' + discussionName,
                "android": {
                  "title": "LDS Councils",
                  "message": 'New Discussion - ' + discussionName
                },
                "ios": {
                  "title": "LDS Councils",
                  "message": 'New Discussion - ' + discussionName
                }
              }
            };
            var options = {
              hostname: 'api.ionic.io',
              path: '/push/notifications',
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + credentials.IonicApplicationAPItoken
              }
            };
            var req = https.request(options, function (res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });
            req.on('error', function (e) {
              console.log('problem with request: ' + e.message);
            });
            req.write(JSON.stringify(notification));
            req.end();

            firebase.database().ref().child('notifications').push({
              notificationid: notificationObj.notificationId,
              notificationtype: notificationObj.notificationType,
              councilname: notificationObj.councilName,
              councilid: notificationObj.councilId,
              description: notificationObj.description,
              createddate: notificationObj.createdDate,
              createdtime: notificationObj.createdTime,
              createdby: notificationObj.createdBy
            }).catch(err => { throw err });

          }
        });

      });
    });
  }


  assignmentsUpdateTrigger() {
    var em: string[] = [];
    var assignmentName;
    var notificationObj;

    this.rootRef.child('assignments').on('child_changed', function (snapshot) {

      assignmentName = snapshot.val()['councilname'];
      alert(assignmentName);

      notificationObj = {
        'notificationId': snapshot.getKey(),
        'notificationType': 'Assignment',
        'notificationItem': assignmentName,
        'councilId': snapshot.val()['councilid'],
        'createdDate': new Date().toDateString(),
        'createdTime': new Date().toTimeString(),
        'createdBy': snapshot.val()['createdBy']
      }

      var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
      councilUsersRef.once('value').then(function (usrsSnapshot) {
        usrsSnapshot.forEach(usrObj => {
          var usrRef = firebase.database().ref().child('users/' + usrObj.val()['userid']);
          usrRef.once('value').then(function (usrSnapshot) {
            if (usrSnapshot.val()['isactive'] === true) {
              em.push(usrSnapshot.val()['email']);
            }
          });
        });

        Promise.resolve(em).then(res => {
          if (res.length > 0) {
            var credentials = {
              IonicApplicationID: "15fb1041",
              IonicApplicationAPItoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMmZkODU1NS02NzkyLTRhN2MtYTVkZS0yYjYxNjM3OTIxOTMifQ.1tvI00lNMfm1VZUjH9t2gzd5fAIefRjasuHOlgBntuk"
            };
            var notification = {
              "emails": res,
              "profile": "councilsapppush",
              "notification": {
                "title": "LDS Councils",
                "message": 'Assignment Completed - ' + assignmentName,
                "android": {
                  "title": "LDS Councils",
                  "message": 'Assignment Completed - ' + assignmentName
                },
                "ios": {
                  "title": "LDS Councils",
                  "message": 'Assignment Completed - ' + assignmentName
                }
              }
            };
            var options = {
              hostname: 'api.ionic.io',
              path: '/push/notifications',
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + credentials.IonicApplicationAPItoken
              }
            };
            var req = https.request(options, function (res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
              res.setEncoding('utf8');
              res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
              });
            });
            req.on('error', function (e) {
              console.log('problem with request: ' + e.message);
            });
            req.write(JSON.stringify(notification));
            req.end();

            firebase.database().ref().child('notifications').push({
              notificationid: notificationObj.notificationId,
              notificationtype: notificationObj.notificationType,
              notificationitem: notificationObj.notificationItem,
              councilid: notificationObj.councilId,
              createddate: notificationObj.createdDate,
              createdtime: notificationObj.createdTime,
              createdby: notificationObj.createdBy
            }).catch(err => { throw err });

          }
        });

      });
    });
  }


  // var myArr = [];
  // function show_fb() {
  //     var firebase = new Firebase('https://scorching-fire-6816.firebaseio.com/');
  //     firebase.on('child_added', on_post_added);
  // };
  // function on_post_added(snapshot) {
  //     var newPost = snapshot.val();
  //     myArr.push(newPost.user);
  //     console.log(myArr);
  //     // do whatever else you need to do for a new post
  // }

  getLastAssignment() {

  }


  getUsersFromCouncil(councilId) {

  }

  //   assignmentTrigger() {
  //      this.rootRef.child('assignments').endAt().limitToLast(1).on('child_added',function(snapshot){
  //         return snapshot.getKey();
  //       });
  //   }

  //   councilsDiscussionTrigger() {
  // this.rootRef.child('councilsdiscussions').endAt().limitToLast(1).on('child_added',function(snapshot){
  //         return snapshot.getKey();
  //       });
  //   }

  //   privateDiscussionTrigger() {
  // this.rootRef.child('privatediscussions').endAt().limitToLast(1).on('child_added',function(snapshot){
  //         return snapshot.getKey();
  //       });
  //   }

  //   sendNotification(emails:string[]) {


  //   }

  //   getAgendaEmails(agendaId:string) {

  //   }

  getUserEmails(key: string, entity: string) {

  }

  getInviteeMail(key: string): any {
    var invitee = this.af.database.object('invitees/' + key);
    if (invitee !== undefined) {
      return new Promise(invitee["email"]);
    }
    else {
      return new Promise(null);
    }
  }



  // createUser() {
  //     firebase.database().ref().child('user').push(
  //                   {
  //                       name: "test1",
  //                       username: "username1"
  //                   })
  //                   .then(() => {
  //                       return "User is successfully invited..."
  //                   })
  //                   .catch(err => { throw err });
  // }

  getUserByKey(key: any) {

    return this.af.database.object('user/' + key);

  }

}
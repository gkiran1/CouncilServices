import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Headers, Http, Response } from '@angular/http';
import { Notifications } from 'providers/notifications';
import { Observable, Subject } from "rxjs/Rx";

var https = require('https');
var email = require('emailjs/email');

var credentials = {
  IonicApplicationID: "15fb1041",
  IonicApplicationAPItoken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMmZkODU1NS02NzkyLTRhN2MtYTVkZS0yYjYxNjM3OTIxOTMifQ.1tvI00lNMfm1VZUjH9t2gzd5fAIefRjasuHOlgBntuk"
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

@Injectable()
export class AfDataService {
  users: FirebaseListObservable<any[]>;
  rootRef: any;
  emails = [];

  constructor(public af: AngularFire, public notifications: Notifications) {
    this.users = af.database.list('users');
    this.rootRef = firebase.database().ref();
  }

  // Agendas Trigger ------------------------
  agendasTrigger() {
    this.rootRef.child('agendas').endAt().limitToLast(1).on('child_added', function (snapshot) {
      var agendaId = snapshot.getKey();
      var description = snapshot.val()['agendacouncil'];
      var createdBy = snapshot.val()['createdby'];
      var userKeys = [];
      var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(agendaId);
      notificationRef.once("value", function (snap) {
        if (!snap.exists()) {
          var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
          councilUsersRef.once('value').then(function (usrsSnapshot) {
            usrsSnapshot.forEach(usrObj => {
              var id = usrObj.val()['userid'];
              userKeys.push(id);
              if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                var usrRef = firebase.database().ref().child('users/' + id);
                usrRef.once('value').then(function (usrSnapshot) {
                  if (usrSnapshot.val()['isactive'] === true) {
                    var email = usrSnapshot.val()['email'];

                    firebase.database().ref().child('notifications').push({
                      userid: id,
                      nodeid: agendaId,
                      nodename: 'agendas',
                      description: description,
                      action: 'create',
                      text: 'New Agenda ' + '\"' + description + '\"' + ' is posted',
                      createddate: new Date().toDateString(),
                      createdtime: new Date().toTimeString(),
                      createdby: createdBy,
                      isread: false
                    }).catch(err => { throw err });

                    var notification = {
                      "emails": email,
                      "profile": "ldspro",
                      "notification": {
                        "title": "LDS Councils",
                        "message": 'New Agenda - ' + description,
                        "android": {
                          "title": "LDS Councils",
                          "message": 'New Agenda - ' + description
                        },
                        "ios": {
                          "title": "LDS Councils",
                          "message": 'New Agenda - ' + description
                        }
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
                  }
                });
              }
            });
          });
        }
      });
    });
  }

  // Assignments Trigger ------------------------
  assignmentsTrigger() {
    this.rootRef.child('assignments').endAt().limitToLast(1).on('child_added', function (snapshot) {
      var assignmentId = snapshot.getKey();
      var description = snapshot.val()['description'];
      var createdBy = snapshot.val()['createdby'];
      var userKeys = [];
      var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(assignmentId);
      notificationRef.once("value", function (snap) {
        if (!snap.exists()) {
          var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
          councilUsersRef.once('value').then(function (usrsSnapshot) {
            usrsSnapshot.forEach(usrObj => {
              var id = usrObj.val()['userid'];
              userKeys.push(id);
              if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                var usrRef = firebase.database().ref().child('users/' + id);
                usrRef.once('value').then(function (usrSnapshot) {
                  if (usrSnapshot.val()['isactive'] === true) {
                    var email = usrSnapshot.val()['email'];

                    firebase.database().ref().child('notifications').push({
                      userid: id,
                      nodeid: assignmentId,
                      nodename: 'assignments',
                      description: description,
                      action: 'create',
                      text: 'New Assignment ' + '\"' + description + '\"' + ' is posted',
                      createddate: new Date().toDateString(),
                      createdtime: new Date().toTimeString(),
                      createdby: createdBy,
                      isread: false
                    }).catch(err => { throw err });

                    var notification = {
                      "emails": email,
                      "profile": "ldspro",
                      "notification": {
                        "title": "LDS Councils",
                        "message": 'New Assignment - ' + description,
                        "android": {
                          "title": "LDS Councils",
                          "message": 'New Assignment - ' + description
                        },
                        "ios": {
                          "title": "LDS Councils",
                          "message": 'New Assignment - ' + description
                        }
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
                  }
                });
              }
            });
          });
        }
      });
    });
  }

  // Discussions Trigger ------------------------
  discussionsTrigger() {
    this.rootRef.child('discussions').endAt().limitToLast(1).on('child_added', function (snapshot) {
      var discussionId = snapshot.getKey();
      var description = snapshot.val()['topic'];
      var createdBy = snapshot.val()['createdBy'];
      var userKeys = [];
      var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(discussionId);
      notificationRef.once("value", function (snap) {
        if (!snap.exists()) {
          var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
          councilUsersRef.once('value').then(function (usrsSnapshot) {
            usrsSnapshot.forEach(usrObj => {
              var id = usrObj.val()['userid'];
              userKeys.push(id);
              if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                var usrRef = firebase.database().ref().child('users/' + id);
                usrRef.once('value').then(function (usrSnapshot) {
                  if (usrSnapshot.val()['isactive'] === true) {
                    var email = usrSnapshot.val()['email'];

                    firebase.database().ref().child('notifications').push({
                      userid: id,
                      nodeid: discussionId,
                      nodename: 'discussions',
                      description: description,
                      action: 'create',
                      text: 'New Council Discussion ' + '\"' + description + '\"' + ' is started',
                      createddate: new Date().toDateString(),
                      createdtime: new Date().toTimeString(),
                      createdby: createdBy,
                      isread: false
                    }).catch(err => { throw err });

                    var notification = {
                      "emails": email,
                      "profile": "ldspro",
                      "notification": {
                        "title": "LDS Councils",
                        "message": 'New Council Discussion - ' + description,
                        "android": {
                          "title": "LDS Councils",
                          "message": 'New Council Discussion - ' + description
                        },
                        "ios": {
                          "title": "LDS Councils",
                          "message": 'New Council Discussion - ' + description
                        }
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
                  }
                });
              }
            });
          });
        }
      });
    });
  }

  // Private Discussions Trigger ------------------------
  privateDiscussionsTrigger() {
    this.rootRef.child('privatediscussions').endAt().limitToLast(1).on('child_added', function (snapshot) {
      var privateDiscussionId = snapshot.getKey();
      var description = snapshot.val()['createdUserName'];
      var createdBy = snapshot.val()['createdUserId'];
      var userId = snapshot.val()['otherUserId'];
      var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(privateDiscussionId);
      notificationRef.once("value", function (snap) {
        if (!snap.exists()) {
          var email = snapshot.val()['otherUserEmail'];

          firebase.database().ref().child('notifications').push({
            userid: userId,
            nodeid: privateDiscussionId,
            nodename: 'privatediscussions',
            description: description,
            action: 'create',
            text: description + ' created private discussion with you',
            createddate: new Date().toDateString(),
            createdtime: new Date().toTimeString(),
            createdby: createdBy,
            isread: false
          }).catch(err => { throw err });

          var notification = {
            "emails": email,
            "profile": "ldspro",
            "notification": {
              "title": "LDS Councils",
              "message": 'New Private Discussion - ' + description + ' created private discussion with you',
              "android": {
                "title": "LDS Councils",
                "message": 'New Private Discussion - ' + description + ' created private discussion with you'
              },
              "ios": {
                "title": "LDS Councils",
                "message": 'New Private Discussion - ' + description + ' created private discussion with you'
              }
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
        }
      });
    });
  }

  // Private Discussions Update Trigger ------------------------
  privateDiscussionsUpdateTrigger() {
    this.rootRef.child('privatediscussions').on('child_changed', function (snapshot) {
      var privateDiscussionId = snapshot.getKey();
      console.log('snapp', snapshot.val());
    });
  }

  // Assignments Update Trigger ------------------------
  assignmentsUpdateTrigger() {
    this.rootRef.child('assignments').on('child_changed', function (snapshot) {
      console.log('snap', snapshot.val());
      var assignmentId = snapshot.getKey();
      var description = snapshot.val()['description'];
      var createdBy = snapshot.val()['createdby'];
      var userKeys = [];

      if (snapshot.val()['isCompleted'] === true) {
        var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(assignmentId);
        notificationRef.once("value", function (snap) {
          if (!snap.exists()) {
            var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
            councilUsersRef.once('value').then(function (usrsSnapshot) {
              usrsSnapshot.forEach(usrObj => {
                var id = usrObj.val()['userid'];
                userKeys.push(id);
                if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                  var usrRef = firebase.database().ref().child('users/' + id);
                  usrRef.once('value').then(function (usrSnapshot) {
                    if (usrSnapshot.val()['isactive'] === true) {
                      var email = usrSnapshot.val()['email'];

                      firebase.database().ref().child('notifications').push({
                        userid: id,
                        nodeid: assignmentId,
                        nodename: 'assignments',
                        description: description,
                        action: 'update',
                        text: 'Assignment ' + '\"' + description + '\"' + ' is completed',
                        createddate: new Date().toDateString(),
                        createdtime: new Date().toTimeString(),
                        createdby: createdBy,
                        isread: false
                      }).catch(err => { throw err });

                      var notification = {
                        "emails": email,
                        "profile": "ldspro",
                        "notification": {
                          "title": "LDS Councils",
                          "message": 'Assignment Completed - ' + description,
                          "android": {
                            "title": "LDS Councils",
                            "message": 'Assignment Completed - ' + description,
                          },
                          "ios": {
                            "title": "LDS Councils",
                            "message": 'Assignment Completed - ' + description,
                          }
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
                    }
                  });
                }
              });
            });
          }
        });
      }
    });
  }

  // Assignments Delete Trigger ------------------------
  assignmentsDeleteTrigger() {
    this.rootRef.child('assignments').on('child_removed', function (snapshot) {
      console.log('snap', snapshot.val());
      var assignmentId = snapshot.getKey();
      var description = snapshot.val()['description'];
      var createdBy = snapshot.val()['createdby'];
      var userKeys = [];

      var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
      councilUsersRef.once('value').then(function (usrsSnapshot) {
        usrsSnapshot.forEach(usrObj => {
          var id = usrObj.val()['userid'];
          userKeys.push(id);
          if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
            var usrRef = firebase.database().ref().child('users/' + id);
            usrRef.once('value').then(function (usrSnapshot) {
              if (usrSnapshot.val()['isactive'] === true) {
                var email = usrSnapshot.val()['email'];

                var notification = {
                  "emails": email,
                  "profile": "ldspro",
                  "notification": {
                    "title": "LDS Councils",
                    "message": 'Assignment Deleted - ' + description,
                    "android": {
                      "title": "LDS Councils",
                      "message": 'Assignment Deleted - ' + description,
                    },
                    "ios": {
                      "title": "LDS Councils",
                      "message": 'Assignment Deleted - ' + description,
                    }
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
              }
            });
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
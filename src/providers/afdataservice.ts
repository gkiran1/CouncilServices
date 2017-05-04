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
                var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                notSettingsRef.once('value', function (notSnap) {
                  if (notSnap.exists()) {
                    notSnap.forEach(notSetting => {
                      if (notSetting.val()['allactivity'] === true || notSetting.val()['agendas'] === true) {
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
                              text: 'New ' + description + ' agenda posted',
                              createddate: new Date().toISOString(),
                              createdtime: new Date().toTimeString(),
                              createdby: createdBy,
                              isread: false
                            }).catch(err => { throw err });

                            var notification = {
                              "emails": email,
                              "profile": "ldspro",
                              "notification": {
                                "title": "LDS Councils",
                                "message": 'New ' + description + ' agenda posted',
                                "android": {
                                  "title": "LDS Councils",
                                  "message": 'New ' + description + ' agenda posted',
                                },
                                "ios": {
                                  "title": "LDS Councils",
                                  "message": 'New ' + description + ' agenda posted',
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

                        return true; // to stop the loop.
                      }
                    });
                  }
                });
              }
            });
          });
        }
      });
    });
  }

  // Assignments Update & Delete Trigger ------------------------
  agendasUpdateTrigger() {
    this.rootRef.child('agendas').on('child_changed', function (snapshot) {

      var agendaId = snapshot.getKey();
      var description = snapshot.val()['agendacouncil'];
      var createdBy = snapshot.val()['createdby'];
      var editedBy = snapshot.val()['editedby'];
      var userKeys = [];

      var action = '';
      var txt = '';
      var text = '';

      if (snapshot.val()['isactive'] === false) {  // condition check order should not change 
        action = 'deleted';
        txt = 'delete';
        text = description + ' agenda ' + 'deleted';
      }
      else if (snapshot.val()['isactive'] === true) {
        action = 'edited';
        txt = 'edit';
        text = editedBy + ' edited ' + description + ' agenda';
      }

      if (action === 'deleted' || action === 'edited') {
        var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(agendaId);
        notificationRef.once("value", function (snap) {
          if ((snap.exists() && action === 'completed') || (snap.exists() && action === 'deleted') || (snap.exists() && action === 'edited')) {
            var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
            councilUsersRef.once('value').then(function (usrsSnapshot) {
              usrsSnapshot.forEach(usrObj => {
                var id = usrObj.val()['userid'];
                userKeys.push(id);
                if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                  var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                  notSettingsRef.once('value', function (notSnap) {
                    if (notSnap.exists()) {
                      notSnap.forEach(notSetting => {
                        if (notSetting.val()['allactivity'] === true || notSetting.val()['agendas'] === true) {
                          var usrRef = firebase.database().ref().child('users/' + id);
                          usrRef.once('value').then(function (usrSnapshot) {
                            if (usrSnapshot.val()['isactive'] === true) {
                              var email = usrSnapshot.val()['email'];

                              firebase.database().ref().child('notifications').push({
                                userid: id,
                                nodeid: agendaId,
                                nodename: 'agendas',
                                description: description,
                                action: txt,
                                text: text,
                                createddate: new Date().toISOString(),
                                createdtime: new Date().toTimeString(),
                                createdby: createdBy,
                                isread: false
                              }).catch(err => { throw err });

                              var notification = {
                                "emails": email,
                                "profile": "ldspro",
                                "notification": {
                                  "title": "LDS Councils",
                                  "message": text,
                                  "android": {
                                    "title": "LDS Councils",
                                    "message": text,
                                  },
                                  "ios": {
                                    "title": "LDS Councils",
                                    "message": text,
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
                          return true; // to stop the loop.
                        }
                      });
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

  // Assignments Trigger ------------------------
  assignmentsTrigger() {
    this.rootRef.child('assignments').endAt().limitToLast(1).on('child_added', function (snapshot) {
      var assignmentId = snapshot.getKey();
      var description = snapshot.val()['description'];
      var assignedUser = snapshot.val()['assigneduser'];
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
                var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                notSettingsRef.once('value', function (notSnap) {
                  if (notSnap.exists()) {
                    notSnap.forEach(notSetting => {
                      if (notSetting.val()['allactivity'] === true || notSetting.val()['assignments'] === true) {
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
                              text: 'Assignment ' + description + ' accepted by ' + assignedUser,
                              createddate: new Date().toISOString(),
                              createdtime: new Date().toTimeString(),
                              createdby: createdBy,
                              isread: false
                            }).catch(err => { throw err });

                            var notification = {
                              "emails": email,
                              "profile": "ldspro",
                              "notification": {
                                "title": "LDS Councils",
                                "message": 'Assignment ' + description + ' accepted by ' + assignedUser,
                                "android": {
                                  "title": "LDS Councils",
                                  "message": 'Assignment ' + description + ' accepted by ' + assignedUser,
                                },
                                "ios": {
                                  "title": "LDS Councils",
                                  "message": 'Assignment ' + description + ' accepted by ' + assignedUser,
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
                        return true; // to stop the loop.
                      }
                    });
                  }
                });
              }
            });
          });
        }
      });
    });
  }

  // Assignments Update & Delete Trigger ------------------------
  assignmentsUpdateTrigger() {
    this.rootRef.child('assignments').on('child_changed', function (snapshot) {
      var assignmentId = snapshot.getKey();
      var description = snapshot.val()['description'];
      var createdBy = snapshot.val()['createdby'];
      var completedBy = snapshot.val()['completedby'];
      var userKeys = [];

      var action = '';
      var txt = '';
      var text = '';

      if (snapshot.val()['isactive'] === false) {  // condition check order should not change 
        action = 'deleted';
        txt = 'delete';
        text = 'Assignment ' + description + ' deleted';
      }
      else if (snapshot.val()['isCompleted'] === true) {
        action = 'completed';
        txt = 'update';
        text = completedBy + ' completed ' + 'assignment ' + description;
      }
      else if (snapshot.val()['isCompleted'] === false) {
        action = 'edited';
        txt = 'edit';
        text = 'Assignment ' + description + ' edited';
      }

      if (action === 'deleted' || action === 'completed' || action === 'edited') {
        var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(assignmentId);
        notificationRef.once("value", function (snap) {
          if ((snap.exists() && action === 'completed') || (snap.exists() && action === 'deleted') || (snap.exists() && action === 'edited')) {
            var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
            councilUsersRef.once('value').then(function (usrsSnapshot) {
              usrsSnapshot.forEach(usrObj => {
                var id = usrObj.val()['userid'];
                userKeys.push(id);
                if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                  var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                  notSettingsRef.once('value', function (notSnap) {
                    if (notSnap.exists()) {
                      notSnap.forEach(notSetting => {
                        if (notSetting.val()['allactivity'] === true || notSetting.val()['assignments'] === true) {
                          var usrRef = firebase.database().ref().child('users/' + id);
                          usrRef.once('value').then(function (usrSnapshot) {
                            if (usrSnapshot.val()['isactive'] === true) {
                              var email = usrSnapshot.val()['email'];

                              firebase.database().ref().child('notifications').push({
                                userid: id,
                                nodeid: assignmentId,
                                nodename: 'assignments',
                                description: description,
                                action: txt,
                                text: text,
                                createddate: new Date().toISOString(),
                                createdtime: new Date().toTimeString(),
                                createdby: createdBy,
                                isread: false
                              }).catch(err => { throw err });

                              var notification = {
                                "emails": email,
                                "profile": "ldspro",
                                "notification": {
                                  "title": "LDS Councils",
                                  "message": text,
                                  "android": {
                                    "title": "LDS Councils",
                                    "message": text,
                                  },
                                  "ios": {
                                    "title": "LDS Councils",
                                    "message": text,
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
                          return true; // to stop the loop.
                        }
                      });
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
  // assignmentsDeleteTrigger() {
  //   this.rootRef.child('assignments').on('child_removed', function (snapshot) {
  //     var assignmentId = snapshot.getKey();
  //     var description = snapshot.val()['description'];
  //     var createdBy = snapshot.val()['createdby'];
  //     var userKeys = [];

  //     var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
  //     councilUsersRef.once('value').then(function (usrsSnapshot) {
  //       usrsSnapshot.forEach(usrObj => {
  //         var id = usrObj.val()['userid'];
  //         userKeys.push(id);
  //         if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
  //           var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
  //           notSettingsRef.once('value', function (notSnap) {
  //             if (notSnap.exists()) {
  //               notSnap.forEach(notSetting => {
  //                 if (notSetting.val()['allactivity'] === true || notSetting.val()['closingassignment'] === true) {
  //                   var usrRef = firebase.database().ref().child('users/' + id);
  //                   usrRef.once('value').then(function (usrSnapshot) {
  //                     if (usrSnapshot.val()['isactive'] === true) {
  //                       var email = usrSnapshot.val()['email'];

  //                       var notification = {
  //                         "emails": email,
  //                         "profile": "ldspro",
  //                         "notification": {
  //                           "title": "LDS Councils",
  //                           "message": 'Assignment Deleted - ' + description,
  //                           "android": {
  //                             "title": "LDS Councils",
  //                             "message": 'Assignment Deleted - ' + description,
  //                           },
  //                           "ios": {
  //                             "title": "LDS Councils",
  //                             "message": 'Assignment Deleted - ' + description,
  //                           }
  //                         }
  //                       };
  //                       var req = https.request(options, function (res) {
  //                         console.log('STATUS: ' + res.statusCode);
  //                         console.log('HEADERS: ' + JSON.stringify(res.headers));
  //                         res.setEncoding('utf8');
  //                         res.on('data', function (chunk) {
  //                           console.log('BODY: ' + chunk);
  //                         });
  //                       });
  //                       req.on('error', function (e) {
  //                         console.log('problem with request: ' + e.message);
  //                       });
  //                       req.write(JSON.stringify(notification));
  //                       req.end();
  //                     }
  //                   });
  //                   return true; // to stop the loop.
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //     });
  //   });
  // }

  //Council Discussions Trigger ------------------------
  discussionsTrigger() {
    this.rootRef.child('discussions').endAt().limitToLast(1).on('child_added', function (snapshot) {
      var discussionId = snapshot.getKey();
      var description = snapshot.val()['topic'];
      var createdBy = snapshot.val()['createdBy'];
      var councilName = snapshot.val()['councilname'];
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
                var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                notSettingsRef.once('value', function (notSnap) {
                  if (notSnap.exists()) {
                    notSnap.forEach(notSetting => {
                      if (notSetting.val()['allactivity'] === true || notSetting.val()['discussions'] === true) {
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
                              text: 'Discussion ' + description + ' created in ' + councilName,
                              createddate: new Date().toISOString(),
                              createdtime: new Date().toTimeString(),
                              createdby: createdBy,
                              isread: false
                            }).catch(err => { throw err });

                            var notification = {
                              "emails": email,
                              "profile": "ldspro",
                              "notification": {
                                "title": "LDS Councils",
                                "message": 'Discussion ' + description + ' created in ' + councilName,
                                "android": {
                                  "title": "LDS Councils",
                                  "message": 'Discussion ' + description + ' created in ' + councilName,
                                },
                                "ios": {
                                  "title": "LDS Councils",
                                  "message": 'Discussion ' + description + ' created in ' + councilName,
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
                        return true; // to stop the loop.
                      }
                    });
                  }
                });
              }
            });
          });
        }
      });
    });
  }

  // Council Discussions Update Trigger ------------------------
  discussionsUpdateTrigger() {
    this.rootRef.child('discussions').on('child_changed', function (snapshot) {
      if (snapshot.val()['isNotificationReq'] === true) {
        var description = snapshot.val()['topic'];
        var userName = snapshot.val()['lastMsgSentUser'];
        var msg = snapshot.val()['lastMsg'];
        var userKeys = [];
        var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
        councilUsersRef.once('value').then(function (usrsSnapshot) {
          usrsSnapshot.forEach(usrObj => {
            var id = usrObj.val()['userid'];
            userKeys.push(id);
            if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
              var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
              notSettingsRef.once('value', function (notSnap) {
                if (notSnap.exists()) {
                  notSnap.forEach(notSetting => {
                    if (notSetting.val()['allactivity'] === true || notSetting.val()['discussions'] === true) {
                      var usrRef = firebase.database().ref().child('users/' + id);
                      usrRef.once('value').then(function (usrSnapshot) {
                        if (usrSnapshot.val()['isactive'] === true) {
                          var email = usrSnapshot.val()['email'];
                          var notification = {
                            "emails": email,
                            "profile": "ldspro",
                            "notification": {
                              "title": "LDS Councils",
                              "message": 'Council Discussion - ' + description + ' -  @' + userName + ':  ' + msg,
                              "android": {
                                "title": "LDS Councils",
                                "message": 'Council Discussion - ' + description + ' -  @' + userName + ':  ' + msg,
                              },
                              "ios": {
                                "title": "LDS Councils",
                                "message": 'Council Discussion - ' + description + ' -  @' + userName + ':  ' + msg,
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
                      return true; // to stop the loop.
                    }
                  });
                }
              });
            }
          });
        });
      }
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
          var id = snapshot.val()['otherUserId'];
          var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
          notSettingsRef.once('value', function (notSnap) {
            if (notSnap.exists()) {
              notSnap.forEach(notSetting => {
                if (notSetting.val()['allactivity'] === true || notSetting.val()['pvtdiscussions'] === true) {
                  firebase.database().ref().child('notifications').push({
                    userid: userId,
                    nodeid: privateDiscussionId,
                    nodename: 'privatediscussions',
                    description: description,
                    action: 'create',
                    text: "<h3>" + "<span class='nottxt-lbl'>" + description + "</span>" + " private discussion invite" + "</h3>",
                    createddate: new Date().toISOString(),
                    createdtime: new Date().toTimeString(),
                    createdby: createdBy,
                    isread: false
                  }).catch(err => { throw err });

                  var notification = {
                    "emails": email,
                    "profile": "ldspro",
                    "notification": {
                      "title": "LDS Councils",
                      "message": description + ' private discussion invite',
                      "android": {
                        "title": "LDS Councils",
                        "message": description + ' private discussion invite',
                      },
                      "ios": {
                        "title": "LDS Councils",
                        "message": description + ' private discussion invite',
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

                  return true; // to stop the loop.
                }
              });
            }
          });
        }
      });
    });
  }

  // Private Discussions Update Trigger ------------------------
  privateDiscussionsUpdateTrigger() {
    this.rootRef.child('privatediscussions').on('child_changed', function (snapshot) {
      if (snapshot.val()['isNotificationReq'] === true) {
        var description = snapshot.val()['lastMsg']['text'];
        var email = '';
        var name = '';
        var id = '';
        if (snapshot.val()['lastMsg']['userId'] !== snapshot.val()['createdUserId']) {
          email = snapshot.val()['createdUserEmail'];
          name = snapshot.val()['otherUserName'];
          id = snapshot.val()['createdUserId'];
        }
        else if (snapshot.val()['lastMsg']['userId'] !== snapshot.val()['otherUserId']) {
          email = snapshot.val()['otherUserEmail'];
          name = snapshot.val()['createdUserName'];
          id = snapshot.val()['otherUserId'];
        }
        var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
        notSettingsRef.once('value', function (notSnap) {
          if (notSnap.exists()) {
            notSnap.forEach(notSetting => {
              if (notSetting.val()['allactivity'] === true || notSetting.val()['pvtdiscussions'] === true) {
                var notification = {
                  "emails": email,
                  "profile": "ldspro",
                  "notification": {
                    "title": "LDS Councils",
                    "message": 'Private Discussion - ' + ' @' + name + ': ' + description,
                    "android": {
                      "title": "LDS Councils",
                      "message": 'Private Discussion - ' + ' @' + name + ': ' + description,
                    },
                    "ios": {
                      "title": "LDS Councils",
                      "message": 'Private Discussion - ' + ' @' + name + ': ' + description,
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
                return true; // to stop the loop.
              }
            });
          }
        });
      }
    });
  }

  // User Update Trigger ------------------------
  userUpdateTrigger() {
    this.rootRef.child('users').on('child_changed', function (snapshot) {
      var id = snapshot.getKey();
      var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
      notSettingsRef.once('value', function (notSnap) {
        if (notSnap.exists()) {
          notSnap.forEach(notSetting => {
            if (notSetting.val()['allactivity'] === true || notSetting.val()['actinactaccount'] === true) {
              if (snapshot.val()['isnotificationreq'] === true) {
                var isactive = snapshot.val()['isactive'];
                var description = '';
                var email = snapshot.val()['email'];
                if (isactive === false) {
                  description = 'Your account is deactivated'
                }
                else if (isactive === true) {
                  description = 'Your account is activated'
                }
                var notification = {
                  "emails": email,
                  "profile": "ldspro",
                  "notification": {
                    "title": "LDS Councils",
                    "message": description,
                    "android": {
                      "title": "LDS Councils",
                      "message": description,
                    },
                    "ios": {
                      "title": "LDS Councils",
                      "message": description,
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
              return true; // to stop the loop.
            }
          });
        }
      });
    });
  }

  // Files Trigger ------------------------
  filesTrigger() {
    this.rootRef.child('files').endAt().limitToLast(1).on('child_added', function (snapshot) {
      var fileId = snapshot.getKey();
      var description = snapshot.val()['councilname'];
      var createdBy = snapshot.val()['createdBy'];
      var createdUser = snapshot.val()['createdUser'];
      var name = snapshot.val()['filename'];
      var userKeys = [];
      var notificationRef = firebase.database().ref().child('notifications').orderByChild('nodeid').equalTo(fileId);
      notificationRef.once("value", function (snap) {
        if (!snap.exists()) {
          var councilUsersRef = firebase.database().ref().child('usercouncils').orderByChild('councilid').equalTo(snapshot.val()['councilid']);
          councilUsersRef.once('value').then(function (usrsSnapshot) {
            usrsSnapshot.forEach(usrObj => {
              var id = usrObj.val()['userid'];
              userKeys.push(id);
              if (userKeys.indexOf(id) === userKeys.lastIndexOf(id)) {
                var notSettingsRef = firebase.database().ref().child('notificationsettings').orderByChild('userid').equalTo(id);
                notSettingsRef.once('value', function (notSnap) {
                  if (notSnap.exists()) {
                    notSnap.forEach(notSetting => {
                      if (notSetting.val()['allactivity'] === true || notSetting.val()['files'] === true) {
                        var usrRef = firebase.database().ref().child('users/' + id);
                        usrRef.once('value').then(function (usrSnapshot) {
                          if (usrSnapshot.val()['isactive'] === true) {
                            var email = usrSnapshot.val()['email'];

                            var txt = '';

                            if (createdBy === id) {
                              txt = 'New ' + name + ' file uploaded';
                              // txt = "<h3>" + "<span class='nottxt-lbl'>" + "You" + "</span>" + " shared a file " + name + "</h3>";
                            }
                            else {
                              txt = 'New ' + name + ' file uploaded';
                              // txt = "<h3>" + "<span class='nottxt-lbl'>" + createdUser + "</span>" + " sent you a file " + name + "</h3>";
                            }

                            firebase.database().ref().child('notifications').push({
                              userid: id,
                              nodeid: fileId,
                              nodename: 'files',
                              description: description,
                              action: 'create',
                              text: txt,
                              createddate: new Date().toISOString(),
                              createdtime: new Date().toTimeString(),
                              createdby: createdBy,
                              isread: false
                            }).catch(err => { throw err });

                            var notification = {
                              "emails": email,
                              "profile": "ldspro",
                              "notification": {
                                "title": "LDS Councils",
                                "message": createdUser + ' sent you a file ' + name,
                                "android": {
                                  "title": "LDS Councils",
                                  "message": createdUser + ' sent you a file ' + name,
                                },
                                "ios": {
                                  "title": "LDS Councils",
                                  "message": createdUser + ' sent you a file ' + name,
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
                        return true; // to stop the loop.
                      }
                    });
                  }
                });
              }
            });
          });
        }
      });
    });
  }

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
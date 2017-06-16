import { Component } from '@angular/core';
import { AfDataService } from 'providers/afdataservice';
import { Notifications } from 'providers/notifications';
import { AuthService } from 'providers/authservice';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AfDataService, Notifications],

})
export class AppComponent {

  clicked: string = 'units';
  pageTitle: string = 'Councils';

  constructor(public af: AfDataService, public notification: Notifications, private router: Router, private auth: AuthService) {
    //this.registerPushTriggers();
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/admin.datatransfer');

    if (!auth.checkCredentials()) {
      firebase.auth().signInWithPopup(provider).then((result) => {
        localStorage.setItem("user", result.user);
        this.router.navigate(['products']);
        return true;
      }).catch(err => {
        console.log('Google Authentication failed', err);
      })
    }

  }

  registerPushTriggers() {
    this.af.agendasTrigger();
    this.af.agendasUpdateTrigger();
    this.af.assignmentsTrigger();
    this.af.assignmentsUpdateTrigger();
    this.af.discussionsTrigger();
    this.af.discussionsUpdateTrigger();
    this.af.privateDiscussionsTrigger();
    this.af.privateDiscussionsUpdateTrigger();
    this.af.userUpdateTrigger();
    this.af.filesTrigger();
  }

}

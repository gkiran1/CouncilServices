import { Component, OnInit } from '@angular/core';
import { AfDataService } from 'providers/afdataservice';
import { Notifications } from 'providers/notifications';
// import { AuthService } from 'providers/authservice';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
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
  isLoading = false;
  constructor(public af: AfDataService, 
              public notification: Notifications, 
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    //router.events.subscribe((url:any) => console.log(url));
    //console.log(activatedRoute.url);
    //this.registerPushTriggers();
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/admin.datatransfer');
    
    // // if (!auth.checkCredentials()) {
    //   firebase.auth().signInWithPopup(provider).then((result) => {
    //     localStorage.setItem("user", result.user);
    //     this.router.navigate(['products']);
    //     return true;
    //   }).catch(err => {
        
    //     console.log('Google Authentication failed', err);
    //     this.router.navigate(['logout']);
    //   })
    // // }

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

  // ngOnInit() {
  //       // TODO: assign proper type to event
  //       this.router.events.subscribe((event: any): void => {
  //           this.navigationInterceptor(event);
  //       });
  //   }

  //   navigationInterceptor(event): void {
  //       if (event instanceof NavigationStart) {
  //           this.isLoading = true;
  //       }
  //       if (event instanceof NavigationEnd) {
  //           setTimeout(() => this.isLoading = false, 5000);
  //       }
  //       if (event instanceof NavigationCancel) {
  //           this.isLoading = false;
  //       }
  //       if (event instanceof NavigationError) {
  //           this.isLoading = false;
  //       }
  //   }

}

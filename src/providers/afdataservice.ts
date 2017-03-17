import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable, Subject } from "rxjs/Rx";

@Injectable()
export class AfDataService {
  users: FirebaseListObservable<any[]>;
  rootRef: any;

  constructor(public af: AngularFire) {
    this.users = af.database.list('user');
    this.rootRef = firebase.database().ref();
    
  }

  entityTrigger(entity:string):any {
      
      let entityId:any;
    this.rootRef.child(entity).endAt().limitToLast(1).on('child_added',function(snapshot){
        entityId = snapshot.getKey();
      });
      if(entityId !== undefined)
        return new Promise(entityId);
      else
        return new Promise(null);
  }

  assignmentTrigger() {
     this.rootRef.child('assignments').endAt().limitToLast(1).on('child_added',function(snapshot){
        return snapshot.getKey();
      });
  }

  councilsDiscussionTrigger() {
this.rootRef.child('councilsdiscussions').endAt().limitToLast(1).on('child_added',function(snapshot){
        return snapshot.getKey();
      });
  }

  privateDiscussionTrigger() {
this.rootRef.child('privatediscussions').endAt().limitToLast(1).on('child_added',function(snapshot){
        return snapshot.getKey();
      });
  }

  sendNotification(emails:string[]) {
      
      
  }

  getAgendaEmails(agendaId:string) {

  }

  getUserEmails(key:string, entity: string) {
      
  }

  getInviteeMail(key:string):any {
       var invitee = this.af.database.object('invitees/' + key);
       if(invitee !== undefined) {
           return new Promise(invitee["email"]);
       }
       else {
           return new Promise(null);
       }
  }

  

  createUser() {
      firebase.database().ref().child('user').push(
                    {
                        name: "test1",
                        username: "username1"
                    })
                    .then(() => {
                        return "User is successfully invited..."
                    })
                    .catch(err => { throw err });
  }

  getUserByKey(key: any){
      
        return this.af.database.object('user/' + key);
    
  }

}
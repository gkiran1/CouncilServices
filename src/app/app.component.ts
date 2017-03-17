import { Component } from '@angular/core';
import { AfDataService } from 'providers/afdataservice';
import { Notifications } from 'providers/notifications';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AfDataService, Notifications],
  
})
export class AppComponent {
  title = 'Council App Trigger Serivces Lanuched!';
  //af: any;
  constructor(public af:AfDataService, public notification:Notifications) {
    this.registerPushTriggers();
  }

  registerPushTriggers() {
    this.af.entityTrigger('agendas').then(function(agendaId) {
      var emails = this.af.getUserEmails(agendaId, "agendas");
      this.notification.sendPush(emails);
    });
    this.af.entityTrigger('assignments').then(function(agendaId) {
      var emails = this.af.getUserEmails(agendaId, "assignments");
      this.notification.sendPush(emails);
    });
    this.af.entityTrigger('councildiscussions').then(function(agendaId) {
      var emails = this.af.getUserEmails(agendaId, "councildiscussions");
      this.notification.sendPush(emails);
    });
    this.af.entityTrigger('privatediscussions').then(function(agendaId) {
      var emails = this.af.getUserEmails(agendaId, "privatediscussions");
      this.notification.sendPush(emails);
    });
  }

  registerEmailTriggers() {
    this.af.entityTrigger('invitees').then(function(inviteeId) {
      var email = this.af.getInviteeMail(inviteeId);
      this.notification.sendMail(email, "Councils App - Invitiation", "You are invited from Councils App. Click Android/Apple to download the app");
    });
  }

  

}

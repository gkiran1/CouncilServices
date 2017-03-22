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
  constructor(public af: AfDataService, public notification: Notifications) {
    this.registerPushTriggers();
  }

  registerPushTriggers() {
    this.af.entityTrigger('agendas');
    this.af.entityTrigger('assignments');
    this.af.entityTrigger('discussions');
  }

  registerEmailTriggers() {
    // this.af.entityTrigger1('invitees').then(function (inviteeId) {
    //   var email = this.af.getInviteeMail(inviteeId);
    //   this.notification.sendMail(email, "Councils App - Invitiation", "You are invited from Councils App. Click Android/Apple to download the app");
    // });
  }

}

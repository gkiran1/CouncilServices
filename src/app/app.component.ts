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

  clicked: string = 'units';
  pageTitle: string = 'Councils';

  constructor(public af: AfDataService, public notification: Notifications) {
    //this.registerPushTriggers();
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

import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AboutUs } from './about.model';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { Observable } from "rxjs/Rx";

@Component({
    selector: 'about-uss',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})

export class AboutusComponent {
    about: AboutUs;

    constructor() {
        this.about = new AboutUs();
    }

    Save(event: any) {
        this.about.createddate = ((new Date()).toString()).slice(0, 16)

        firebase.database().ref().child('aboutus').push({
            "softwareversion": this.about.softwareversion,
            "termsofuse": this.about.termsofuse,
            "privacypolicy": this.about.privacypolicy,
            "email": this.about.email,
            "web": this.about.web,
            "phone": this.about.phone,
            "createddate": firebase.database.ServerValue.TIMESTAMP
        }).catch(err => { throw err });
    }

}
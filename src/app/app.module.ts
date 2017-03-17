import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';

export const firebaseConfig = {
    apiKey: "AIzaSyAAXPFHhBKRJMJtws5Ig09_H3HvB0fRh3o",
    authDomain: "test-daaa0.firebaseapp.com",
    databaseURL: "https://test-daaa0.firebaseio.com",
    storageBucket: "test-daaa0.appspot.com",
    messagingSenderId: "826208238666"
  };


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

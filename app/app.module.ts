import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase';

// import { FirebaseConfig } from './../environments/firebase/firebase-config';

/* Feature Modules */
import { ProductModule } from './products/product.module';

export const FirebaseConfig = {
    apiKey: "AIzaSyDauCRlokcRecT283636ODNP2z4qZe2oPA",
    authDomain: "lds-councils-8f56b.firebaseapp.com",
    databaseURL: "https://lds-councils-8f56b.firebaseio.com",
    storageBucket: "lds-councils-8f56b.appspot.com",
    messagingSenderId: "619253720821"
}

@NgModule({
  imports: [
    BrowserModule,
     AngularFireModule.initializeApp({
    apiKey: "AIzaSyDauCRlokcRecT283636ODNP2z4qZe2oPA",
    authDomain: "lds-councils-8f56b.firebaseapp.com",
    databaseURL: "https://lds-councils-8f56b.firebaseio.com",
    storageBucket: "lds-councils-8f56b.appspot.com",
    messagingSenderId: "619253720821"
    }),
    HttpModule,
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
    ]),
    ProductModule
  ],
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

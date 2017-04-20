import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { FirebaseConfig } from './../environments/firebase/firebase-config';
import { ProductModule } from './products/product.module';
import { RouterModule, Routes } from '@angular/router';
//import { WelcomeComponent } from './home/welcome.component';
import { AboutusComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(FirebaseConfig),
    RouterModule.forRoot([
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'about', component: AboutusComponent },
    ]),
    ProductModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

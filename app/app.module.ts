import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { AngularFireModule } from 'angularfire2';

/* Feature Modules */
import { ProductModule } from './products/product.module';

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig)
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

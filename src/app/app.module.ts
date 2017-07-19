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
// import { AuthService } from 'providers/authservice';
//import { WelcomeComponent } from './home/welcome.component';
import { AboutusComponent } from './about/about.component';
import { FroalaComponent } from "./about/froala.component";
import { ProductListComponent } from './products/product-list.component';

import { FroalaEditorModule } from './../editor/index';
import { FroalaViewModule } from './../view/index';
// import { Logout } from './logout/logout';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/auth.guard';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutusComponent,
    FroalaComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FroalaEditorModule,
    FroalaViewModule,
    AngularFireModule.initializeApp(FirebaseConfig),
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
      // { path: '**', redirectTo: '', pathMatch: 'full' },
      { path: 'about', component: AboutusComponent, canActivate: [AuthGuard] },
      { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      {
        path: 'home', component: HomeComponent,
        children: [
          { path: '', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuard] },
          { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
          { path: 'about', component: AboutusComponent, canActivate: [AuthGuard] }
        ], canActivate: [AuthGuard]
      }
    ]),
    ProductModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }

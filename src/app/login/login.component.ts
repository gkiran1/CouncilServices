import { Component } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AppComponent } from '../app.component';
import { AngularFire } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    email;
    password;
    fireAuth;
    constructor(public router: Router, public af: AngularFire, public afAuth: AngularFireAuth) {
        this.fireAuth = firebase.auth();
        console.log();
    }
    login() {
        this.validateUser(this.email, this.password)
            .then(id => {
                console.log(id);
                sessionStorage.setItem('uid', id);
                this.router.navigate(['/home']);
            })
            .catch(err => {
                alert('incorrect email or password!');
                console.log('Login Failed::', err);
            })

    }
    hasFocus(label, txtBox) {
        document.getElementById(label).setAttribute("class", "input-has-focus");
        document.getElementById(label).style.color = "#3cb18a";
        document.getElementById(txtBox).style.borderBottomColor = "#e8e9eb";
    }
    lostFocus(t, e) {
        if (e === 'email' && !this.email) {
            document.getElementById(t).removeAttribute("class");
            document.getElementById(t).style.color = "#A9AAAC";
        }
        if (e === 'password' && !this.password) {
            document.getElementById(t).removeAttribute("class");
            document.getElementById(t).style.color = "#A9AAAC";
        }
    }

    validateUser(email: string, password: string) {
        return this.fireAuth.signInWithEmailAndPassword(email, password)
            .then((authenticatedUser) => {
                return firebase.auth().currentUser.getToken(true).then((idToken) => {
                    localStorage.setItem('fbAuthToken', idToken);
                    console.log('fbAuthToken', idToken);
                    return authenticatedUser.uid;
                }).catch(err => {
                    throw err;
                });
            })
            .catch(err => {
                throw err;
            });
    }
    
}
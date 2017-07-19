import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { AngularFire } from 'angularfire2';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        public af: AngularFire
    ) { }

    canActivate(): Observable<boolean> {
        return this.af.auth
            .take(1)
            .map(auth => !!auth)
            .do(auth => !auth ? this.router.navigate(['/login']) : true);
    }
}
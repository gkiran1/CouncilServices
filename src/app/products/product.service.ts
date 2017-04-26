import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IProduct } from './product';
import { AngularFire } from 'angularfire2';

@Injectable()
export class ProductService {
    constructor(public af: AngularFire, private _http: Http) {

    }
    getProducts() {
        return this.af.database.object('ldsunits');
    }

    getProduct(id: number) {
        return this.getProducts()
            .map((products) => products.find(p => p.UnitNum === id.toString()));
    }

    getAboveUnits(id: number) {
        return this.getProducts()
            .map((products) => products.filter(p => {
                if (Number(p.UnitNum) > id) {
                    return p;
                }
            }));
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}

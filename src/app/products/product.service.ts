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
    ldsunits;
    constructor(public af: AngularFire, private _http: Http) {
        this.ldsunits = this.af.database.list('ldsunits')
            .subscribe(units => {
                this.ldsunits = units;
            });
    }

    // getProducts() {
    //     return this.af.database.object('ldsunits');
    // }
    setLdsUnits(units) {
        this.ldsunits = units;
    }

    getLdsUnits() {
        return this.ldsunits;
    }
    getLdsUnitsFirst() {
        return this.af.database.list('ldsunits');
    }

    // getProduct(id: number) {
    //     return this.getProducts()
    //         .map((products) => products.find(p => p.UnitNum === id.toString()));
    // }

    // getChildUnits(key) {
    //     return this.af.database.list(`ldsunits/${key}/Children`);
    // }

    // getAboveUnits(id: number) {
    //     return this.getProducts()
    //         .map((products) => products.filter(p => {
    //             if (Number(p.UnitNum) > id) {
    //                 return p;
    //             }
    //         }));
    // }

    deleteUnit(product, unitsBelow) {

        this.af.database.object(`ldsunits/${product.$key}`).remove();

        unitsBelow.forEach(unt => {
            this.af.database.object(`ldsunits/${unt.$key}`).remove();
        });

    }

    deleteChildUnit(key) {
        this.af.database.object(`ldsunits/${key}`).remove();
    }

    updateUnit(product, unitsBelow) {

        this.af.database.object(`ldsunits/${product.$key}`).update({
            UnitName: product.UnitName,
            UnitType: product.UnitType,
            City: product.City,
            Country: product.Country
        });

        if (unitsBelow) {
            unitsBelow.forEach(c => {
                this.af.database.object(`ldsunits/${c.$key}`).update({
                    UnitName: c.UnitName,
                    UnitType: c.UnitType,
                    City: c.City,
                    Country: c.Country
                });
            });
        }

    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}

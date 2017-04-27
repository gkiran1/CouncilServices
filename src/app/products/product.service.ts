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
        //  return this.af.database.object('ldsunitstest');
        return this.af.database.object('ldsunits');
    }

    getLdsUnits() {
        //return this.af.database.list('ldsunitstest');
        return this.af.database.list('ldsunits');
    }

    getProduct(id: number) {
        return this.getProducts()
            .map((products) => products.find(p => p.UnitNum === id.toString()));
    }

    getChildUnits(key) {
        // return this.af.database.list(`ldsunitstest/${key}/Children`);
        return this.af.database.list(`ldsunits/${key}/Children`);
    }

    getAboveUnits(id: number) {
        return this.getProducts()
            .map((products) => products.filter(p => {
                if (Number(p.UnitNum) > id) {
                    return p;
                }
            }));
    }

    deleteUnit(unitKey: number) {
        // this.af.database.object(`ldsunitstest/${unitKey}`).remove();
        this.af.database.object(`ldsunits/${unitKey}`).remove();
    }

    deleteChildUnit(key, childKey) {
        // this.af.database.object(`ldsunitstest/${key}/Children/${childKey}`).remove();
        this.af.database.object(`ldsunits/${key}/Children/${childKey}`).remove();
    }

    updateUnit(unitKey: number, product, unitsBelow) {

        // var ch = [];

        // this.af.database.object(`ldsunitstest/${unitKey}`).update({
        //     UnitName: product.UnitName,
        //     UnitType: product.UnitType
        // });

        // if (product.Children) {

        //     ch = unitsBelow;

        //     ch.forEach(c => {

        //         this.af.database.object(`ldsunitstest/${unitKey}/Children/${c.$key}`).update({
        //             UnitName: c.UnitName,
        //             UnitType: c.UnitType
        //         });

        //     });
        // }

        /////////////////////////////////


        var ch = [];

        this.af.database.object(`ldsunits/${unitKey}`).update({
            UnitName: product.UnitName,
            UnitType: product.UnitType
        });

        if (product.Children) {

            ch = unitsBelow;

            ch.forEach(c => {

                this.af.database.object(`ldsunits/${unitKey}/Children/${c.$key}`).update({
                    UnitName: c.UnitName,
                    UnitType: c.UnitType
                });

            });
        }

    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    // test(){
    //     this.af.database.list('ldsunitstest').push({
    //         name:'test'
    //     });
    // }
}

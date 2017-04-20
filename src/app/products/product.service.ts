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
    private _productUrl = 'api/products/products.json';
  //  public arr=[];
   // public temp={};
   // public temp2 = {};

    constructor(public af: AngularFire,private _http: Http) { 
          
    }
    // getData(){
    //     return this.arr;
    // }

    getProducts() {
        return this.af.database.object('ldsunits');
    }

    getProduct(id: number) {
        return this.getProducts()
            .map((products) => products.find(p => p.UnitNum === id));
    }

    // objectWithoutKey(object, key) { 
    //      const {[key]: deletedKey, ...otherKeys} = object;
    //       return otherKeys;
    // }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}

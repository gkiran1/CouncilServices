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
    public arr=[];
    public temp={};
    public temp2 = {};

    constructor(public af: AngularFire,private _http: Http) { 
           this.af.database.object('ldsunits').subscribe(u=>{
           for(var i=0;i< u.length; u++){
               var {OrgUnitId: Id, ParentNum:Num,UnitName:Name,UnitNum:Num,UnitType:Type,Children: parent} = u[i];
               this.temp["OrgUnitId"]= Id;
               this.temp["ParentNum"]= Num;
               this.temp["UnitName"]= Name;
               this.temp["UnitNum"]= Num;
               this.temp["UnitType"]= Type;
               this.arr.push(this.temp);
               this.temp={};
               if(Array.isArray(parent)){
                  for(var j=0;j<parent.length;j++){ 
                   var {OrgUnitId: parentId, ParentNum:parentNum,UnitName:parentName,UnitNum:parentNum,UnitType:parentType,Children: children1} = parent[j]; 
                    this.temp2["OrgUnitId"]= parentId;
                    this.temp2["ParentNum"]= parentNum;
                    this.temp2["UnitName"]= parentName;
                    this.temp2["UnitNum"]= parentNum;
                    this.temp2["UnitType"]= parentType;
                    this.arr.push(this.temp2);
                    this.temp2 = {}
                     if(Array.isArray(children1)){
                            for(var k=0;k<children1.length;k++){
                              this.arr.push(children1[k]);
                            }
                     }

               }

               }
             
           } 
           console.log(this.arr);
        });
       
    }

    getProducts(): Observable<IProduct[]> {
        return this._http.get(this._productUrl)
            .map((response: Response) => <IProduct[]> response.json())
            .do(data => console.log('All: ' +  JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProduct(id: number): Observable<IProduct> {
        return this.getProducts()
            .map((products: IProduct[]) => products.find(p => p.productId === id));
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

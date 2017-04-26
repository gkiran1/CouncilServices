import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
    templateUrl: './product-update.component.html',
    styleUrls: ['./product-update.component.css']
})

export class ProductUpdateComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Product Detail';
    product: IProduct;
    errorMessage: string;
    private sub: Subscription;
    public unitsabove = [];
    public unitsbelow = [];

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _productService: ProductService) {


    }

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
                let id = +params['id'];
                let parentNum = params['parentnum'];

                //alert('hi ' + parentNum);
                //  this.getProduct(id);
                this._productService.getProducts().subscribe(unitsObj => {
                    unitsObj.filter(unitObj => {
                        // if (Number(unitObj.UnitNum) < id) {
                        //     return unitObj;
                        // }

                        if (unitObj.UnitNum === parentNum) {
                            this.unitsabove.push(unitObj);
                        }

                        if (Number(unitObj.UnitNum) === id) {
                            this.product = unitObj;

                            if (unitObj.Children) {
                                this.unitsbelow = unitObj.Children;
                            }
                        }

                        

                        // else {
                        //     this.unitsbelow.push(unitObj);
                        // }
                    });
                });
            });

        // this.unitsabove.sort(function (a, b) {
        //     return a.UnitNum - b.UnitNum
        // });

        this.unitsbelow.sort(function (a, b) {
            return a.UnitNum - b.UnitNum
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getProduct(id: number) {
        this._productService.getProduct(id).subscribe(
            product => this.product = product,
            error => this.errorMessage = <any>error);
    }

    public temp = {};
    public temp2 = {};

}
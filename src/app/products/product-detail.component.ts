import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
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

    untKey;

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
                let id = +params['id'];
                let parentNum = params['parentnum'];

                this._productService.getLdsUnits().subscribe(unitsObj => {
                    unitsObj.filter(unitObj => {

                        this.unitsabove = [];

                        if (unitObj.UnitNum === parentNum) {
                            this.unitsabove.push(unitObj);
                        }

                        if (Number(unitObj.UnitNum) === id) {

                            this.untKey = unitObj.$key;

                            this.product = unitObj;

                            if (unitObj.Children) {
                                this._productService.getChildUnits(this.untKey).subscribe(childs => {
                                    this.unitsbelow = childs;
                                });
                            }
                        }
                    });
                });
            });

        this.unitsbelow.sort(function (a, b) {
            return a.UnitNum - b.UnitNum
        });
    }

    isDetail = true;

    edit() {
        this.isDetail = false;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getProduct(id: number) {
        this._productService.getProduct(id).subscribe(
            product => this.product = product,
            error => this.errorMessage = <any>error);
    }

    deleteUnit(product) {
        this._productService.deleteUnit(product.$key);
    }

    cancel() {
        this.isDetail = true;
    }

    saveUnit() {
        this._productService.updateUnit(this.untKey, this.product, this.unitsbelow);
    }

    deletechildUnit(ky) {
        this._productService.deleteChildUnit(this.untKey, ky);
    }

    public temp = {};
    public temp2 = {};

}

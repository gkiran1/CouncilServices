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
    private unitsSub: Subscription;

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
                this.getUnits(id, parentNum);
            });
    }

    getUnits(id, parentNum) {
        this.unitsabove = [];
        this.unitsbelow = [];

        this.unitsSub = this._productService.getLdsUnits().subscribe(unitsObj => {
            unitsObj.forEach(unitObj => {
                if (unitObj.UnitNum === parentNum) {
                    this.unitsabove.push(unitObj);
                }
                else if (Number(unitObj.UnitNum) === id) {
                    this.untKey = unitObj.$key;
                    this.product = unitObj;
                    this.product.ActUnitName = unitObj['UnitName'];
                    this.product.ActUnitType = unitObj['UnitType'];
                    if (unitObj.Children) {
                        this._productService.getChildUnits(this.untKey).subscribe(childs => {
                            childs.forEach(child => {
                                child['ActUnitName'] = child['UnitName'];
                                child['ActUnitType'] = child['UnitType'];
                            });
                            this.unitsbelow = childs;
                        });
                    }
                }
            });
        });

        this.unitsbelow.sort(function (a, b) {
            return a.UnitNum - b.UnitNum
        });

    }

    getUnitsById(id, parentNum, unit) {
        //  this.getUnits(id, parentNum);
        this.unitsabove = [];
        this.unitsbelow = [];
        this.product = unit;

        this._productService.getLdsUnits().subscribe(unitsObj => {
            unitsObj.forEach(unitObj => {
                if (this.product.ParentNum === unitObj.UnitNum) {
                    this.unitsabove.push(unitObj);
                }
            });
        });

        if (this.product.Children) {
            this._productService.getChildUnits(this.untKey).subscribe(childs => {
                this.unitsbelow = childs;
            });
        }

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
        this.product.UnitName = this.product.ActUnitName;
        this.product.UnitType = this.product.ActUnitType;

        this.unitsbelow.forEach(unt => {
            unt.UnitName = unt.ActUnitName;
            unt.UnitType = unt.ActUnitType;
        })
    }

    saveUnit() {
        this._productService.updateUnit(this.untKey, this.product, this.unitsbelow);

        this.product.ActUnitName = this.product.UnitName;
        this.product.ActUnitType = this.product.UnitType;

        this.unitsbelow.forEach(unt => {
            unt.ActUnitName = unt.UnitName;
            unt.ActUnitType = unt.UnitType;
        });

        this.isDetail = true;
    }

    deletechildUnit(ky) {
        this._productService.deleteChildUnit(this.untKey, ky);
    }

}

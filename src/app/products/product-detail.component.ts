import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {

    product: IProduct;
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
                let parentNum = +params['parentnum'];
                this.getUnits(id, parentNum);
            });
    }

    getUnits(id, parentNum) {
        this.unitsabove = [];
        this.unitsbelow = [];

        this._productService.getLdsUnits().subscribe(unitsObj => {
            unitsObj.forEach(unitObj => {

                if (unitObj.UnitNum === id) {
                    this.product = unitObj;
                    this.product.ActUnitName = unitObj['UnitName'];
                    this.product.ActUnitType = unitObj['UnitType'];
                    this.product.ActCity = unitObj['City'];
                    this.product.ActCountry = unitObj['Country'];
                }
                else if (unitObj.UnitNum === parentNum) {
                    this.unitsabove.push(unitObj);
                    console.log('unitsabove', this.unitsabove);
                }
                else if (unitObj.ParentNum === id) {
                    unitObj['ActUnitName'] = unitObj['UnitName'];
                    unitObj['ActUnitType'] = unitObj['UnitType'];
                    unitObj['ActCity'] = unitObj['City'];
                    unitObj['ActCountry'] = unitObj['Country'];
                    this.unitsbelow.push(unitObj);
                    console.log('unitsbelow', this.unitsbelow)
                }
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

    deleteUnit() {
        this._productService.deleteUnit(this.product, this.unitsbelow);
    }

    cancel() {
        this.isDetail = true;
        this.product.UnitName = this.product.ActUnitName;
        this.product.UnitType = this.product.ActUnitType;
        this.product.City = this.product.ActCity;
        this.product.Country = this.product.ActCountry;

        this.unitsbelow.forEach(unt => {
            unt.UnitName = unt.ActUnitName;
            unt.UnitType = unt.ActUnitType;
            unt.City = unt.ActCity;
            unt.Country = unt.ActCountry;
        })
    }

    saveUnit() {
        this._productService.updateUnit(this.product, this.unitsbelow);

        this.product.ActUnitName = this.product.UnitName;
        this.product.ActUnitType = this.product.UnitType;
        this.product.ActCity = this.product.City;
        this.product.ActCountry = this.product.Country;

        this.unitsbelow.forEach(unt => {
            unt.ActUnitName = unt.UnitName;
            unt.ActUnitType = unt.UnitType;
            unt.ActCity = unt.City;
            unt.ActCountry = unt.Country;
        });

        this.isDetail = true;
    }

    deletechildUnit(untKey) {
        this._productService.deleteChildUnit(untKey);
    }

}

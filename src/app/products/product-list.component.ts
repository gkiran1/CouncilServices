import { Component, OnInit } from '@angular/core';

//import { IProduct } from './product';
import { ProductService } from './product.service';
import { PagerService } from './pager.service';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    pageTitle: string = 'Product List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: string;
    errorMessage: string;
    progress = 0;

    public temp = {};
    public temp2 = {};

    public products = [];

    showLoading = true;

    constructor(private _productService: ProductService, private pagerService: PagerService) {
        let interval = setInterval(() => {
            if (this.progress <= 80) {
                this.progress = this.progress + 10;
            } else {
                clearInterval(interval);
            }
        }, 500)
    }

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];
    tempPagedItems: any[];

    untsLen;

    ngOnInit(): void {
        this._productService.getLdsUnitsFirst()
            .subscribe(u => {
                this._productService.setLdsUnits(u);
                this.progress = 100;
                this.products = u.sort(function (a, b) {
                    return a.UnitNum - b.UnitNum
                });

                // this.products.sort(function (a, b) {
                //     return a.UnitNum - b.UnitNum
                // });

                this.untsLen = this.products.length;

                this.setPage(1);

                this.showLoading = false;
            },
            error => this.errorMessage = <any>error);
    }
    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.pageNum = page;

        // get pager object from service
        this.pager = this.pagerService.getPager(this.products.length, page, this.pageLength);

        // get current page of items
        this.pagedItems = this.products.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.tempPagedItems = this.pagedItems;
    }
    pageNum;
    pageLength = 10;

    clicked = 10;

    records(val) {
        this.pageLength = val;

        this.clicked = val;

        // get pager object from service
        this.pager = this.pagerService.getPager(this.products.length, this.pageNum, this.pageLength);

        // get current page of items
        this.pagedItems = this.products.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.tempPagedItems = this.pagedItems;
    }

    keypresssed($event) {
        // this.showLoading = true;
        if ($event.target.value.length > 1) {
            this.pagedItems = this.products;
        }
        else if ($event.target.value === '') {
            this.pagedItems = this.tempPagedItems;
        }
    }

}

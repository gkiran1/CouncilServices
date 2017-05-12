import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductDetailGuard } from './product-guard.service';

import { ProductFilterPipe } from './product-filter.pipe';
import { ProductService } from './product.service';

import { SharedModule } from '../shared/shared.module';
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { FirebaseConfig } from './../../environments/firebase/firebase-config';

import { PagerService } from './pager.service';



@NgModule({
  imports: [
    SharedModule,
    AngularFireModule.initializeApp(FirebaseConfig),
    RouterModule.forChild([
      { path: 'products', component: ProductListComponent },
      {
        path: 'product/:id/:parentnum',
        // canActivate: [ProductDetailGuard],
        component: ProductDetailComponent
      }
    ])
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductFilterPipe
  ],
  providers: [
    ProductService,
    ProductDetailGuard,
    PagerService
  ]
})
export class ProductModule { }

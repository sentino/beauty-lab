// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";
import { ConfigProvider } from '../../services/config/config';
// import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, style, animate, transition } from '@angular/animations';
import { NavController, Content } from 'ionic-angular';
import { SubCategoriesPage } from '../sub-categories/sub-categories';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { ProductsPage } from '../products/products';
import { HttpClient } from '@angular/common/http';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'page-home4',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'home4.html',
})

export class Home4Page {
  productsLength$ = this.store.select(selectCartProductsLength);

  @ViewChild(Content) content: Content;

  constructor(
    private store: Store<any>,
    public http: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    // translate: TranslateService
  ) { }
  openSubCategories(parent) {
    this.navCtrl.push(SubCategoriesPage, { 'parent': parent });
  }
  ngAfterViewChecked() {
    this.content.resize();
  }
  openProducts(value) {
    this.navCtrl.push(ProductsPage, { sortOrder: value });
  }
  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }

}

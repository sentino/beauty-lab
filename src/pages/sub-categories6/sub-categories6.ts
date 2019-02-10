// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { ProductsPage } from '../products/products';
import { ConfigProvider } from '../../services/config/config';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'page-sub-categories6',
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
  templateUrl: 'sub-categories6.html',
})
export class SubCategories6Page {
  productsLength$ = this.store.select(selectCartProductsLength);

  parent;
  subcategories=[];

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    public navParams: NavParams,
    public shared: SharedDataProvider,
    public config: ConfigProvider) {

    this.parent = navParams.get("parent");
    for (let value of this.shared.subCategories) {  
      if (value.parent_id == this.parent) {this.subcategories.push(value);}
    }

  }

  openProducts(id, name) {
    this.navCtrl.push(ProductsPage, { id: id, name: name, sortOrder: 'newest' });
  }
  openCart() {
    this.navCtrl.push(CartContainer);
}
openSearch() {
    this.navCtrl.push(SearchPage);
}
}

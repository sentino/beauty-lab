// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { ConfigProvider } from '../../services/config/config';
import { SubCategories6Page } from '../sub-categories6/sub-categories6';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'page-categories6',
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
  templateUrl: 'categories6.html',
})
export class Categories6Page {
  productsLength$ = this.store.select(selectCartProductsLength);

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider
  ) {

  }
  openSubCategories(parent) {
    this.navCtrl.push(SubCategories6Page, { 'parent': parent });
  }
  openCart() {
    this.navCtrl.push(CartContainer);
}
openSearch() {
    this.navCtrl.push(SearchPage);
}

}

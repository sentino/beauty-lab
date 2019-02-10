// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../services/config/config';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
// import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { HttpClient } from '@angular/common/http';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'page-wish-list',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('500ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'wish-list.html',
})
export class WishListPage {
  productsLength$ = this.store.select(selectCartProductsLength);

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  page = 0;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    // translate: TranslateService
  ) { }

  // getProducts() {
  //   var data: { [k: string]: any } = {};
  //   if (this.shared.customerData.customers_id != null)
  //     data.customers_id = this.shared.customerData.customers_id;
  //   data.page_number = 0;
  //   data.page_number = this.page;
  //   data.type = 'wishlist';
  //   data.language_id = this.config.langId;
  //   this.http.post(this.config.url + 'getAllProducts', data).map(res => res.json()).subscribe(data => {
  //     if (data.success == 1) {
  //       this.page++;
  //       var prod = data.product_data;
  //       for (let value of prod) {
  //         this.shared.wishList.push(value);
  //       }
  //     }
  //     if (data.success == 0) { this.infinite.enable(false); }
  //   });
  // }
  ngOnInit() {
    // this.getProducts();
  }
  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  ionViewWillEnter() {
  }
}

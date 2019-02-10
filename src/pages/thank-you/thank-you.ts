// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyOrdersPage } from '../my-orders/my-orders';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { Home2Page } from '../home2/home2';
import { Home3Page } from '../home3/home3';
import { Home5Page } from '../home5/home5';
import { Home4Page } from '../home4/home4';
import { ConfigProvider } from '../../services/config/config';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';




@Component({
  selector: 'page-thank-you',
  templateUrl: 'thank-you.html',
})
export class ThankYouPage {
  productsLength$ = this.store.select(selectCartProductsLength);

  array = new Array;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
     public navParams: NavParams) {
    this.array = this.navCtrl.getViews();
  }
  openHome() {
    if (this.config.homePage == 1) { this.navCtrl.setRoot(HomePage); }
    if (this.config.homePage == 2) { this.navCtrl.setRoot(Home2Page); }
    if (this.config.homePage == 3) { this.navCtrl.setRoot(Home3Page); }
    if (this.config.homePage == 4) { this.navCtrl.setRoot(Home4Page); }
    if (this.config.homePage == 5) { this.navCtrl.setRoot(Home5Page); }
  }
  openOrders() { this.navCtrl.setRoot(MyOrdersPage); }

  ionViewDidLoad() {
    // let c = 0;
    // for (let value of this.navCtrl.getViews().reverse()) {
    //   if (c <= 4){ this.navCtrl.removeView(value);console.log(value);}
    //   // if (value.component.name == "OrderPage") { this.navCtrl.removeView(value); }
    //   // if (value.component.name == "ShippingMethodPage") { this.navCtrl.removeView(value); }
    //   // if (value.component.name == "ShippingAddressPage") { this.navCtrl.removeView(value); }
    //   // if (value.component.name == "BillingAddressPage") { this.navCtrl.removeView(value); }
    //   // if (value.component.name == "CartContainer") { this.navCtrl.removeView(value); }
    //  // console.log(value);
    //   c++
    // }

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

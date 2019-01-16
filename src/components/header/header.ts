// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { CartPage } from '../../pages/cart/cart';
import { SearchPage } from '../../pages/search/search';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { ConfigProvider } from '../../services/config/config';
import { Http } from '@angular/http';

@Component({
  selector: 'header',
  animations: [
    trigger('shakeCart', [
      state('inactive', style({
        animation: 'shake 0.75s'
      })),
      state('active', style({
        //  animation: 'shake 0.75s'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),
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
  templateUrl: 'header.html',

})
export class HeaderComponent {

  @Input('title') title;
  page;
  leftButtons = true;
  openCartPage = true;
  rightButtons = true;
  searchButton = true;
  closeButtonRight = false;
  cartquantity;
  cartShake = 'active';
  SearchList = false;
  Search_result;
  

  search = {
    "search_string": '',
  };

  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
    public http: Http,
    public events: Events

  ) {
    // console.log(navCtrl);

    events.subscribe('cartChange', (id, value) => {
      this.cartShake = 'inactive'
      setTimeout(() => {
        this.cartShake = 'active'
      }, 300);
    });

  }
  openCart() {
    if (this.openCartPage)
      this.navCtrl.push(CartPage);
  }
  openSearch() {
    if (this.title != 'Search')
      this.navCtrl.push(SearchPage);
  }
  openHomePage() {
    this.navCtrl.popToRoot();
  }

  showHideSearchList(){
    console.log("Search status");
    console.log(this.SearchList);
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch(){
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).map(res => res.json()).subscribe(data => {
      // console.log(data.product_data.length + "   " + this.page);
      console.log("Search answer:");
      console.log(data);

      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
      console.log(err);
    });
  }

  ngOnChanges() {
    //console.log(this.navCtrl.getActive());
    this.page = this.title;

    if (this.page == 'My Cart') {
      this.leftButtons = false;
      this.openCartPage = false;
      this.searchButton = false;
    }
    else if (this.page == 'Shipping Address' || this.page == 'Billing Address' || this.page == 'Shipping Method') {
      // console.log("page" + this.page)
      this.leftButtons = false;
      this.searchButton = false;
      this.openCartPage = false;
    }
    else if (this.page == 'Order') {
      // console.log("page = " + this.page)
      this.leftButtons = false;
      this.rightButtons = false;
      this.closeButtonRight = true;
    }
    else if (this.page == 'Search') {
      //console.log("searchButton" + this.searchButton)
      this.leftButtons = false;
      this.searchButton = false;
    }
    else if (this.page == 'Shop') {
      //console.log("searchButton" + this.searchButton)
      this.leftButtons = false;
      this.searchButton = false;
    }
    else {
      this.leftButtons = true;
      this.rightButtons = true;
    }
  }
}

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConfigProvider } from '../config/config';
import { Events, Platform } from 'ionic-angular';
import { LoadingProvider } from '../loading/loading';
import { Push } from '@ionic-native/push/ngx';
import { Device } from '@ionic-native/device/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { MenuController } from 'ionic-angular';
import { App} from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { HttpClient } from '@angular/common/http';
import { GetDataCartAction, InitDataCart } from '../../app/store';
import { Store } from '@ngrx/store';

@Injectable()
export class SharedDataProvider {

  public banners;
  public tab1: any;
  public tab2: any;
  public tab3: any;
  public categories = new Array();
  public subCategories = new Array();
  public subCategoriesHealth = new Array();
  public subCategoriesBeauty = new Array();
  public customerData: { [k: string]: any } = {};
  public recentViewedProducts = new Array();
  public cartProducts = new Array();
  public privacyPolicy;
  public termServices;
  public refundPolicy;
  public aboutUs;
  public cartquantity;
  public wishList = new Array();
  public tempdata: { [k: string]: any } = {};
  public dir = "ltr";
  public selectedFooterPage = "HomePage";

  public orderDetails = {
    tax_zone_id: "",
    delivery_firstname: "",
    delivery_lastname: "",
    delivery_state: "",
    delivery_city: "",
    delivery_postcode: "",
    delivery_zone: "",
    delivery_country: "",
    delivery_country_id: "",
    delivery_street_address: "",
    delivery_country_code: "",

    billing_firstname: "",
    billing_lastname: "",
    billing_state: "",
    billing_city: "",
    billing_postcode: "",
    billing_zone: "",
    billing_country: "",
    billing_country_id: "",
    billing_street_address: "",
    billing_country_code: "",
    total_tax: '',
    shipping_cost: '',
    shipping_method: '',
    payment_method: '',
    comments: ''
  };


  constructor(
    private store: Store<any>,
    public config: ConfigProvider,
    public http: HttpClient,
    private storage: Storage,
    public appCtrl: App,
    public loading: LoadingProvider,
    public events: Events,
    private push: Push,
    public platform: Platform,
    private device: Device,
    public menuCtrl: MenuController,
    private fcm: FCM,
    private fb: Facebook
  ) {
    //getting all allCategories
    this.http.get(config.url + 'catalog/sections/').subscribe((data: any) => {
      for (let value of data.result.beauty) {
        if (value.parent_id == 0) this.categories.push(value); else this.subCategoriesBeauty.push(value);
      }

      for (let value of data.result.health) {
        if (value.parent_id == 0) this.categories.push(value); else this.subCategoriesHealth.push(value);
      }
    });
    //getting recent viewed items from local storage
    storage.get('customerData').then((val) => {
      if (val != null || val != undefined) this.customerData = val;
    });
    //getting recent viewed items from local storage
    storage.get('recentViewedProducts').then((val) => {
      if (val != null) this.recentViewedProducts = val;
    });
    //getting recent viewed items from local storage
    storage.get('cartProducts').then((val) => {
      if (val != null) this.cartProducts = val;
      this.cartTotalItems();
      // console.log(val);
    });
  }


  //adding into recent array products
  addToRecent(p) {
    let found = false;
    for (let value of this.recentViewedProducts) {
      if (value.products_id == p.products_id) {
        found = true;
      }
    }
    if (found == false) {
      this.recentViewedProducts.push(p);
      this.storage.set('recentViewedProducts', this.recentViewedProducts);
    }
  }


  //removing from recent array products
  removeRecent(p) {
    this.recentViewedProducts.forEach((value, index) => {
      if (value.products_id == p.products_id) {
        this.recentViewedProducts.splice(index, 1);
        this.storage.set('recentViewedProducts', this.recentViewedProducts);
      }
    });
  }


  //adding into cart array products
  addToCart(product, attArray) {
    // console.log(this.cartProducts);
    let attributesArray = attArray;
    if (attArray.length == 0 || attArray == null) {
      attributesArray = [];
      if (product.attributes != undefined) {
        product.attributes.forEach((value, index) => {
          let att = {
            products_options_id: value.option.id,
            products_options: value.option.name,
            products_options_values_id: value.values[0].id,
            options_values_price: value.values[0].price,
            price_prefix: value.values[0].price_prefix,
            products_options_values: value.values[0].value,
            name: value.values[0].value + ' ' + value.values[0].price_prefix + value.values[0].price + " " + this.config.currency
          };
          attributesArray.push(att);
        });
      }
    }

    let pprice = product.products_price;
    let on_sale = false;
    if (product.discount_price != null) {
      pprice = product.discount_price;
      on_sale = true;
    }

    let finalPrice = this.calculateFinalPriceService(attributesArray) + parseFloat(pprice);

    let obj = {
      cart_id: product.products_id + this.cartProducts.length,
      products_id: product.products_id,
      manufacture: product.manufacturers_name,
      customers_basket_quantity: 1,
      final_price: finalPrice,
      model: product.products_model,
      categories_id: product.categories_id,
      categories_name: product.categories_name,
      weight: product.products_weight,
      on_sale: on_sale,
      unit: product.products_weight_unit,
      image: product.products_image,

      attributes: attributesArray,
      products_name: product.products_name,
      price: pprice,
      subtotal: finalPrice,
      total: finalPrice
    };
    this.cartProducts.push(obj);
    this.storage.set('cartProducts', this.cartProducts);

    this.cartTotalItems();
  }


  //removing from recent array products
  removeCart(p) {
    this.cartProducts.forEach((value, index) => {
      if (value.cart_id == p) {
        this.cartProducts.splice(index, 1);
        this.storage.set('cartProducts', this.cartProducts);
      }
    });
    this.cartTotalItems();
  }


  emptyCart() {
    this.cartProducts = [];
    this.storage.set('cartProducts', this.cartProducts);
    this.cartTotalItems();
  }


  emptyRecentViewed() {
    this.recentViewedProducts = [];
    this.storage.set('recentViewedProducts', this.recentViewedProducts);
  }


  calculateFinalPriceService(attArray) {
    let total = 0;
    attArray.forEach((value, index) => {
      let attPrice = parseFloat(value.options_values_price);
      if (value.price_prefix == '+') {
        total += attPrice;
      } else {
        total -= attPrice;
      }
    });
    return total;
  }


  //Function calcualte the total items of cart
  cartTotalItems = function () {
    this.events.publish('cartChange');
    let total = 0;
    for (let value of this.cartProducts) {
      total += value.customers_basket_quantity;
    }
    this.cartquantity = total;
    return total;
  };


  login(data) {
    this.customerData = data;
    this.storage.set('customerData', this.customerData);
    localStorage.setItem('customerData', this.customerData.accessToken);
    this.store.dispatch(new GetDataCartAction());
  }


  userInfo(data) {
    this.customerData = data;
    this.storage.set('customerData', this.customerData);

    var localInfo = JSON.stringify(this.customerData);
    localStorage.setItem("localInfo", localInfo);
    localStorage.setItem('customerData', this.customerData.accessToken);
    this.store.dispatch(new GetDataCartAction());
  }


  logOut() {
    this.appCtrl.getRootNav().setRoot(HomePage);
    this.store.dispatch(new InitDataCart());
    this.menuCtrl.close();
    this.customerData = {};
    this.storage.set('customerData', '');
    this.fb.logout();
    localStorage.setItem('token', null);
    localStorage.setItem('customerData', '');
    localStorage.setItem('x-content-session', '');
    this.store.dispatch(new GetDataCartAction());
  }
}

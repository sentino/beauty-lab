// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, Input } from '@angular/core';
import { ConfigProvider } from '../../services/config/config';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { LoginPage } from '../../pages/login/login';
import { PostProductCartAction, selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { WishListService } from '../../services/wish-list.service';

@Component({
  selector: 'product',
  templateUrl: 'product.html'
})
export class ProductComponent {
  productsLength$ = this.store.select(selectCartProductsLength);

  all_props;
  props_show = true;

  @Input('data') p;//product data
  @Input('type') type;
  // @Output() someEvent = new EventEmitter();
  constructor(
    private wishListService: WishListService,
    private store: Store<any>,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public events: Events
  ) {

    

    events.subscribe('wishListUpdate', (id, value) => {
      if (this.p.products_id == id) this.p.isLiked = value
    });
  }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.p.products_price);
    var p2 = parseInt(this.p.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }

  showProductDetail(ID_product) {

    this.navCtrl.push(ProductDetailPage, { prod_id: ID_product });
    // if (this.type != 'recent') this.shared.addToRecent(this.p);
  }

  checkProductNew() {
    var pDate = new Date(this.p.products_date_added);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }

  addProduct() {
    // console.log('!!!!!!!!!!!!!!!!', this.p.ID);
    this.store.dispatch(new PostProductCartAction({id: this.p.ID, quantity: 1}));
    // this.cartService.postProduct(this.p.ID, 1).subscribe((res: any) => {
    //   this.alert.showWithTitle('', res.result.successText);
    // })
  }

  addToCart() { this.shared.addToCart(this.p, []); }

  isInCart() {
    var found = false;

    for (let value of this.shared.cartProducts) {
      if (value.products_id == this.p.products_id) { found = true; }
    }

    if (found == true) return true;
    else return false;
  }
  removeRecent() {
    this.shared.removeRecent(this.p);
  }

  clickWishList() {
    if (localStorage.getItem('customerData')) {
      // console.log(this.p);
      // debugger;
      // if (this.p.isLiked == '0') { this.addWishList(); }
      // else this.removeWishList();
      this.addWishList();
    }
  }

  addWishList() {
    this.wishListService.putItem(this.p.ID);
  }
  removeWishList() {
    this.wishListService.delItem(this.p.ID)
  }

  // clickWishList() {
  //   if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
  //     let modal = this.modalCtrl.create(LoginPage);
  //     modal.present();
  //   }
    // else {
      // if (this.p.isLiked == '0') { this.addWishList(); }
      // else this.removeWishList();
  //   }
  // }
  // addWishList() {
  //   this.shared.addWishList(this.p);
  // }
  // removeWishList() {
  //   this.shared.removeWishList(this.p);
  // }


  ngOnChanges() {

  }

  ngOnInit() {
    
    this.all_props = this.p.PROPS;
    

    if(Object.keys(this.all_props).length > 0){
      this.props_show = true;
    }
    else{
      this.props_show = false;
    }
    
  }
}

// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ConfigProvider } from '../../services/config/config';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, transition, animate, style,state } from '@angular/animations';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LoginPage } from '../login/login';
import { LoadingProvider } from '../../services/loading/loading';
import { Http } from '@angular/http';
import { StarRatingModule } from 'ionic3-star-rating';
import { Events } from 'ionic-angular';
import {Headers, RequestOptions} from '@angular/http';
import { SearchPage } from '../search/search';
import { CartContainer } from '../cart/cart-container';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AlertProvider } from '../../services/alert/alert';
import { PostProductCartAction, selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { WishListService } from '../../services/wish-list.service';



@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
  animations: [
    trigger(
      'slideInOut', [
        state('in', style({
          width: '0'
        })),
        state('out', style({
          width: '50%'
        })),
        transition('in => out', animate('300ms ease-in-out')),
        transition('out => in', animate('300ms ease-in-out'))
      ]
    ),
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
  ]
})
export class ProductDetailPage {
  productsLength$ = this.store.select(selectCartProductsLength);

  modal = false;

  public product;
  pet: string = "kittens";
  attributes = [];
  selectAttribute = true;
  discount_price;
  product_id;
  product_name;
  single_product;
  product_image;
  product_price;
  product_discount;
  product_rating;
  Search_result;
  product_properties = [];
  AllProperties = [];
  product_reviews;
  products_leaders;

  products_alsobuy;
  products_analogs;
  product_url;
  leaders_length;

  
  product_avail;
  product_delivery;
  props_list_hit;
  props_list_new;
  props_list_min;
  props_list_discount;
  product_articul;
  props_all_textlist;
  product_country;
  product_brand;
  product_gamme;
  reviews_count;
  product_rating_one;
  product_rating_two;
  product_rating_three;
  rating;
  review_response;
  reviews_info;
  anlogs_length;
  alsobuy_length;
  no_rating = false;
  no_gamme = false;
  SearchList = false;
  all_products;

  search = {
    "search_string": '',
  };

  can_add;
  
  RevData = {
    "product": "",                  // type integer / required - ID товара, к которому добавляется отзыв
    "NAME": "",
    "AGE": "",
    "COMMENT": "",
    "RATING1": "",
    "RATING2": "",
    "RATING3": "",
    "tip_volos":"",
    "tip_skin":"",
}

  constructor(
    private store: Store<any>,
    private wishListService: WishListService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: HttpClient,
    public shared: SharedDataProvider,
    public modalCtrl: ModalController,
    public events: Events,
    public loading: LoadingProvider,
    private socialSharing: SocialSharing,
    private cartService: CartService,
    private alert: AlertProvider) {

    events.subscribe('star-rating:changed', (starRating) => {
      // console.log(starRating)});
    });
      
    this.product_id = navParams.get('prod_id');
   // console.log(this.product);

    // if (this.product.attributes != null && this.product.attributes != undefined && this.product.attributes.length != 0) {
    //   //this.selectAttribute = this.product.attributes[0].values[0];
    //   // console.log(this.selectAttribute);
    //   this.product.attributes.forEach((value, index) => {

    //     var att = {
    //       products_options_id: value.option.id,
    //       products_options: value.option.name,
    //       products_options_values_id: value.values[0].id,
    //       options_values_price: value.values[0].price,
    //       price_prefix: value.values[0].price_prefix,
    //       products_options_values: value.values[0].value,
    //       name: value.values[0].value + ' ' + value.values[0].price_prefix + value.values[0].price + " " + this.config.currency
    //     };

    //     this.attributes.push(att);
    //   });
    //   //console.log(this.attributes);
    // }

  }

  addProduct() {
    // console.log('!!!!!!!!!!!!!!!!', this.product_id);
    this.store.dispatch(new PostProductCartAction({id: this.product_id, quantity: 1}));
    // this.cartService.postProduct(this.product_id, 1).subscribe((res: any) => {
    //   this.alert.showWithTitle('', res.result.successText);
    // })
  }

  // addToCartProduct() {
  //   this.loading.autoHide(500);
  //  // console.log(this.product);
  //   this.shared.addToCart(this.product, this.attributes);
  //   this.navCtrl.pop();
  // }

  // //============================================================================================  
  // //function adding attibute into array
  // fillAttributes = function (val, optionID) {

  //   //console.log(val);
  // //  console.log(this.attributes);
  //   this.attributes.forEach((value, index) => {
  //     if (optionID == value.products_options_id) {
  //       value.products_options_values_id = val.id;
  //       value.options_values_price = val.price;
  //       value.price_prefix = val.price_prefix;
  //       value.products_options_values = val.value;
  //       value.name = val.value + ' ' + val.price_prefix + val.price + " " + this.config.currency
  //     }
  //   });
  //   // console.log($scope.attributes);
  //   //calculating total price 
  //   this.calculatingTotalPrice();
  // };
  // //============================================================================================  
  // //calculating total price  
  // calculatingTotalPrice = function () {
  //   var price = parseFloat(this.product.products_price.toString());
  //   if (this.product.discount_price != null || this.product.discount_price != undefined)
  //     price = this.product.discount_price;
  //   var totalPrice = this.shared.calculateFinalPriceService(this.attributes) + parseFloat(price.toString());

  //   if (this.product.discount_price != null || this.product.discount_price != undefined)
  //     this.discount_price = totalPrice;
  //   else
  //     this.product_price = totalPrice;
  //   //  console.log(totalPrice);
  // };

  // checkProductNew() {
  //   var pDate = new Date(this.product.products_date_added);
  //   var date = pDate.getTime() + this.config.newProductDuration * 86400000;
  //   var todayDate = new Date().getTime();
  //   if (date > todayDate)
  //     return true;
  //   else
  //     return false
  // }


  getProductDetails(){
      // console.log(this.product_id);
      this.loading.show();
      this.http.get(this.config.url + 'catalog/product/' + this.product_id).subscribe((data: any) => {
        this.loading.hide();

        this.single_product = data.result;

        // console.log("Product Single:");
        // console.log(this.single_product);

        this.product_image = this.single_product.IMAGE;
        this.product_name =  this.single_product.NAME;
        this.product_price = this.single_product.PRICE;
        this.product_discount = this.single_product.PRICE_DISCOUNT;
        this.product_reviews = this.single_product.REVIEWS.ITEMS;
        this.products_leaders = this.single_product.LEADERS;
        this.products_alsobuy = this.single_product.ALSO_BUY;
        this.products_analogs = this.single_product.ANALOGS;

        // console.log("Anglogs:");
        // console.log(this.products_analogs);

        if (this.products_analogs && this.products_analogs.length) this.anlogs_length = this.products_analogs.length;
        if (this.products_leaders && this.products_leaders.length) this.leaders_length = this.products_leaders.length;
        if (this.products_alsobuy && this.products_alsobuy.length) this.alsobuy_length = this.products_alsobuy.length;

        this.product_url = this.single_product.URL;
        this.product_avail = this.single_product.AVAILABILITY;
        this.product_delivery = this.single_product.DATE_DELIVERY + '<br> <br>' + this.single_product.TEXTS.DELIVERY;

        this.props_list_hit = this.single_product.PROPS.HIT;
        this.props_list_new = this.single_product.PROPS.NEW;
        this.props_list_min = this.single_product.PROPS.MIN_PRICE;
        this.props_list_discount = this.single_product.PROPS.DISCOUNT_PERCENT;
        this.props_all_textlist = this.single_product.PROPERTIES_TEXT;
        this.product_articul = this.single_product.PROPERTIES.ARTICUL;
        this.product_country = this.single_product.COUNTRY;
        this.product_brand = this.single_product.PROPERTIES.BRAND;
        this.product_gamme = this.single_product.PROPERTIES.GAMME;

        if(this.product_gamme == null){
          this.no_gamme = true;
        }

        this.reviews_count = this.product_reviews.length;

        this.reviews_info = this.single_product.REVIEWS.ADD_NEW_FIELDS;

        this.can_add = this.single_product.REVIEWS.CAN_ADD;

        // console.log("Rewiews ADD info");
        // console.log(this.reviews_info);


        if(this.single_product.PROPERTIES.RATING){
          this.product_rating = this.single_product.PROPERTIES.RATING;
        }
        else{
          this.product_rating = 0;
          this.no_rating = true;
        }

        // console.log("All properties:");
        // console.log(this.single_product.PROPERTIES);
        var i = 0;
        // Object.entries(this.single_product.PROPERTIES).forEach(([key, value])=>{
        //   this.AllProperties[i] = {name:key,value:value};
        //   i++;
        // })

        // console.log("Propers List");
        // console.log(this.AllProperties);

        this.product_properties

      },
      err => {
        var er_status = err.status;
        // console.log(err);
      });
  }

  // pDiscount() {
  //   var rtn = "";
  //   var p1 = parseInt(this.product.products_price);
  //   var p2 = parseInt(this.product.discount_price);
  //   if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
  //   var result = Math.abs((p1 - p2) / p1 * 100);
  //   result = parseInt(result.toString());
  //   if (result == 0) { rtn = "" }
  //   rtn = result + '%';
  //   return rtn;
  // }

  showHideSearchList(){
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch(){
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).subscribe(data => {
      // console.log(data.product_data.length + "   " + this.page);
      // console.log("Search answer:");
      // console.log(data);

      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
      // console.log(err);
    });
  }

  newReview(){
    // console.log("First");
    // console.log(this.product_rating_one);
    // console.log("Second");
    // console.log(this.product_rating_two);
    // console.log("Third");
    // console.log(this.product_rating_three);

    var RevData = new FormData();

    // const headers = new Headers();
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization-Token': this.shared.customerData.accessToken
    //   })
    // };
    // headers.append('Authorization-Token',this.shared.customerData.accessToken);

    // const options = new RequestOptions({headers: headers});

    RevData.append('product',this.product_id);
    RevData.append('AGE', this.RevData.AGE);
    RevData.append('COMMENT', this.RevData.COMMENT);
    RevData.append('NAME', this.RevData.NAME);
    RevData.append('RATING1', this.RevData.RATING1);
    RevData.append('RATING2', this.RevData.RATING2);
    RevData.append('RATING3', this.RevData.RATING3);
    RevData.append('HAIR', this.RevData.tip_volos);
    RevData.append('SKIN', this.RevData.tip_skin);

    this.loading.show();

    // this.http.post(this.config.url + 'tools/review/', RevData, httpOptions).subscribe(data => {
    this.http.post(this.config.url + 'tools/review/', RevData).subscribe(data => {
      this.loading.hide();
      // console.log("Review response");
      // console.log(data);
      this.review_response = data;

      alert(this.review_response.result.successText);
    },
    err => {
      this.loading.hide();
      // console.log(err);
      if(err.status == 422){
        alert("Были введены неправильные е-мейл или пароль.Попробуйте, ещё раз!")
      }
    });
  }

  share() {
    this.loading.autoHide(1000);
    this.socialSharing.share(
      this.product_name,
      this.product_name,
      this.product_image,
      this.product_url).then(() => {
        // Success!
      }).catch(() => {
        // Error!
      });
  }


  clickWishList() {
    if (localStorage.getItem('customerData')) {
    //   console.log(this.single_product);
    //   debugger;
      // if (this.product.isLiked == '0') { this.addWishList(); }
      // else this.removeWishList();
      this.addWishList();
    }
  }

  addWishList() {
    this.wishListService.putItem(this.product_id);
  }
  removeWishList() {
    this.wishListService.delItem(this.product_id)
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }


  ngOnInit() {
    this.getProductDetails();
  }

  openModal() {
    this.modal = !this.modal;
  }

}

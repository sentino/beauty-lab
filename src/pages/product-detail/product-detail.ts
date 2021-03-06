import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { ConfigProvider } from '../../services/config/config';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, transition, animate, style,state } from '@angular/animations';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LoadingProvider } from '../../services/loading/loading';
import { Events } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { CartContainer } from '../cart/cart-container';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PostProductCartAction, selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { WishListService } from '../../services/wish-list.service';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { AnalyticsService } from '../../services/analytics.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AlertProvider } from '../../services/alert/alert';
import { MedicinesSubstancesPageContainer } from '../medicines-substances-page/medicines-substances-page.container';
import { BrandsPageContainer } from '../brands-page/brands-page-container';
import { FormControl, FormGroup, Validators } from '@angular/forms';



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
export class ProductDetailPage extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  @ViewChild('myTextArea') myTextArea: ElementRef;

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
  BRAND_ID;
  product_gamme;
  MEZH_NEP_NAZVANIE;
  MEZH_NEP_NAZVANIE_ID;
  TORG_NAME_NEW;
  TORG_NAME_NEW_ID;
  M_PROIZVODITEL;
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

  RevData: FormGroup;

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
    private ga: AnalyticsService,
    private plt: Platform,
    private appVersion: AppVersion,
    private alert: AlertProvider,
  ) {
    super();
    this.product_id = navParams.get('prod_id');

    this.ga.trackPage('productDetails-' + this.product_id);

    this.RevData = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      age: new FormControl(null),
      comment: new FormControl(null, [Validators.required]),
      rating1: new FormControl(null, [Validators.required]),
      rating2: new FormControl(null, [Validators.required]),
      rating3: new FormControl(null, [Validators.required]),
      tipVolos: new FormControl(null),
      tipSkin: new FormControl(null),
    });
  }

  ngOnInit() {
    this.loading.showSpinner();
    this.getProductDetails();
  }

  addProduct() {
    this.store.dispatch(new PostProductCartAction({id: this.product_id, quantity: 1}));
    this.alert.show('товар добавлен в корзину');
  }

  getProductDetails() {
    this.http.get(this.config.url + 'catalog/product/' + this.product_id).subscribe((data: any) => {

      this.single_product = data.result;

      this.product_image = this.single_product.IMAGE;
      this.product_name =  this.single_product.NAME;
      this.product_price = this.single_product.PRICE;
      this.product_discount = this.single_product.PRICE_DISCOUNT;
      this.product_reviews = this.single_product.REVIEWS.ITEMS;
      this.products_leaders = this.single_product.LEADERS;
      this.products_alsobuy = this.single_product.ALSO_BUY;
      this.products_analogs = this.single_product.ANALOGS;

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
      this.BRAND_ID = this.single_product.PROPERTIES.BRAND_ID;
      this.product_gamme = this.single_product.PROPERTIES.GAMME;
      this.product_gamme = this.single_product.PROPERTIES.GAMME;

      if (this.single_product.PROPERTIES.MEZH_NEP_NAZVANIE) {
        this.MEZH_NEP_NAZVANIE = this.single_product.PROPERTIES.MEZH_NEP_NAZVANIE;
        this.MEZH_NEP_NAZVANIE_ID = this.single_product.PROPERTIES.MEZH_NEP_NAZVANIE_ID;
      }
      if (this.single_product.PROPERTIES.TORG_NAME_NEW) {
        this.TORG_NAME_NEW = this.single_product.PROPERTIES.TORG_NAME_NEW;
        this.TORG_NAME_NEW_ID = this.single_product.PROPERTIES.TORG_NAME_NEW_ID;
      }
      if (this.single_product.PROPERTIES.M_PROIZVODITEL) {
        this.M_PROIZVODITEL = this.single_product.PROPERTIES.M_PROIZVODITEL;
      }

      if(this.product_gamme == null){
        this.no_gamme = true;
      }

      this.reviews_count = this.product_reviews.length;

      this.reviews_info = this.single_product.REVIEWS.ADD_NEW_FIELDS;
      
      if (this.single_product.REVIEWS.ADD_NEW_FIELDS[1].CODE === 'AGE') {
        this.RevData.controls['age'].setValidators([Validators.required]);
        this.RevData.controls['age'].updateValueAndValidity();
      }
      if (this.single_product.REVIEWS.ADD_NEW_FIELDS[2].CODE === 'SKIN') {
        this.RevData.controls['tipSkin'].setValidators([Validators.required]);
        this.RevData.controls['tipSkin'].updateValueAndValidity();
      }
      if (this.single_product.REVIEWS.ADD_NEW_FIELDS[3].CODE === 'HAIR') {
        this.RevData.controls['tipVolos'].setValidators([Validators.required]);
        this.RevData.controls['tipVolos'].updateValueAndValidity();
      }

      this.can_add = this.single_product.REVIEWS.CAN_ADD;

      if(this.single_product.PROPERTIES.RATING){
        this.product_rating = this.single_product.PROPERTIES.RATING;
      }
      else{
        this.product_rating = 0;
        this.no_rating = true;
      }

      this.product_properties;
      this.loading.hideSpinner();
    },
    err => {
      var er_status = err.status;
    });
  }

  showHideSearchList() {
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch() {
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string + '&count=50').subscribe(data => {
      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
    });
  }

  newReview() {
    var RevData = new HttpParams();

    RevData = RevData.append('product',this.product_id);
    RevData = RevData.append('AGE', this.RevData.controls['age'].value);
    RevData = RevData.append('COMMENT', this.RevData.controls['comment'].value);
    RevData = RevData.append('NAME', this.RevData.controls['name'].value);
    RevData = RevData.append('RATING1', this.RevData.controls['rating1'].value);
    RevData = RevData.append('RATING2', this.RevData.controls['rating2'].value);
    RevData = RevData.append('RATING3', this.RevData.controls['rating3'].value);
    RevData = RevData.append('HAIR', this.RevData.controls['tipVolos'].value);
    RevData = RevData.append('SKIN', this.RevData.controls['tipSkin'].value);

    this.http.post(this.config.url + 'tools/review/', null, {params: RevData}).subscribe(data => {
      this.review_response = data;
      this.alert.show(this.review_response.result.successText);
    },
    err => {
      if(err.status == 422){
        this.alert.show(err.error.result.errorText);
      }
    });
  }

  share() {
    if (this.plt.is('ios')) {
      this.socialSharing.share(
        this.product_name,
        'Beauty Lab',
        this.product_image,
        ''
      )
        .then(() => {})
        .catch(() => {});
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          this.product_name,
          'Beauty Lab',
          this.product_image,
          'https://play.google.com/store/apps/details?id=' + val
        )
          .then(() => {})
          .catch(() => {});
      });
    }
  }

  clickWishList() {
    if (localStorage.getItem('customerData') && this.single_product.IN_WISHLIST === 'N') {
      this.wrapToUnsubscribe(this.wishListService.putItem(this.product_id)).subscribe(res => {
        this.single_product.IN_WISHLIST = 'Y';
      });
    } else {
      this.wrapToUnsubscribe(this.wishListService.delItem(this.product_id)).subscribe(res => {
        this.single_product.IN_WISHLIST = 'N';
      });
    }
  }

  goToPageId(page, id) {
    if (page === 'medicines') {
      this.navCtrl.push(MedicinesSubstancesPageContainer, { id: id, type: 'medicines' });
    } else if (page === 'substances') {
      this.navCtrl.push(MedicinesSubstancesPageContainer, { id: id, type: 'substances' });
    } else if (page === 'brands') {
      this.navCtrl.push(BrandsPageContainer, { id: id })
    }
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }

  openModal() {
    this.modal = !this.modal;
  }

  resize() {
    let element = this.myTextArea['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    let scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.myTextArea['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

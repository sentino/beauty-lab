import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ConfigProvider } from '../../services/config/config';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, transition, animate, style,state } from '@angular/animations';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LoadingProvider } from '../../services/loading/loading';
import { Events } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { CartContainer } from '../cart/cart-container';
import { HttpClient } from '@angular/common/http';
import { PostProductCartAction, selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { WishListService } from '../../services/wish-list.service';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { AnalyticsService } from '../../services/analytics.service';



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
    private ga: AnalyticsService
  ) {
    super();
    this.product_id = navParams.get('prod_id');

    this.ga.trackPage('productDetails-' + this.product_id);
  }

  ngOnInit() {
    this.loading.showSpinner();
    this.getProductDetails();
  }

  addProduct() {
    this.store.dispatch(new PostProductCartAction({id: this.product_id, quantity: 1}));
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
      this.product_gamme = this.single_product.PROPERTIES.GAMME;

      if(this.product_gamme == null){
        this.no_gamme = true;
      }

      this.reviews_count = this.product_reviews.length;

      this.reviews_info = this.single_product.REVIEWS.ADD_NEW_FIELDS;

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
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).subscribe(data => {
      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
    });
  }

  newReview() {
    var RevData = new FormData();

    RevData.append('product',this.product_id);
    RevData.append('AGE', this.RevData.AGE);
    RevData.append('COMMENT', this.RevData.COMMENT);
    RevData.append('NAME', this.RevData.NAME);
    RevData.append('RATING1', this.RevData.RATING1);
    RevData.append('RATING2', this.RevData.RATING2);
    RevData.append('RATING3', this.RevData.RATING3);
    RevData.append('HAIR', this.RevData.tip_volos);
    RevData.append('SKIN', this.RevData.tip_skin);

    this.http.post(this.config.url + 'tools/review/', RevData).subscribe(data => {
      this.review_response = data;
      alert(this.review_response.result.successText);
    },
    err => {
      if(err.status == 422){
        alert("Были введены неправильные е-мейл или пароль.Попробуйте, ещё раз!")
      }
    });
  }


  share() {
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

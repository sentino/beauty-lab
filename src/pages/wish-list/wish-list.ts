// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../services/config/config';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
// import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { HttpClient } from '@angular/common/http';
import { PostProductCartAction, selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { WishListService } from '../../services/wish-list.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

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
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          Избранные
        </ion-title>

        <ion-buttons end>
          <button ion-button icon-only (click)="openSearch()">
            <ion-icon name="search"></ion-icon>
          </button>
          <button ion-button icon-only class="cart-button" (click)="openCart()">
            <ion-icon name="cart">
              <ion-badge color="secondary">{{(productsLength$ | async) ? (productsLength$ | async) : 0}}</ion-badge>
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>


    <div class="scroll-content">
      <main style="margin-top: 56px; padding: 22px 0 65px 16px;" *ngIf="productsWishList$ | async">
        <div class="l-goods" *ngFor="let item of (productsWishList$ | async)">
          <div class="c-good" style="margin: 0 auto 16px;">
            <img [src]="item.IMAGE" alt="vichy-cream" class="c-good__image">
            <div class="l-good__info">
              <h2 class="c-good__title" style="margin: 0;">
                {{(item.NAME.length > 65)? (item.NAME | slice:0:65)+'...':(item.NAME)}}
              </h2>
              <div class="l-good__row l-good__row--little-margin" *ngIf="item.PRICE !== item.PRICE_DISCOUNT">
                <span class="c-good__price c-good__price--del">{{item.PRICE_DISCOUNT_FORMAT}}</span>
                <span class="c-good__country">{{item.COUNTRY}}</span>
              </div>
              <div class="l-good__row">
                <span class="c-good__price c-good__price--new">{{item.PRICE_FORMAT}}</span>
                <button class="c-good__favorite c-good__favorite--selected"></button>
              </div>
              <button class="c-primary-button c-primary-button--narrow" (click)="addProduct(item.ID)">КУПИТЬ</button>
            </div>
          </div>
        </div>

        <div class="c-disclaimer">
          <h2 class="c-disclaimer__title">Информация о юрлице продавца и лицензии</h2>
          <p class="c-disclaimer__text">
            РЫБНЫЙ ТЕКСТ <br /> Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
            et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
            ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis
            enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
            In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum
            felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum
          </p>
        </div>
      </main>
    </div>
  `,
})
export class WishListPage implements OnInit {
  productsLength$ = this.store.select(selectCartProductsLength);
  productsWishList$: Observable<any>;

  // @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  // page = 0;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    private wishListService: WishListService
    // public navParams: NavParams,
    // public http: HttpClient,
    // public config: ConfigProvider,
    // public shared: SharedDataProvider,
    // translate: TranslateService
  ) { }


  public ngOnInit(): void {
    this.productsWishList$ = this.wishListService.getList().map(res => res.result ? res.result.products : undefined);
  }


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
  // ngOnInit() {
    // this.getProducts();
  // }
  addProduct(id) {
    this.store.dispatch(new PostProductCartAction({id: id, quantity: 1}));
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  // ionViewWillEnter() {
  // }
}

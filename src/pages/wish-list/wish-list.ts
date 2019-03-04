// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Unsubscriber } from '../../helpers/unsubscriber';
import { LoadingProvider } from '../../services/loading/loading';

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
      <ion-grid class="page-empty" *ngIf="!productsWishList" [@animate]>
        <ion-row align-items-center>
          <ion-col col-12>
            <h4 text-center>Ваш список избранных товаров пуст</h4>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      <main style="margin-top: 56px; padding: 22px 16px 65px 16px; display: flex; flex-flow: wrap;" *ngIf="productsWishList">
        <app-product-cart *ngFor="let item of productsWishList"
                          [type]="'lg'"
                          [cart]="item"
                          style="margin: auto;"
        ></app-product-cart>

        <div class="c-disclaimer">
          <!--<h2 class="c-disclaimer__title">Информация о юрлице продавца и лицензии</h2>-->
          <!--<p class="c-disclaimer__text">-->
            <!--РЫБНЫЙ ТЕКСТ <br /> Lorem ipsum dolor sit amet, consectetuer adipiscing elit.-->
            <!--Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus-->
            <!--et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,-->
            <!--ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis-->
            <!--enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.-->
            <!--In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum-->
            <!--felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum-->
          <!--</p>-->
        </div>
      </main>
    </div>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
})
export class WishListPage extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  productsWishList;

  // @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  // page = 0;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    private wishListService: WishListService,
    private loading: LoadingProvider,
    // public navParams: NavParams,
    // public http: HttpClient,
    // public config: ConfigProvider,
    // public shared: SharedDataProvider,
    // translate: TranslateService
  ) {
    super();
  }


  public ngOnInit(): void {
    this.loading.showSpinner();
    this.wrapToUnsubscribe(this.wishListService.getList()).subscribe(res => {
      this.productsWishList = res.result.products;
      this.loading.hideSpinner();
    });
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
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

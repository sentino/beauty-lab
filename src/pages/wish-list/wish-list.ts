import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { trigger, transition, animate, style } from '@angular/animations';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { PostProductCartAction, selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { WishListService } from '../../services/wish-list.service';
import 'rxjs/add/operator/map';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { LoadingProvider } from '../../services/loading/loading';
import { SearchService } from '../../services/search.service';
import { AnalyticsService } from '../../services/analytics.service';

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
      <ion-navbar [style.boxShadow]="searchList ? 'none' : ''">
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          Избранные
        </ion-title>

        <ion-buttons end>
          <button ion-button icon-only (click)="searchList = !searchList">
            <ion-icon name="search"></ion-icon>
          </button>
          <button ion-button icon-only class="cart-button" (click)="openCart()">
            <ion-icon name="cart">
              <ion-badge color="secondary">{{(productsLength$ | async) ? (productsLength$ | async) : 0}}</ion-badge>
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>
      <form  class="search-form" (ngSubmit)="getSearch(search.value)" *ngIf="searchList" [@animate]>
        <ion-item>
          <ion-icon name="search"></ion-icon>
          <ion-input #search name="search" placeholder="Поиск..." type="text"></ion-input>
        </ion-item>
        <ion-icon class="close-icon" name="close" (click)="searchList = !searchList"></ion-icon>
      </form>
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
  searchList = false;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    private wishListService: WishListService,
    private loading: LoadingProvider,
    private searchService: SearchService,
    private ga: AnalyticsService,
  ) {
    super();

    this.ga.trackPage('wishlist');
  }


  public ngOnInit(): void {
    this.loading.showSpinner();
    this.wrapToUnsubscribe(this.wishListService.getList()).subscribe(res => {
      if (res.result) this.productsWishList = res.result.products;
      this.loading.hideSpinner();
    });
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
  }

  addProduct(id) {
    this.store.dispatch(new PostProductCartAction({id: id, quantity: 1}));
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

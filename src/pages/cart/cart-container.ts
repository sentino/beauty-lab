import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { delay, distinctUntilChanged } from 'rxjs/operators';
import { trigger, style, animate, transition } from '@angular/animations';
import { ConfirmOrderContainer } from '../confirm-order/confirm-order-container';
import { CartService } from '../../services/cart.service';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/delay";
import "rxjs/add/operator/distinctUntilChanged";
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  DeleteProductCartAction,
  GetCouponsAction,
  selectCartPresents,
  selectCartProducts,
  selectCartProductsLength,
  selectCartTotalNewPrice,
  selectCartTotalOldPrice,
  selectContainsDiscount, selectContainsDiscountLength,
  selectCouponFail,
  UpdateQuantityCartAction,
} from '../../app/store';
import { of, Subscription } from 'rxjs';
import { AlertProvider } from '../../services/alert/alert';
import { HomePage } from '../home/home';
import { SearchService } from '../../services/search.service';
import { SearchPage } from '../search/search';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { AnalyticsService } from '../../services/analytics.service';



@Component({
  selector: 'cart-container',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  template: `
    <ion-header #myElement>
      <ion-navbar [style.boxShadow]="searchList ? 'none' : ''">
        <ion-title>
          Корзина
        </ion-title>

        <ion-buttons end>
          <button ion-button icon-only (click)="searchList = !searchList">
            <ion-icon name="search"></ion-icon>
          </button>
          <button ion-button icon-only class="cart-button">
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


    <ion-content class="page-cart" style="background-color: rgb(255, 255, 255);">

      <ion-grid class="page-empty" *ngIf="!(productsLength$ | async)" [@animate]>
        <ion-row align-items-center>
          <ion-col col-12>
            <h3 text-center>
              <ion-icon name="cart"></ion-icon>
            </h3>
            <h4 text-center>Ваша корзина пуста</h4>
            <h5 text-center>продолжить покупки</h5>
            <p text-center>
              <button ion-button color="secondary" (click)="openHomePage()">Главная страница</button>
            </p>
          </ion-col>
        </ion-row>
      </ion-grid>

      

      <main class="card-product" *ngIf="(productsLength$ | async)">
        <div class="l-good">
          <app-cart
            *ngIf="products$ | async"
            [products]="products$ | async"
            (deleteProduct)="deleteProduct($event)"
            (quantityProduct)="quantityProduct($event)"
          ></app-cart>
          
          <app-presents
            *ngIf="presents$ | async"
            [presents]="presents$ | async"
          ></app-presents>
        </div>
        
        <ion-list style="display: flex;
                          flex-direction: row;
                          align-items: flex-end;">
          <ion-item style=" border: none;
                            padding: 0;
                            background-color: white;
                            margin-right: 10px;">
            <ion-label color="secondary" floating>Введите промокод</ion-label>
            <ion-input [formControl]="promoCode"></ion-input>
          </ion-item>
          <button
            [disabled]="!promoCode.value || promoCode.invalid"
            class="c-primary-button c-primary-button--halfofpage" (click)="submitCoupon()">
            Применить
          </button>
        </ion-list>
        <p style="color: green;" *ngIf="(discountLength$ | async)">
          Купон
          <span *ngFor="let item of (discount$ | async)">{{item}}</span>,
          применен
        </p>
        <p style="color: red;" *ngIf="(couponFail$ | async)">Купон {{couponFail$ | async}} не действительный</p>

        <div class="c-total-sum">
          <h2 class="c-total-sum__title">Общая сумма:</h2>
          <span class="c-total-sum__price" *ngIf="(oldPrice$ && newPrice$) | async">
              <span class="c-total-sum__price--del" *ngIf="(oldPrice$ | async) !== (newPrice$ | async)">{{oldPrice$ | async}}</span>
              <span class="c-total-sum__price--total">{{newPrice$ | async}}</span>
          </span>
        </div>

        <div class="l-button-container">
          <button 
            class="c-primary-button c-primary-button--halfofpage" (click)="submit()">
            КУПИТЬ
          </button>
          <button class="c-default-button c-default-button--halfofpage" (click)="openModal()">
            КУПИТЬ В 1 КЛИК
          </button>
        </div>

        <div class="c-disclaimer">
        </div>
      </main>

    </ion-content>
    
    
    <ion-footer>
      <footer></footer>
    </ion-footer>

    <app-modal-one-click-order
      *ngIf="modal"
      (close)="openModal()"
    ></app-modal-one-click-order>
  `
})
export class CartContainer extends Unsubscriber implements OnInit, OnDestroy {
  products$ = this.store.select(selectCartProducts);
  productsLength$ = this.store.select(selectCartProductsLength);
  presents$ = this.store.select(selectCartPresents);
  oldPrice$ = this.store.select(selectCartTotalOldPrice);
  newPrice$ = this.store.select(selectCartTotalNewPrice);
  discount$ = this.store.select(selectContainsDiscount);
  discountLength$ = this.store.select(selectContainsDiscountLength);
  couponFail$ = this.store.select(selectCouponFail);

  subscribeQuantity: Subscription;

  promoCode: FormControl;
  modal = false;

  searchList = false;

  constructor(
    public navCtrl: NavController,
    private cartService: CartService,
    private store: Store<any>,
    private alertProvider: AlertProvider,
    private searchService: SearchService,
    private ga: AnalyticsService
  ) {
    super();

    this.ga.trackPage('cart');

    this.promoCode = new FormControl('', [
      Validators.minLength(1),
      Validators.maxLength(50)
    ])
  }


  public ngOnInit(): void {
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
  }

  quantityProduct({id, quantity}) {
    this.subscribeQuantity = of({id, quantity})
      .pipe(
        distinctUntilChanged(),
        delay(2000)
      ).subscribe(({id, quantity}) => {
        this.store.dispatch(new UpdateQuantityCartAction({id, quantity}))
    })
  }

  deleteProduct(id) {
    this.store.dispatch(new DeleteProductCartAction(id));
  }

  submitCoupon() {
    if (this.promoCode.value && this.promoCode.valid) {
      this.wrapToUnsubscribe(this.cartService.postCoupon(this.promoCode.value)).subscribe((res: any) => {
        this.store.dispatch(new GetCouponsAction());
      })
    }
  }

  submit() {
    this.navCtrl.push(ConfirmOrderContainer);
  }

  openModal() {
    this.modal = !this.modal;
  }

  openHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  public ngOnDestroy(): void {
    if (this.subscribeQuantity) this.subscribeQuantity.unsubscribe();
    super.ngOnDestroy();
  }
}

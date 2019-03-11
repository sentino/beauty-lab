import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingProvider } from '../../services/loading/loading';
import { AlertProvider } from '../../services/alert/alert';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { GetDataCartAction, selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { OrdersService } from '../../services/orders.service';
import { ProductDetailPage } from '../product-detail/product-detail';
import { animate, style, transition, trigger } from '@angular/animations';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { SearchService } from '../../services/search.service';


@Component({
  selector: 'page-my-orders',
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
    <ion-header>
      <ion-navbar [style.boxShadow]="searchList ? 'none' : ''">
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          История заказов
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
      <ion-grid class="page-empty" *ngIf="!orders || !orders.length" [@animate]>
        <ion-row align-items-center>
          <ion-col col-12>
            <h4 text-center>Ваша история покупок отобразится после первого оплаченного заказа</h4>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      <main style="margin-top: 56px;" *ngIf="orders">
        <div class="l-order" *ngFor="let order of orders">
          <div class="c-paragraph">
            <div class="c-paragraph__title">Номер заказа</div>
            <div class="c-paragraph__value">№{{order.number}}</div>
          </div>
          <div class="c-paragraph">
            <div class="c-paragraph__title">Дата заказа</div>
            <div class="c-paragraph__value">{{order.date}}</div>
          </div>
          <div class="c-paragraph">
            <div class="c-paragraph__title">Статус</div>
            <div class="c-paragraph__value">{{order.status}}</div>
          </div>
          <div class="c-paragraph">
            <div class="c-paragraph__title">Сумма к оплате</div>
            <div class="c-paragraph__value">{{order.priceFormat}}</div>
          </div>
          <div class="c-paragraph">
            <div class="c-paragraph__title">Оплачен</div>
            <div class="c-paragraph__value" *ngIf="order.payed === 'N'">Не оплачен</div>
            <div class="c-paragraph__value" *ngIf="order.payed === 'Y'">Оплачен</div>
          </div>
          <div class="c-paragraph">
            <div class="c-paragraph__title">Способ оплаты</div>
            <div class="c-paragraph__value">{{order.payment}}</div>
          </div>
          <div class="c-paragraph">
            <div class="c-paragraph__title">Доставка</div>
            <div class="c-paragraph__value">{{order.delivery}}</div>
          </div>
          <div class="c-order-list">
            <h2 class="c-order-list__title">Состав заказа</h2>
            <div class="c-order-item" *ngFor="let item of order.basket">
              <p class="c-order-item__title" 
                 style="word-wrap: break-word;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                        max-width: 83%;
                        float: left;
                        margin: 0;"
                 (click)="showProductDetail(item.productId)">
                {{item.name}}
              </p>
              <span class="c-order-item__quantity">&nbsp;- {{item.quantity.split('.')[0]}} шт.</span>
            </div>
          </div>
          <button class="c-default-button c-default-button--resized" (click)="repeatOrder(order.number)">ПОВТОРИТЬ ЗАКАЗ</button>
        </div>
      </main>
    </div>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
})
export class MyOrdersPage extends Unsubscriber implements OnInit, OnDestroy{
  productsLength$ = this.store.select(selectCartProductsLength);

  orders;

  searchList = false;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    private ordersService: OrdersService,
    private loading: LoadingProvider,
    private alert: AlertProvider,
    private searchService: SearchService,
  ) {
    super();
  }


  public ngOnInit(): void {
    this.loading.showSpinner();
    this.wrapToUnsubscribe(this.ordersService.getOrders()).subscribe(res => {
      this.orders = res.result.orders;
      this.loading.hideSpinner();
    })
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
  }

  repeatOrder(id) {
    this.ordersService.postOrders(id).subscribe(res => {
      this.alert.show(res.result.successText);
      if (res.status === 200) {
        this.store.dispatch(new GetDataCartAction());
      }
    })
  }

  showProductDetail(id) {
    this.navCtrl.push(ProductDetailPage, { prod_id: id });
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

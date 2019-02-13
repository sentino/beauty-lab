// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../services/config/config';
// import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { LoadingProvider } from '../../services/loading/loading';
import { AlertProvider } from '../../services/alert/alert';
import { OrderDetailPage } from '../order-detail/order-detail';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { HttpClient } from '@angular/common/http';
import { GetDataCartAction, selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { OrdersService } from '../../services/orders.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'page-my-orders',
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          История заказов
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
      <main style="margin-top: 56px;" *ngIf="orders$ | async">
        <div class="l-order" *ngFor="let order of (orders$ | async)">
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
              <!--<span class="c-order-item__title">{{(item.name.length > 30)? (item.name | slice:0:30)+'...':(item.name)}}</span>-->
              <p class="c-order-item__title" style="word-wrap: break-word;
                                                      text-overflow: ellipsis;
                                                      white-space: nowrap;
                                                      overflow: hidden;
                                                      max-width: 83%;
                                                      float: left;
                                                      margin: 0;">{{item.name}} </p>
              <span class="c-order-item__quantity"> - {{item.quantity.split('.')[0]}} шт.</span>
            </div>
          </div>
          <button class="c-default-button c-default-button--resized" (click)="repeatOrder(order.number)">ПОВТОРИТЬ ЗАКАЗ</button>
        </div>
      </main>
    </div>
  `,
})
export class MyOrdersPage  implements OnInit{
  productsLength$ = this.store.select(selectCartProductsLength);

  orders$: Observable<any>;
  // orders = new Array;
  // httpRunning = true;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    private ordersService: OrdersService,
    // public navParams: NavParams,
    // public http: HttpClient,
    // public config: ConfigProvider,
    // public shared: SharedDataProvider,
    // translate: TranslateService,
    private alert: AlertProvider,
    // public loading: LoadingProvider
  ) {
  }


  public ngOnInit(): void {
    this.orders$ = this.ordersService.getOrders().map(res => res.result.orders)
  }

  repeatOrder(id) {
    this.ordersService.postOrders(id).subscribe(res => {
      this.alert.show(res.result.successText);
      if (res.status === 200) {
        this.store.dispatch(new GetDataCartAction());
      }
    })
  }

  // getOrders() {
  //   this.httpRunning = true;
  //   this.orders = [];
  //   this.loading.show();
  //   var data: { [k: string]: any } = {};
  //   data.customers_id = this.shared.customerData.customers_id;
  //   data.language_id = this.config.langId;
  //   this.http.post(this.config.url + 'getOrders', data).map(res => res.json()).subscribe(data => {
  //     this.loading.hide();
  //     this.httpRunning = false;
  //     //$rootScope.address=response.data.data;
  //     if (data.success == 1) {
  //       this.orders = [];
  //       this.orders = data.data;
  //     }
  //     // $scope.$broadcast('scroll.refreshComplete');
  //   },
  //     function (response) {
  //       this.loading.hide();
  //       this.alert.show("Server Error while Loading Orders");
  //       console.log(response);
  //     });
  // };

  // showOrderDetail(order) {
  //
  //   this.navCtrl.push(OrderDetailPage, { 'data': order });
  //
  // }
  // ionViewDidLoad() {
  //   this.httpRunning = true;
  //   // this.getOrders();
  // }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}

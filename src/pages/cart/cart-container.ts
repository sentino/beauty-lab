// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, Events, ModalController } from 'ionic-angular';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { ConfigProvider } from '../../services/config/config';
import { Http } from '@angular/http';
import { delay, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Toast } from '@ionic-native/toast/ngx';
import { ProductDetailPage } from '../product-detail/product-detail';
import { LoadingProvider } from '../../services/loading/loading';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { ShippingAddressPage } from '../shipping-address/shipping-address';
import { trigger, style, animate, transition } from '@angular/animations';
import { ProductsPage } from '../products/products';
import { HttpClient } from '@angular/common/http';
import { ConfirmOrderContainer } from '../confirm-order/confirm-order-container';
import { PayPaylerService } from '../../services/pay-payler.service';
import { CartService } from '../../services/cart.service';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/delay";
import "rxjs/add/operator/distinctUntilChanged";
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  DeleteProductCartAction,
  selectCartPresents,
  selectCartProducts,
  selectCartProductsLength,
  selectCartTotalNewPrice,
  selectCartTotalOldPrice, UpdateQuantityCartAction, // selectContainsDiscount
} from '../../app/store';
import { Observable, of, pipe, Subscription } from 'rxjs';
import { AlertProvider } from '../../services/alert/alert';


export class ValidateCoupon {
  static createValidator(cartService: CartService) {
    return (control: AbstractControl) => {
      return cartService.postCoupon(control.value).map((res: any) => {
        return res.status === 200 ? null : {'error': true};
      });
    };
  }
}


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
      <ion-navbar>
        <ion-title>
          Корзина
        </ion-title>

        <ion-buttons end>
          <button ion-button icon-only class="cart-button">
            <ion-icon name="cart">
              <ion-badge color="secondary">{{(productsLength$ | async) ? (productsLength$ | async) : 0}}</ion-badge>
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>


    <ion-content class="page-cart">

      <ion-grid class="page-empty" *ngIf="!(productsLength$ | async)" [@animate]>
        <ion-row align-items-center>
          <ion-col col-12>
            <h3 text-center>
              <ion-icon name="cart"></ion-icon>
            </h3>
            <h4 text-center>Ваша корзина пуста</h4>
            <h5 text-center>продолжить покупки</h5>
            <p text-center>
              <button ion-button color="secondary" (click)="openProductsPage()">Страница товаров</button>
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
        
        <ion-list>
          <ion-item style=" border: none;
                            padding: 0;
                            background-color: white;">
            <ion-label color="secondary" floating>Введите промокод</ion-label>
            <ion-input [formControl]="promoCode"></ion-input>
          </ion-item>
        </ion-list>

        <div class="c-total-sum">
          <h2 class="c-total-sum__title">Общая сумма:</h2>
          <span class="c-total-sum__price" *ngIf="(oldPrice$ && newPrice$) | async">
                  <span class="c-total-sum__price--del">{{oldPrice$ | async}}</span>
                  <span class="c-total-sum__price--total">{{newPrice$ | async}}</span>
              </span>
        </div>

        <div class="l-button-container">
          <button 
            class="c-primary-button c-primary-button--halfofpage" (click)="submit()">
            КУПИТЬ
          </button>
          <button class="c-default-button c-default-button--halfofpage">
            КУПИТЬ В 1 КЛИК
          </button>
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

    </ion-content>


    <ion-footer>
      <footer></footer>
    </ion-footer>
  `
  // providers: [
  //   PayPaylerService
  // ]
})
export class CartContainer implements OnInit, OnDestroy {
  // products;
  // discount;
  // presents;
  // oldPrice;
  // newPrice;

  products$ = this.store.select(selectCartProducts);
  productsLength$ = this.store.select(selectCartProductsLength);
  presents$ = this.store.select(selectCartPresents);
  oldPrice$ = this.store.select(selectCartTotalOldPrice);
  newPrice$ = this.store.select(selectCartTotalNewPrice);
  // discount$ = this.store.select(selectContainsDiscount);

  subscribeQuantity: Subscription;

  promoCode: FormControl;
  // total: any;

  constructor(
    public navCtrl: NavController,
    private cartService: CartService,
    private store: Store<any>,
    private alertProvider: AlertProvider
    // public shared: SharedDataProvider,
    // public config: ConfigProvider,
    // public http: HttpClient,
    // public loading: LoadingProvider,
    // public toast: Toast,
    // private storage: Storage,
    // public events: Events,
    // public modalCtrl: ModalController,
    // private payPayler: PayPaylerService
  ) {
    // this.payPayler.testPostItem();
    this.promoCode = new FormControl('', [
      Validators.minLength(1),
      Validators.maxLength(50)
    ])
    // ], ValidateCoupon.createValidator(this.cartService))
  }


  public ngOnInit(): void {
    // this.cartService.getCart().subscribe((res: any) => {
    //   console.log(res);
    //   this.products = res.result.basket;
    //   this.discount = res.result.discount;
    //   this.presents = res.result.gifts;
    //   this.oldPrice = res.result.summary.sumFullFormat;
    //   this.newPrice = res.result.summary.sumFormat;
    //   // debugger;
    // })

    // this.initializeData();
  }

  // initializeData() {
  //   this.products$ = this.cartService.getCart().map( res => res.result.basket);
  //   this.productsLength$ = this.cartService.getCart().map( res => res.result.basket.length);
  //   this.presents$ = this.cartService.getCart().map( res => res.result.gifts);
  //   this.oldPrice$ = this.cartService.getCart().map( res => res.result.summary.sumFullFormat);
  //   this.newPrice$ = this.cartService.getCart().map( res => res.result.summary.sumFormat);
  // }

  quantityProduct({id, quantity}) {
    this.subscribeQuantity = of({id, quantity})
      .pipe(
        distinctUntilChanged(),
        delay(700)
      ).subscribe(({id, quantity}) => {
        this.store.dispatch(new UpdateQuantityCartAction({id, quantity}))
    })
  }

  deleteProduct(id) {
    this.store.dispatch(new DeleteProductCartAction(id));
    // this.cartService.delProduct(id)
    // .subscribe((res: any) => {
    //   if (res.result.error === 0) this.initializeData();
    // });
  }

  submit() {
    if (this.promoCode.value && this.promoCode.valid) {
      this.cartService.postCoupon(this.promoCode.value).subscribe((res: any) => {
        if (res.status === 200) {
          this.navCtrl.push(ConfirmOrderContainer);
        } else {
          this.alertProvider.show('Купон не верный!')
        }
      })
    } else {
      this.navCtrl.push(ConfirmOrderContainer);
    }
  }


  // totalPrice() {
  //   var price = 0;
  //   for (let value of this.shared.cartProducts) {
  //     var pp = value.final_price * value.customers_basket_quantity;
  //     price = price + pp;
  //   }
  //   this.total = price;
  // };
  // getSingleProductDetail(id) {
  //   this.loading.show();
  //
  //   var data: { [k: string]: any } = {};
  //   if (this.shared.customerData != null)
  //     data.customers_id = this.shared.customerData.customers_id;
  //   else
  //     data.customers_id = null;
  //   data.products_id = id;
  //   data.language_id = this.config.langId;
  //   // this.http.post(this.config.url + 'getAllProducts', data).map(res => res.json()).subscribe(data => {
  //   //   this.loading.hide();
  //   //   if (data.success == 1) {
  //   //     this.navCtrl.push(ProductDetailPage, { data: data.product_data[0] });
  //   //   }
  //   // });
  // }
  // removeCart(id) {
  //   this.shared.removeCart(id);
  //   this.totalPrice();
  // }
  // qunatityPlus = function (q) {
  //   this.toast.show(`Product Quantity is Limited!`, 'short', 'center');
  //   q.customers_basket_quantity++;
  //   q.subtotal = q.final_price * q.customers_basket_quantity;
  //   q.total = q.subtotal;
  //   if (q.customers_basket_quantity > q.quantity) {
  //     q.customers_basket_quantity--;
  //     this.toast.show(`Product Quantity is Limited!`, 'short', 'center');
  //   }
  //   this.totalPrice();
  //   this.shared.cartTotalItems();
  //   this.storage.set('cartProducts', this.shared.cartProducts);
  // }
  // //function decreasing the quantity
  // qunatityMinus = function (q) {
  //   if (q.customers_basket_quantity == 1) {
  //     return 0;
  //   }
  //   q.customers_basket_quantity--;
  //   q.subtotal = q.final_price * q.customers_basket_quantity;
  //   q.total = q.subtotal;
  //   this.totalPrice();
  //
  //   this.shared.cartTotalItems();
  //   this.storage.set('cartProducts', this.shared.cartProducts);
  // }
  // ionViewDidLoad() {
  //   this.totalPrice()
  // }
  // proceedToCheckOut() {
  //
  //   if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
  //     let modal = this.modalCtrl.create(LoginPage);
  //     modal.present();
  //   }
  //   else {
  //     this.navCtrl.push(ShippingAddressPage);
  //   }
  // }
  openProductsPage() {
    this.navCtrl.setRoot(ProductsPage, { sortOrder: 'newest' });
  }
  // ionViewDidLeave() {
  //  // this.storage.set('cartProducts', this.shared.cartProducts);
  // }
  // ionViewWillEnter() {
  // }

  public ngOnDestroy(): void {
    if (this.subscribeQuantity) this.subscribeQuantity.unsubscribe();
  }
}

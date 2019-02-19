import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PayPaylerService } from '../../services/pay-payler.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder, FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  GetDataConfirmOrderAction, GetDataConfirmOrderSuccessAction,
  selectCartTotalNewPrice,
  selectDataConfirmOrderNotify,
  selectDataConfirmOrderWarning
} from '../../app/store';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HomePage } from '../home/home';
import { App } from 'ionic-angular';
import { AlertProvider } from '../../services/alert/alert';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


export function bonusesQuantity(controlOne: AbstractControl, controlTwo: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } => {
    if (!controlOne && !controlTwo) {
      return null;
    }

    return controlOne.value === true &&
           controlTwo.value === "" ||
           controlTwo.value < 1 ||
           controlTwo.value > 500 ? {'error': true} : null
  }
};


@Component({
  selector: 'confirm-order-container',
  animations: [
    trigger(
      'slideInOut', [
        state('in', style({
          width: '0'
        })),
        state('out', style({
          width: '100%'
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
  ],
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>
          Подтверждение заказа
        </ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content class="confirm-order">
      <app-confirm-order-component
        *ngIf="form && result"
        [form]="form"
        [products]="products"
        [gifts]="gifts"
        [delivery]="delivery"
        [payments]="payments"
        [innerPayment]="innerPayment"
        [locations]="locations"
        [oldPrice]="oldPrice"
        [newPrice]="newPrice"
        [oldPriceFormat]="oldPriceFormat"
        [newPriceFormat]="newPriceFormat"
        [priceDelivery]="priceDelivery"
        [weight]="weight"
        [weightFormat]="weightFormat"
        [canOrder]="canOrder"
        [fieldAddress]="fieldAddress"
        [warning]="warning$ | async"
        [notify]="notify$ | async"
        (selectedLocation)="putSelectedLocation($event)"
        (deliveryId)="putDeliveryData($event)"
        (pointResultId)="putDeliveryData(form.controls['listItemTwo'].get('delivery').value, $event)"
        (submit)="submit()"
      ></app-confirm-order-component>
      
      <section *ngIf="paymentBody" [innerHTML]="paymentBody | sanitizeHtml">
        
      </section>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
    `
})

export class ConfirmOrderContainer implements OnInit{
  warning$ = this.store.select(selectDataConfirmOrderWarning);
  notify$ = this.store.select(selectDataConfirmOrderNotify);

  result;
  paymentBody;

  products: any[];
  gifts: any[];
  delivery: any[];
  payments: any[];
  innerPayment;
  locations;

  oldPrice;
  newPrice;
  oldPriceFormat;
  newPriceFormat;

  priceDelivery;
  weight;
  weightFormat;
  canOrder;
  fields;
  fieldAddress;
  // deliveryInfo;

  form: FormGroup;
  formFieldsName;
  formFieldsEmail;
  formFieldsPhone;


  private putLocation = '';
  private putDelivery = '';
  private putStore = '';

  constructor (
    private payPayler: PayPaylerService,
    private fb: FormBuilder,
    private store: Store<any>,
    private appCtrl: App,
    public alert: AlertProvider,
    // private theInAppBrowser: InAppBrowser
  ) {
    this.form = this.fb.group({
      'listItemOne': this.fb.group({
        'region': ['', [Validators.required]],
        'city': ['', [Validators.required]]
      }),
      'listItemTwo': this.fb.group({
        'delivery': ['', [Validators.required]]
      }),
      'listItemThree': this.fb.group({
        'typeOfPayment': ['', [Validators.required]],
        'bonuses': this.fb.group({
          'writeOffBonuses': [false],
          'quantity': [''],
        })
      }),
      'listItemFour': this.fb.group({
        'name': ['', [Validators.required, Validators.maxLength(150)]],
        'email': ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z]{2,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
        // 'phone': ['', [Validators.required, Validators.pattern(/^((\+7|7|8)+([0-9]){10})$/gm)]],
        'phone': ['', [Validators.required]],
        'address': [''],
        'comment': ['', [Validators.maxLength(600)]]
      })
    });
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetDataConfirmOrderAction());

    this.payPayler.getData().subscribe((res: any) => {
      this.products = res.result.basket;
      this.gifts = res.result.gifts;
      this.delivery = res.result.delivery;
      this.payments = res.result.payments;
      this.innerPayment = res.result.innerPayment;
      this.locations = res.result.locations.list;

      this.oldPrice = res.result.summary.sumFull;
      this.newPrice = res.result.summary.sum;
      this.oldPriceFormat = res.result.summary.sumFullFormat;
      this.newPriceFormat = res.result.summary.sumFormat;

      this.weight = res.result.summary.weight;

      this.fields = res.result.fields;
      this._fields();

      if (res.result.summary.deliveryPrice) {
        this.priceDelivery = res.result.summary.deliveryPriceFormat;
      } else {
        this.priceDelivery = 0;
      }

      // if (res.result.summary.deliveryPrice) {
        this.weightFormat = res.result.summary.weightFormat;
      // } else {
      //   this.weightFormat = 0;
      // }

      this.canOrder = res.result.can_order;

      
      if (this.formFieldsName !== res.result.fields[0].value ||
          this.formFieldsName !== res.result.fields[1].value ||
          this.formFieldsName !== res.result.fields[2].value) {
        this.formValue(res.result.fields)
      }

      if (!this.locations) {
        this.locations = res.result.locations.list;
      }

      this.result = res.result;
      console.log('getData', this.result);
    });
  }
  
  formValue(fields) {
      this.formFieldsName = fields[0].value;
      this.formFieldsEmail = fields[1].value;
      this.formFieldsPhone = fields[2].value;

      this.form.controls['listItemFour'].get('name').setValue(this.formFieldsName);
      this.form.controls['listItemFour'].get('email').setValue(this.formFieldsEmail);
      this.form.controls['listItemFour'].get('phone').setValue(this.formFieldsPhone);

      this.form.controls['listItemFour'].get('name').updateValueAndValidity();
      this.form.controls['listItemFour'].get('email').updateValueAndValidity();
      this.form.controls['listItemFour'].get('phone').updateValueAndValidity();
  }
  
  _fields() {
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i].code === "order_prop_5") {
        this.fieldAddress = true;
        this.form.controls['listItemFour'].get('address').setValidators([Validators.required, Validators.maxLength(150)]);
        this.form.controls['listItemFour'].get('address').updateValueAndValidity();
        break;
      } else {
        this.fieldAddress = false;
        this.form.controls['listItemFour'].get('address').setValidators([]);
        this.form.controls['listItemFour'].get('address').updateValueAndValidity();
      }
    }
  }


  putSelectedLocation(event) {
    this.payPayler.putData({location: event}).subscribe((res: any) => {
      this.store.dispatch(new GetDataConfirmOrderSuccessAction(res.result));

      console.log('location upd', res);
      this.form.controls['listItemTwo'].get('delivery').setValue('');
      this.form.controls['listItemTwo'].get('delivery').updateValueAndValidity();
      // this.deliveryInfo = undefined;

      this.putLocation = event;
      this.delivery = res.result.delivery;
      this.payments = res.result.payments;

      this.oldPrice = res.result.summary.sumFull;
      this.newPrice = res.result.summary.sum;
      this.oldPriceFormat = res.result.summary.sumFullFormat;
      this.newPriceFormat = res.result.summary.sumFormat;

      this.weight = res.result.summary.weight;
      
      this.fields = res.result.fields;
      this._fields();

      if (res.result.summary.deliveryPrice) {
        this.priceDelivery = res.result.summary.deliveryPriceFormat;
      } else {
        this.priceDelivery = 0;
      }

      // if (res.result.summary.deliveryPrice) {
        this.weightFormat = res.result.summary.weightFormat;
      // } else {
      //   this.weightFormat = 0;
      // }

      this.canOrder = res.result.can_order;
    })
  }


  putDeliveryData(event, pointResultId?) {
    this.putDelivery = event;
    let body;

    if (pointResultId) {
      this.putStore = String(pointResultId);

      body = {
        location: this.putLocation,
        delivery: event,
        store: String(pointResultId)
      }
    } else {
      body = {
        location: this.putLocation,
        delivery: event
      }
    }

    this.payPayler.putData(body).subscribe((res: any) => {
      this.store.dispatch(new GetDataConfirmOrderSuccessAction(res.result));

      console.log('delivery upd', res);
      this.payments = res.result.payments;
      this.innerPayment = res.result.innerPayment;

      // this.oldPrice = res.result.summary.sumFull;
      // this.newPrice = res.result.summary.sum;
      // this.newPriceFormat = res.result.summary.sumFormat;
      // this.oldPriceFormat = res.result.summary.sumFullFormat;
      this.newPriceFormat = res.result.summary.sumFullFormat;
      this.oldPrice = 1;
      this.newPrice = 1;

      this.weight = res.result.summary.weight;
      
      this.fields = res.result.fields;
      this._fields();

      if (this.innerPayment) {
        this.form.controls['listItemThree'].get('bonuses').get('quantity').setValidators([
          Validators.min(1),
          Validators.max(this.innerPayment.maxSumBonusPay)
        ]);
        this.form.controls['listItemThree'].get('bonuses').get('quantity').updateValueAndValidity();
      }

      this.canOrder = res.result.can_order;

      console.log(this.form);
    })
  }


  submit() {
    let body: any = {
      order_prop_1: this.form.controls['listItemFour'].get('name').value,
      order_prop_2: this.form.controls['listItemFour'].get('email').value,
      order_prop_3: this.form.controls['listItemFour'].get('phone').value,
      order_prop_14: 'Y',
      description: this.form.controls['listItemFour'].get('comment').value,
      payment: this.form.controls['listItemThree'].get('typeOfPayment').value,
      location: this.putLocation,
      delivery: this.putDelivery,
      store: this.putStore,
      bonusPay: this.form.controls['listItemThree'].get('bonuses').get('quantity').value,
    };

    let getAddressValue = this.form.controls['listItemFour'].get('address').value;
    if (getAddressValue) {
      body = {
        ...body,
        order_prop_5: getAddressValue
      };
    }

    let peyment: any = this.payments.filter(el => el.id === this.form.controls['listItemThree'].get('typeOfPayment').value)[0];

    if (peyment.cash === 'A') {
      // this.paymentBody = `
      // <div id="tmg_pk_form_container"><br>
      //   <h3>Сейчас Вы будете перенаправлены на страницу банка.</h3>
      //   <form id="pay_form" action="http://lab-krasoty.server.paykeeper.ru/create/" accept-charset="utf-8" method="post">
      //     <input type="hidden" name="sum" value = "1939.00"/>
      //     <input type="hidden" name="batch_date" value = "23.01.2019 16:31:11"/>
      //     <input type="hidden" name="orderid" value = "55290"/>
      //     <input type="hidden" name="clientid" value = "Артем Артемов"/>
      //     <input type="hidden" name="client_email" value = "arelat@ya.ru"/>
      //     <input type="hidden" name="client_phone" value = "+7 (999) 999-99-99"/>
      //     <input type="hidden" name="service_name" value = "paykeeper_payment_system"/>
      //     <input type="hidden" name="cart" value = '[{"name":"\u0412\u0438\u0448\u0438 (Vi\u0441hy) \u0421\u041b\u041e\u0423 \u0410\u0416 \u0424\u043b\u044e\u0438\u0434 \u0443\u043a\u0440\u0435\u043f\u043b\u044f\u044e\u0449\u0438\u0439 \u0430\u043d\u0442\u0438\u0432\u043e\u0437\u0440\u0430\u0441\u0442\u043d\u043e\u0439 \u0443\u0445\u043e\u0434 50\u043c\u043b","price":"1939.00","quantity":"1.0000","sum":"1939.00","tax":"none","tax_sum":"0.00"},{"name":"Fabrik cosmetology Collagen Crystal Mask Bio Gold \u041f\u0430\u0442\u0447\u0438 \u0434\u043b\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u0438 \u0432\u043e\u043a\u0440\u0443\u0433 \u0433\u043b\u0430\u0437 \u0441 \u0411\u0438\u043e \u0437\u043e\u043b\u043e\u0442\u043e\u043c N1","price":"0.00","quantity":"1.0000","sum":"0.00","tax":"none","tax_sum":"0.00"}]' />
      //     <input type="hidden" name="lang" value = ru />
      //     <input type="hidden" name="sign" value = "dac95cc31fd376ceef044b58db29acfeddd7f086b9e3f76be18b2e54be1a7130"/>
      //     <input type="submit" class="btn btn-default" value="Оплатить"/>
      //   </form>
      //   <script type="text/javascript">
      //       window.onload=function(){
      //           setTimeout(fSubmit, 2000);
      //       }
      //       function fSubmit() {
      //           document.forms["pay_form"].submit();
      //       }
      //   </script>
      //   <div>
      // `;

      // const browser = this.theInAppBrowser.create('../next.html', '_self');
      // browser.on('loadstop').subscribe(event => {
      //   browser.executeScript({ code: paymentBody });
      // });

      // this.payPayler.postData(body)
      //   .pipe(
      //     switchMap((res: any) => {
      //       debugger;
      //       // return this.payPayler.postPay(55290)
      //       // debugger;
      //       return this.payPayler.postPay(res.result.orderId)
      //     })
      //   ).subscribe(res => {
      //   // console.log(res);
      //   // debugger;
      //   this.appCtrl.getRootNav().setRoot(HomePage);
      //   this.alert.showWithTitle('Ваш заказ №##### от 15.02.2019 09:36:20 успешно создан.', 'Заказ сформирован')
      // })
    } else {
      this.payPayler.postData(body).subscribe((res: any) => {
        let day = this.formatDate(new Date().getDate()),
            month = this.formatDate(new Date().getMonth() + 1),
            year = new Date().getFullYear(),
            hour = this.formatDate(new Date().getHours()),
            minutes = this.formatDate(new Date().getMinutes()),
            seconds = this.formatDate(new Date().getSeconds());
        console.log(res);
        // debugger;
        this.appCtrl.getRootNav().setRoot(HomePage);
        this.alert.showWithTitle(
          `Ваш заказ №${res.result.orderId}
           от ${day}.${month}.${year} ${hour}:${minutes}:${seconds} успешно создан.`,
          'Заказ сформирован')
      })
    }


    // Rx.Observable.concat(55290, getPostTwo$).subscribe(res => console.log(res));
    // const posts$ = getPostOne$.mergeMap(orderId => getPostTwo$).subscribe(res => console.log(res))
  }

  formatDate(val) {
    if (val > 0 && val < 10) {
      return `0${val}`
    }
    return val;
  }

}

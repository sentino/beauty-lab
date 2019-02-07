import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PayPaylerService } from '../../services/pay-payler.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';


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
  providers: [
    PayPaylerService
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
        [delivery]="delivery"
        [payments]="payments"
        [locations]="locations"
        [price]="price"
        [priceDiscount]="priceDiscount"
        [priceDelivery]="priceDelivery"
        [canOrder]="canOrder"
        (selectedLocation)="putSelectedLocation($event)"
      ></app-confirm-order-component>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
    `
})

export class ConfirmOrderContainer implements OnInit{
  result;

  products: any[];
  delivery: any[];
  payments: any[];
  locations;
  price;
  priceDiscount;
  priceDelivery;
  canOrder;
  
  form: FormGroup;
  formFieldsName;
  formFieldsEmail;
  formFieldsPhone;

  constructor (
    private payPayler: PayPaylerService,
    private fb: FormBuilder
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
          'quantity': ['', [Validators.min(1), Validators.max(500)]],
        })
      }),
      'listItemFour': this.fb.group({
        'name': ['', [Validators.required, Validators.maxLength(150)]],
        'email': ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z]{2,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
        'phone': ['', [Validators.required, Validators.pattern(/^((\+7|7|8)+([0-9]){10})$/gm)]],
        'address': ['', [Validators.required, Validators.maxLength(150)]],
        'comment': ['', [Validators.maxLength(600)]]
      })
    });

    // this.form.controls['listItemThree'].get('bonuses').get('quantity').setValidators([
    //   bonusesQuantity(
    //     this.form.controls['listItemThree'].get('bonuses').get('writeOffBonuses'),
    //     this.form.controls['listItemThree'].get('bonuses').get('quantity')
    //   )
    // ])
  }

  public ngOnInit(): void {

    this.payPayler.getData().subscribe((res: any) => {
      this.products = res.result.basket;
      this.delivery = res.result.delivery; //???
      this.payments = res.result.payments; //???
      this.locations = res.result.locations.list;
      this.price = res.result.summary.sumFormat;
      this.priceDiscount = res.result.summary.discountFormat;
      this.priceDelivery = res.result.summary.deliveryPriceFormat;
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
      console.log(this.result);
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

  putSelectedLocation(event) {
    this.payPayler.putData({location: event}).subscribe(res => {
      console.log(res);
      debugger;
    })
  }
}

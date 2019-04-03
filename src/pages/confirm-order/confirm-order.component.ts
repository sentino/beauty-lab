import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-confirm-order-component',
  template: `    
    <div class="l-order-page" style="border-bottom: none; margin-top: 16px;">
      <ul class="l-order" style="border-top: none;">
        <li class="c-order" *ngFor="let item of products; let i = index">
          <div class="l-order__wrapper">
            <span style="font-size: 8px;">{{i+1}}.</span>
            <div class="l-order__item">
              <span class="c-order__title">{{item.name}}</span>
            </div>
            <span class="c-order__quantity">{{item.quantity}} шт.</span>
            <span class="c-order__price" *ngIf="item.price !== 0">
              {{item.sumFormat}}<br>
              <i *ngIf="item.price !== item.priceFull">{{item.sumFullFormat}}</i></span>
            <span class="c-order__price" *ngIf="item.price === 0">бесплатно</span>
          </div>
        </li>
      </ul>

      <h2 class="c-order_title" 
          *ngIf="gifts.length"
          style="font-size: 12px; font-weight: 500;margin-bottom: 0; padding-left: 10px;">
        Подарки!
      </h2>
      <ul class="l-order" style="padding-top: 8px; border-top: none;">
        <li class="c-order" *ngFor="let item of gifts; let i = index">
          <div class="l-order__wrapper">
            <span style="font-size: 8px;">{{i+1}}.</span>
            <div class="l-order__item">
              <span class="c-order__title">{{item.name}}</span>
            </div>
            <span class="c-order__quantity">{{item.quantity}} шт.</span>
            <span class="c-order__price" *ngIf="item.price === 0">Подарок!</span>
          </div>
        </li>
      </ul>
    </div>

    <section class="l-delivery-section" style="padding-left: 10px;">
      <div class="l-delivery" style="border-top: 1px solid #e0e0e0;">
        <div class="c-delivery" *ngIf="weight !== 0">
          <h2 class="c-delivery__title" style="margin: 0;">Вес доставки</h2>
          <span class="c-delivery__quantity">{{weightFormat}}</span>
        </div>
        <div class="c-delivery" *ngIf="_selectedDeliveryPrice && _selectedDeliveryPrice !== '0 руб.'">
          <h2 class="c-delivery__title" style="margin: 0;">Стоимость доставки</h2>
          <span class="c-delivery__quantity">{{_selectedDeliveryPrice}}</span>
        </div>
      </div>
      <div class="c-delivery c-delivery--total">
        <h2 class="c-delivery__title c-delivery__title--total">Общая сумма:</h2>
        <span class="c-delivery__price">
            <span class="c-delivery__price--del" *ngIf="oldPrice !== newPrice">{{oldPriceFormat}}</span>
            <span class="c-delivery__price--total">{{newPriceFormat}}</span>
        </span>
      </div>
      <div class="c-warning" *ngIf="warning">
        {{_warning}}
      </div>
      <div class="c-warning-notify" *ngIf="notify">
        {{_notify}}
      </div>
    </section>
    
    <div class="l-info" style="padding-left: 10px;">
      <section *ngFor="let item of sectionLists">
        <app-section-list
          *ngIf="form"
          [form]="form"
          [title]="item.title"
          [idSection]="item.idSection"
          [locations]="locations"
          [delivery]="delivery"
          [priceDelivery]="priceDelivery"
          [payments]="payments"
          [innerPayment]="innerPayment"
          [city]="city"
          [fieldAddress]="fieldAddress"
          [returnReplace]="returnReplace"
          (pointResultId)="_pointResultId($event)"
          (selectedDeliveryPrice)="selectedDeliveryPrice($event)"
          (blurQuantity)="_blurQuantity($event)"
        ></app-section-list>
      </section>
      
      <div class="c-disclaimer">
        Нажимая кнопку «Оформить заказ», я подтверждаю наличие рецепта,
        соглашаюсь на обработку персональных данных и получать
        информацию о статусе заказа в соответствии с
        <a class="c-disclaimer__link">политикой конфиденциальности</a> и
        <a class="c-disclaimer__link">пользовательским соглашением.</a>
      </div>
      <button 
        class="c-default-button c-default-button--large"
        (click)="submitForm()"
        [ngClass]="form.invalid || !canOrder ? 'c-default-button--disabled' : ''"
        [disabled]="(form.invalid || !canOrder)">ОФОРМИТЬ ЗАКАЗ</button>
    </div>
  `
})

export class ConfirmOrderComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() products;
  @Input() gifts;

  @Input() oldPrice;
  @Input() newPrice;
  @Input() oldPriceFormat;
  @Input() newPriceFormat;

  @Input() canOrder;
  @Input() locations;
  @Input() delivery;
  @Input() priceDelivery;
  @Input() weight;
  @Input() weightFormat;
  @Input() payments;
  @Input() innerPayment;
  @Input() fieldAddress;
  @Input('warning') _warning;
  @Input('notify') _notify;
  @Input() returnReplace;

  @Output() selectedLocation: EventEmitter<any> = new EventEmitter<any>();
  @Output() deliveryId: EventEmitter<any> = new EventEmitter<any>();
  @Output() pointResultId: EventEmitter<any> = new EventEmitter<any>();
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() blurQuantity: EventEmitter<any> = new EventEmitter<any>();

  city;
  _selectedDeliveryPrice;

  sectionLists = [
    {
      title: '1. Регион доставки',
      idSection: 1
    },
    {
      title: '2. Выбор способа доставки',
      idSection: 2
    },
    {
      title: '3. Выбор способа оплаты',
      idSection: 3
    },
    {
      title: '4. Контактные данные получателя',
      idSection: 4
    },
  ];

  get warning() {
    return this._warning && typeof(this._warning) === 'string';
  }
  get notify() {
    return this._notify && typeof(this._notify) === 'string';
  }

  public ngOnInit(): void {
    this.form.controls['listItemThree'].get('bonuses').get('writeOffBonuses').valueChanges.subscribe(res => {
      this.form.controls['listItemThree'].get('bonuses').get('quantity').setValue('');
      this.form.controls['listItemThree'].get('bonuses').get('quantity').updateValueAndValidity();
    });

    this.form.controls['listItemOne'].get('region').valueChanges.subscribe(idRegion => {
      let city = this.locations.filter(el => el.id === idRegion);
      this.selectedLocation.emit(city[0].code);
      if (city[0].childs) {
        this.city = city[0].childs;
      } else {
        this.city = city;
      }
    });

    this.form.controls['listItemOne'].get('city').valueChanges.subscribe(city => {
      this.selectedLocation.emit(city);
    });

    this.form.controls['listItemTwo'].get('delivery').valueChanges.subscribe(deliveryId => {
      this.deliveryId.emit(deliveryId);
    });

  }

  _pointResultId(event) {
    this.pointResultId.emit(event);
  }

  selectedDeliveryPrice(event) {
    this._selectedDeliveryPrice = event;
  }

  _blurQuantity(event) {
    this.blurQuantity.emit(event);
  }

  submitForm() {
    this.submit.emit();
  }
}

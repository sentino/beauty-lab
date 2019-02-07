import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-confirm-order-component',
  template: `    
    <div class="l-order-page">
      <ul class="l-order">
        <li class="c-order" *ngFor="let item of products; let i = index">
          <div class="l-order__wrapper">
            <span style="font-size: 8px;">{{i+1}}.</span>
            <div class="l-order__item">
              <span class="c-order__title">{{item.name}}</span>
              <!--<span class="c-order__category">Крем</span>-->
            </div>
            <span class="c-order__quantity">{{item.quantity}} {{item.measure}}</span>
            <span class="c-order__price">{{item.sumFormat}} <br> <i>{{item.sumFullFormat}}</i></span>
          </div>
        </li>
      </ul>
      
      <!--<div class="c-gift c-gift&#45;&#45;hidden">-->
        <!--<h2 class="c-gift__title">Подарок!</h2>-->
        <!--<ol class="l-order">-->
          <!--<li class="c-order">-->
            <!--<div class="l-order__wrapper">-->
              <!--<div class="l-order__item">-->
                <!--<span class="c-order__title">Виши (Viсhy) СЛОУ АЖ Флюид укрепляющий антивозрастной уход 50мл Крем</span>-->
                <!--<span class="c-order__category">Крем</span>-->
              <!--</div>-->
              <!--<span class="c-order__quantity">1 шт.</span>-->
              <!--<span class="c-order__price">0 руб.</span>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ol>-->
      <!--</div>-->
    </div>

    <section class="l-delivery-section">
      <!--<div class="l-delivery">-->
        <!--<div class="c-delivery">-->
          <!--<h2 class="c-delivery__title">Вес доставки</h2>-->
          <!--<span class="c-delivery__quantity">2 кг.</span>-->
        <!--</div>-->
        <!--<div class="c-delivery">-->
          <!--<h2 class="c-delivery__title">Стоимость доставки</h2>-->
          <!--<span class="c-delivery__quantity">300 руб.</span>-->
        <!--</div>-->
      <!--</div>-->
      <div class="c-delivery c-delivery--total">
        <h2 class="c-delivery__title c-delivery__title--total">Общая сумма:</h2>
        <span class="c-delivery__price">
                      <span class="c-delivery__price--del">{{priceDiscount}}</span>
                      <span class="c-delivery__price--total">{{price}}</span>
                  </span>
      </div>
      <div class="c-warning" *ngIf="!canOrder">
        Минимальная сумма заказа 1000 рублей для доставки в города России за исключением Москвы, Московской области и
        Санкт-Петербурга.
      </div>
    </section>
    
    <div class="l-info">
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
          [city]="city"
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
        [ngClass]="form.invalid ? 'c-default-button--disabled' : ''"
        [disabled]="(form.invalid && !canOrder)">ОФОРМИТЬ ЗАКАЗ</button>
    </div>
  `
})

export class ConfirmOrderComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() products;
  @Input() price;
  @Input() priceDiscount;
  @Input() canOrder;
  @Input() locations;
  @Input() delivery;
  @Input() priceDelivery;
  @Input() payments;

  @Output() selectedLocation: EventEmitter<any> = new EventEmitter<any>();
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  city;
  // set setCity(val) {
  //   this._city = val;
  // }
  // get city() {
  //   return this._city;
  // }

  sectionLists = [
    {
      title: '1. Регион доставки',
      idSection: 1
    },
    {
      title: '2. Выбор способа доставки, с указанием ее цены',
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

  public ngOnInit(): void {
    // this.form.valueChanges.subscribe(res => {
    //   console.log(res);
    // });

    this.form.controls['listItemThree'].get('bonuses').get('writeOffBonuses').valueChanges.subscribe(res => {
      this.form.controls['listItemThree'].get('bonuses').get('quantity').setValue('');
      this.form.controls['listItemThree'].get('bonuses').get('quantity').updateValueAndValidity();
    });

    this.form.controls['listItemOne'].get('region').valueChanges.subscribe(idRegion => {
      let city = this.locations.filter(el => el.id === idRegion);
      if (city[0].childs) {
        this.city = city[0].childs;
      } else {
        this.city = city;
      }
    });

    this.form.controls['listItemOne'].get('city').valueChanges.subscribe(city => {
      this.selectedLocation.emit(city);
    })

  }

  submitForm() {

  }
}

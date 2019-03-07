import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-section-list',
  template: `    
    <div class="c-info c-info--picked">
      <button 
          class="c-info__button"
          (click)="clickPicked()"
          [ngClass]="picked || validGroup ? 'c-info__button--picked' : ''">
        <span class="c-info__text">{{title}}</span>
      </button>

      <section class="c-info__dropdown" [ngSwitch]="idSection" *ngIf="form">
        <app-section-list-item-one
          *ngSwitchCase="1"
          [form]="form.controls['listItemOne']"
          [locations]="locations"
          [city]="city"
        ></app-section-list-item-one>

        <app-section-list-item-two
          *ngSwitchCase="2"
          [form]="form.controls['listItemTwo']"
          [displayNone]="form.controls['listItemOne'].invalid"
          [delivery]="delivery"
          [priceDelivery]="priceDelivery"
          (pointResultId)="_pointResultId($event)"
          (selectedDeliveryPrice)="_selectedDeliveryPrice($event)"
        ></app-section-list-item-two>

        <app-section-list-item-three
          *ngSwitchCase="3"
          [form]="form.controls['listItemThree']"
          [displayNone]="form.controls['listItemTwo'].invalid"
          [payments]="payments"
          [innerPayment]="innerPayment"
        ></app-section-list-item-three>

        <app-section-list-item-four
          *ngSwitchCase="4"
          [form]="form.controls['listItemFour']"
          [fieldAddress]="fieldAddress"
          [returnReplace]="returnReplace"
          [displayNone]="form.controls['listItemThree'].invalid"
        ></app-section-list-item-four>
      </section>

    </div>
  `
})

export class AppSectionList {
  @Input() form;
  @Input() title;
  @Input() label;
  @Input() idSection;
  @Input() locations;
  @Input() city;
  @Input() delivery;
  @Input() priceDelivery;
  @Input() payments;
  @Input() innerPayment;
  @Input() fieldAddress;
  @Input() returnReplace;

  @Output() pointResultId: EventEmitter<any> = new EventEmitter();
  @Output() selectedDeliveryPrice: EventEmitter<any> = new EventEmitter();

  picked = false;
  validColor = false;

  clickPicked() {
    if (this.picked) {
      return this.picked = false;
    }

    if (!this.picked && this.idSection === 1) {
      return this.picked = true;
    }
    if (!this.picked && this.idSection === 2 && this.form.controls['listItemOne'].valid) {
      return this.picked = true;
    }
    if (!this.picked && this.idSection === 3 && this.form.controls['listItemTwo'].valid) {
      return this.picked = true;
    }
    if (!this.picked && this.idSection === 4 && this.form.controls['listItemThree'].valid) {
      return this.picked = true;
    }
  }


  get validGroup() {
    if (this.idSection === 1) {
      return this.validColor = true;
    }
    if (this.idSection === 2 && this.form.controls['listItemOne'].valid) {
      return this.validColor = true;
    }
    if (this.idSection === 3 && this.form.controls['listItemTwo'].valid) {
      return this.validColor = true;
    }
    if (this.idSection === 4 && this.form.controls['listItemThree'].valid) {
      return this.validColor = true;
    }

    return this.validColor = false;
  }

  _pointResultId(e) {
    this.pointResultId.emit(e);
  }

  _selectedDeliveryPrice(e) {
    this.selectedDeliveryPrice.emit(e);
  }

}

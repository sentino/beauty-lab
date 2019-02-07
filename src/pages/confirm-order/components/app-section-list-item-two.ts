import { Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-section-list-item-two',
  template: `
    <section [formGroup]="form" [className]="displayNone ? 'switchDisplayNone' : ''">
      <ion-list radio-group [formControl]="form.controls['delivery']">
        <ion-item>
          <ion-label>Курьерская доставка</ion-label>
          <ion-radio checked="true" value="0"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Самовывоз</ion-label>
          <ion-radio value="1"></ion-radio>
        </ion-item>
        
        
        <div class="l-radiobutton__info l-radiobutton__info--picked" style="padding: 0" 
             *ngIf="form.controls['delivery'].value == 0">
          <div class="c-delivery">
            <h2 class="c-delivery__title c-delivery__title--thin" style="margin: 0">Стоимость доставки</h2>
            <span class="c-delivery__quantity c-delivery__quantity--thin">300 руб.</span>
          </div>
          <div class="c-delivery">
            <h2 class="c-delivery__title  c-delivery__title--thin" style="margin: 0">Срок доставки</h2>
            <span class="c-delivery__quantity c-delivery__quantity--thin">2 дня</span>
          </div>
        </div>
      </ion-list>
    </section>
  `
})

export class AppSectionListItemTwo {
  @Input() form;
  @Input() displayNone;
  @Input() delivery;
  @Input() priceDelivery;
}

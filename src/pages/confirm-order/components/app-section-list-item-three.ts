import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-section-list-item-three',
  template: `
    <section [formGroup]="form" [className]="displayNone ? 'switchDisplayNone' : ''">
      <ion-list radio-group [formControl]="form.controls['typeOfPayment']" style="margin-bottom: 0;">
        <ion-item>
          <ion-label>Оплата при получении</ion-label>
          <ion-radio checked="true" value="0"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Оплата с помощью payler.com</ion-label>
          <ion-radio value="1"></ion-radio>
        </ion-item>
      </ion-list>
      
      <ion-list [formGroupName]="'bonuses'">
        <ion-item style="display: flex; flex-direction: row-reverse;">
          <ion-checkbox [formControlName]="'writeOffBonuses'" 
                        style="margin-right: 9px"></ion-checkbox>
          <ion-label>Списать часть оплаты бонусами</ion-label>
        </ion-item>

        <ion-item>
          <ion-input [formControlName]="'quantity'" [disabled]="!writeOffBonuses" 
                     type="number" 
                     placeholder="500"></ion-input>
        </ion-item>
        <span class="c-input-field__text">Максимальная оплата бонусами - 500</span>
      </ion-list>
    </section>
  `
})

export class AppSectionListItemThree {
  @Input() form;
  @Input() displayNone;
  @Input() payments;

  get writeOffBonuses() {
    return this.form.get('bonuses').get('writeOffBonuses').value;
  }
}

import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-section-list-item-three',
  template: `
    <section [formGroup]="form" [className]="displayNone ? 'switchDisplayNone' : ''">
      <ion-list radio-group [formControl]="form.controls['typeOfPayment']" style="margin-bottom: 0;">
        <ion-item *ngFor="let item of payments">
          <ion-label>{{item.name}}</ion-label>
          <ion-radio value="{{item.id}}"></ion-radio>
        </ion-item>
      </ion-list>
      
      <ion-list [formGroupName]="'bonuses'" *ngIf="innerPayment && innerPayment.maxSumBonusPay > 0">
        <ion-item style="display: flex; flex-direction: row-reverse;">
          <ion-checkbox [formControlName]="'writeOffBonuses'" 
                        style="margin-right: 9px"></ion-checkbox>
          <ion-label>{{innerPayment.name}}</ion-label>
        </ion-item>

        <ion-item>
          <ion-input [formControlName]="'quantity'" [disabled]="!writeOffBonuses" 
                     type="number" 
                     placeholder="{{innerPayment.sum}}"></ion-input>
        </ion-item>
        <span class="c-input-field__text">Максимальная оплата бонусами - {{innerPayment.maxSumBonusPay}}</span>
      </ion-list>
    </section>
  `
})

export class AppSectionListItemThree {
  @Input() form;
  @Input() displayNone;
  @Input() payments;
  @Input() innerPayment;

  get writeOffBonuses() {
    return this.form.get('bonuses').get('writeOffBonuses').value;
  }
}

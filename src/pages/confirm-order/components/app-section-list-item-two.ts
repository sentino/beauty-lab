import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-section-list-item-two',
  template: `
    <section [formGroup]="form" >
      <ion-list radio-group [formControl]="form.controls['delivery']" [className]="displayNone ? 'switchDisplayNone' : ''">
        <ion-item>
          <ion-label>Курьерская доставка</ion-label>
          <ion-radio checked="true" value="0"></ion-radio>
        </ion-item>

        <ion-item>
          <ion-label>Самовывоз</ion-label>
          <ion-radio value="1"></ion-radio>
        </ion-item>
        
        <p *ngIf="form.controls['delivery'].value == 0">данные о доставке</p>
      </ion-list>
    </section>
  `
})

export class AppSectionListItemTwo {
  @Input() form;
  @Input() displayNone;
}

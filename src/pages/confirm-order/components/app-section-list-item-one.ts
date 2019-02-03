import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-section-list-item-one',
  template: `
    <section [formGroup]="form">
      <ion-item>
        <ion-label>Выбор области</ion-label>
        <ion-select [formControl]="form.controls['region']">
          <ion-option value="1">бла1</ion-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label>Выбор города или населенного пункта</ion-label>
        <ion-select [formControl]="form.controls['city']">
          <ion-option value="2">бла2</ion-option>
        </ion-select>
      </ion-item>
    </section>
  `
})

export class AppSectionListItemOne {
  @Input() form;
}

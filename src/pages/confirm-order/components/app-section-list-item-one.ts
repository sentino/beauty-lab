import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-section-list-item-one',
  template: `
    <section [formGroup]="form">
      <ion-item>
        <ion-label>Выбор области</ion-label>
        <ion-select [formControl]="form.controls['region']">
          <ion-option *ngFor="let item of locations; let i = index" 
                      value="{{item.id}}">{{item.name}}</ion-option>
        </ion-select>
      </ion-item>

      <ion-item *ngIf="_city">
        <ion-label>Выбор города или населенного пункта</ion-label>
        <ion-select [formControl]="form.controls['city']">
          <ion-option *ngFor="let item of _city"
                      value="{{item.code}}">{{item.name}}</ion-option>
        </ion-select>
      </ion-item>
    </section>
  `
})

export class AppSectionListItemOne {
  @Input() form;
  @Input() locations;
  @Input() city;

  get _city() {
    // console.log(this.city);
    // debugger;
    return this.city;
  }

  // cityChange(e) {
  //   console.log('!!!!!!!!!!!!!!!!!!!!!!!', e);
  // }
}

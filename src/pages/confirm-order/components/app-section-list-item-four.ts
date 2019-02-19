import { Component, ElementRef, Input, ViewChild } from '@angular/core';


@Component({
  selector: 'app-section-list-item-four',
  template: `
    <ion-list [formGroup]="form" [className]="displayNone ? 'switchDisplayNone' : ''">
      <ion-item>
        <ion-label color="secondary" floating>ФИО*</ion-label>
        <ion-input [formControl]="form.controls['name']"></ion-input>
      </ion-item>
      
      <ion-item>
        <ion-label color="secondary" floating>E-mail*</ion-label>
        <ion-input [formControl]="form.controls['email']"></ion-input>
      </ion-item>
      
      <ion-item>
        <ion-label color="secondary" floating>Мобильный телефон</ion-label>
        <ion-input [formControl]="form.controls['phone']"></ion-input>
      </ion-item>
      
      <ion-item *ngIf="_fieldAddress">
        <ion-label color="secondary" floating>Адрес*</ion-label>
        <ion-input [formControl]="form.controls['address']"></ion-input>
      </ion-item> 
      
      <ion-item>
        <ion-label color="secondary" floating>Комментарий к заказу</ion-label>
        <ion-textarea 
          [formControl]="form.controls['comment']"
          rows="1"
          style="
              width: calc(100% - 10px);
              border: 0;
              border-radius: 0;
              background: transparent;"
          #myTextArea
          id="myTextArea"
          (keyup)="resize()"
        ></ion-textarea>
      </ion-item>
    </ion-list>
  `
})

export class AppSectionListItemFour {
  @Input() form;
  @Input() displayNone;
  @Input() fieldAddress;

  @ViewChild('myTextArea') myTextArea: ElementRef;

  get _fieldAddress() {
    return this.fieldAddress;
  }

  resize() {
    let element = this.myTextArea['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    let scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.myTextArea['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }
}

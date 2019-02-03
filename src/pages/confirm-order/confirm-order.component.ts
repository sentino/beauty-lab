import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-confirm-order-component',
  template: `
    <h3>"какая-то инфа о заказе"</h3>
    
    <section *ngFor="let item of sectionLists">
      <app-section-list
        *ngIf="form"
        [form]="form"
        [title]="item.title"
        [idSection]="item.idSection"
        (openSection)="openSection($event)"
      ></app-section-list>
    </section>
  `
})

export class ConfirmOrderComponent implements OnInit {
  @Input() form: FormGroup;

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
    this.form.valueChanges.subscribe(res => {
      console.log(res);
      debugger;
    });

    // this.form.controls['listItemOne'].get('region').valueChanges.subscribe(res => {
    //   console.log(res);
    //   debugger;
    // })
  }

  openSection(idSection) {

  }
}

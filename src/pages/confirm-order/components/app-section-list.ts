import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-section-list',
  template: `
    <section>
      <ion-list>
        <ion-list-header (click)="openSection.emit(idSection)">
          {{title}}
        </ion-list-header>

        <section [ngSwitch]="idSection" *ngIf="form">
          <app-section-list-item-one
            [form]="form.controls['listItemOne']"
            *ngSwitchCase="1"
          ></app-section-list-item-one>
          
          <app-section-list-item-two
            *ngSwitchCase="2"
            [form]="form.controls['listItemTwo']"
            [displayNone]="form.controls['listItemOne'].invalid"
          ></app-section-list-item-two>
          
          <app-section-list-item-three
            *ngSwitchCase="3"
          ></app-section-list-item-three>
          
          <app-section-list-item-four
            *ngSwitchCase="4"
          ></app-section-list-item-four>
        </section>
        
      </ion-list>
    </section>
  `
})

export class AppSectionList {
  @Input() form;
  @Input() title;
  @Input() label;
  @Input() idSection;

  @Output() openSection: EventEmitter<any> = new EventEmitter<any>();
}

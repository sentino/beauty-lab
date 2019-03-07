import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'substances-component',
  template: `    
    <main style="margin-top: 27px; padding-left: 25px; padding-right: 16px;">
      <h6 text-center *ngIf="!result.length">По вашему запросу ничего не найдено</h6>
      <div class="l-filted-list" *ngIf="result.length">

        <div class="c-param c-param--vertical" *ngFor="let item of result">
          <h2 class="c-param__title c-param__title--vertical" style="margin-top: 0">{{item.category}}</h2>
          <div class="l-param__items l-param__items--vertical">
            <span class="c-param__text c-param__text--vertical" *ngFor="let subItem of item.brandItems"
                  (click)="brand(subItem.id)">{{subItem.name}}</span>
          </div>
        </div>

      </div>
    </main>
  `
})

export class SubstancesComponent {
  @Input() result;

  @Output() goToBrand: EventEmitter<any> = new EventEmitter<any>();

  brand(id) {
    this.goToBrand.emit(id);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'brands-component',
  template: `
    <section [ngSwitch]="classList">
      <main style="margin-top: 27px; padding-left: 25px; padding-right: 16px;" *ngSwitchCase="false">
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


      <main style="margin-top: 67px; padding-left: 20px; padding-right: 11px;" *ngSwitchCase="true">
        <h6 text-center *ngIf="!result.length">По вашему запросу ничего не найдено</h6>
        <div class="l-filted-list" *ngIf="result.length">

          <div class="c-param" *ngFor="let item of result">
            <h2 class="c-param__title">{{item.category}}</h2>
            <div class="l-param__items" style="justify-content: start;">
              <div class="c-param__item"
                   style="margin-left: 5px; margin-right: 5px; margin-bottom: 30px;"
                   *ngFor="let subItem of item.brandItems"
                   (click)="brand(subItem.id)">
                <div class="box-images">
                  <img style="max-height: 63px" [src]="subItem.image" alt="goods" class="c-param__img">
                </div>
                <span class="c-param__text">{{subItem.name}}</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </section>
  `
})

export class BrandsComponent {
  @Input() result;
  @Input() classList;

  @Output() goToBrand: EventEmitter<any> = new EventEmitter<any>();

  brand(id) {
    this.goToBrand.emit(id);
  }
}

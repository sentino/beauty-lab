import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'articles-promotions-page-component',
  template: `
    <main>
      <section class="l-promotion">
        <div class="c-banner">
          <h2 class="c-banner__title">{{name}}</h2>
        </div>
        
        <div class="c-share">
          <h2 class="c-share__title">Поделиться в соц-сетях:</h2>
          <button class="c-share__button" (click)="share.emit()"></button>
        </div>
        <div class="c-message box-href" style="padding-top: 10px" *ngIf="desc" [innerHTML]="desc | sanitizeHtml" [href]></div>
      </section>
      
      <section class="c-section c-section--recommended c-section--no-space"
               style="margin-right: 16px"
               *ngIf="products && products.length">
        <h2 class="c-section__title" *ngIf="type === 'articles'">Товары по теме статьи</h2>
        <h2 class="c-section__title" *ngIf="type === 'promotions'">Акционные товары</h2>
        <div class="l-goods l-goods--nowrap" style="flex-flow: wrap; margin-top: 15px">
          <app-product-cart *ngFor="let item of products"
                            [type]="'lg'"
                            [cart]="item"
                            style="margin: auto"
          ></app-product-cart>
        </div>
      </section>
    </main>
  `
})

export class ArticlesPromotionsPageComponent {
  @Input() type;
  @Input() name;
  @Input() desc;
  @Input() products;

  @Output() share: EventEmitter<any> = new EventEmitter<any>();
}

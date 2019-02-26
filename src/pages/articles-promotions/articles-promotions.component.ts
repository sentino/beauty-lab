import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'articles-promotions-component',
  template: `
    <main style="padding-left: 22px;
                  padding-right: 16px;
                  margin-top: 22px;">
      <div class="l-articles">
        <article class="c-article" *ngFor="let item of items" (click)="goToPage.emit(item.ID)">
          <img [src]="item.IMAGE" alt="img" class="c-article__image">
          <h2 class="c-article__title">
            {{(item.NAME.length > 55) ? (item.NAME | slice:0:55)+'...' : (item.NAME)}}
          </h2>
          <span class="c-article__date">{{item.DATE}}</span>
        </article>
      </div>
    </main>
  `
})

export class ArticlesPromotionsComponent {
  @Input() items;

  @Output() goToPage: EventEmitter<any> = new EventEmitter<any>();
}

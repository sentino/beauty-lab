import { Component, Input } from '@angular/core';


@Component({
  selector: 'medicines-substances-page-component',
  template: `
    
    <section 
      class="c-section box-href" 
      *ngIf="type === 'medicines' && desc"
      [innerHTML]="desc | sanitizeHtml" [href]
    ></section>


    <section class="c-section" *ngIf="type === 'substances'">
      <h2 class="c-section__title">Инструкция по применению {{name}}</h2>

      <div class="l-info">
        <div [ngClass]="item.open ? 'c-info c-info--picked' : 'c-info'"
             *ngFor="let item of desc; let i = index;">
          <section *ngIf="item.text.length">
            <button (click)="item.open = !item.open"
                    [ngClass]="item.open ?
                     'c-info__button c-info__button--small c-info__button--stable-picked' :
                      'c-info__button c-info__button--small'">
              <span class="c-info__text">{{item.name}}</span>
            </button>
            <div class="c-info__dropdown c-info__dropdown--without-spaces">
              <article class="c-article">
                {{item.text}}
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>
  `
})

export class MedicinesSubstancesPageComponent {
  @Input() type;
  @Input() name;
  @Input() desc;
}

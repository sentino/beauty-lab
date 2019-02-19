import { Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-presents',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  template: `    
    <div class="c-gift" [@animate] style="margin-top: 22px; margin-bottom: 10px;">
      <h2 class="c-gift__title" *ngIf="presents.length">Ваши подарки</h2>
      <div class="c-good c-good--gift" *ngFor="let product of presents">
        <img [src]="product.image" alt="vichy-cream" class="c-good__image">
        <div class="l-good__info" 
             style="display: flex;
                    flex-wrap: wrap;">
          <h2 class="c-good__title">
            {{product.name}}
          </h2>
          <div class="l-good__row l-good__row--large-margin" 
               style="margin-bottom: 0;
                      width: 100%;
                      align-self: flex-end;">
            <div class="c-quantity">
              <span class="c-quantity__text">кол-во</span>
              <button class="c-quantity__button c-quantity__button--remove" disabled></button>
              <div class="c-quantity__number">{{product.quantity}}</div>
              <button class="c-quantity__button c-quantity__button--add" disabled></button>
            </div>
            <div class="l-good__price">
              <span class="c-good__price c-good__price--total">0 
                  <span class="c-good__currency c-good__currency--large">&#8381;</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class AppPresents {
  @Input() presents
}

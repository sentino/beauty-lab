import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'consultation-cart',
  template: `
    <div class="c-consultant">
      <img [src]="specialist.IMAGE" alt="img" class="c-consultant__image">
      <div class="l-consultant__info">
        <div class="l-consultant__row">
          <h2 class="c-consultant__name">{{specialist.NAME}}</h2>
        </div>
        <div class="l-consultant__row l-consultant__row--large-margin">
          <div class="c-consultant__position">{{specialist.SPECIAL}}</div>
        </div>
        <div class="l-consultant__row">
          <a class="c-consultant__page-link" (click)="goToPageSpecialist.emit(specialist.ID)">Страница специалиста</a>
        </div>
        <button class="c-primary-button c-primary-button--narrow" (click)="modal.emit(specialist.ID)">ЗАДАТЬ ВОПРОС</button>
      </div>
    </div>
  `
})

export class ConsultationCart {
  @Input() specialist;

  @Output() goToPageSpecialist: EventEmitter<any> = new EventEmitter<any>();
  @Output() modal: EventEmitter<any> = new EventEmitter<any>();
}

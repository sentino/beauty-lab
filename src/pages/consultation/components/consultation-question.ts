import { Component, Input } from '@angular/core';

@Component({
  selector: 'consultation-question',
  template: `
    <div class="l-consultation">
      <div class="c-question">
        <h3 class="c-question__name">{{question.NAME}}</h3>
        <div class="c-question__date">{{question.DATE}}</div>
        <p class="c-question__text" [innerHTML]="question.QUESTION | sanitizeHtml" [href]></p>
        <div class="c-answer" *ngIf="question.SPECIALIST.NAME">
          <div class="c-answer__icon" *ngIf="!question.SPECIALIST.IMAGE"></div>
          <img class="c-answer__icon" *ngIf="question.SPECIALIST.IMAGE" [src]="question.SPECIALIST.IMAGE" style="object-fit: cover;">
          <div class="l-answer__info">
            <h3 class="c-answer__name">{{question.SPECIALIST.NAME}}</h3>
            <div class="c-answer__position">{{question.SPECIALIST.SPECIAL}}</div>
            <div class="c-answer__date">{{question.ANSWER_DATE}}</div>
            <p class="c-answer__text" [innerHTML]="question.ANSWER | sanitizeHtml" [href]></p>
          </div>
        </div>
      </div>
    </div>
  `
})

export class ConsultationQuestion {
  @Input() question;
}

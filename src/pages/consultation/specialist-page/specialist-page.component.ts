import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'specialist-page-component',
  template: `
    <main>
      <section class="c-consultant">
        <img [src]="specialist.image" alt="#" class="c-consultant__image">
        <h2 class="c-consultant__name">{{specialist.name}}</h2>
        <div class="c-info">
          <div class="c-info__article">
            <span class="c-position">{{specialist.special}}</span>
          </div>
          <div class="c-info__article">
            <span class="c-experience">Стаж работы:</span>
            <span class="c-experience__value">{{specialist.stage}}</span>
          </div>
          <div class="c-info__article">
            <span class="c-education">Образование:</span>
            <span class="c-education__value">{{specialist.edu}}</span>
          </div>
          <div class="c-info__article">
            <span class="c-upgrading">Повышение квалификации:</span>
            <span class="c-upgrading__value">{{specialist.edu_up}}</span>
          </div>
        </div>
        <div class="c-personal-info" *ngIf="specialist.about">
          <h3 class="c-personal-info__title">О себе:</h3>
          <p class="c-personal-info__text">
            {{specialist.about}}
          </p>
        </div>
        <div class="c-personal-info" *ngIf="specialist.diploms">
          <img
            *ngFor="let item of specialist.diploms"
            [src]="item"
            alt="#"
            style="width: 141px; height: 200px;"
            class="c-consultant__image">
        </div>
        <button class="c-primary-button c-primary-button--narrow" (click)="openModal.emit()">ЗАДАТЬ ВОПРОС</button>
        <div class="c-share">
          <h2 class="c-share__title">Поделиться в соц-сетях:</h2>
          <button class="c-share__button" (click)="share.emit()"></button>
        </div>
      </section>
    </main>
  `
})

export class SpecialistPageComponent {
  @Input() specialist;

  @Output() openModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() share: EventEmitter<any> = new EventEmitter<any>();
}

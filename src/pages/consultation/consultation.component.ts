import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';

@Component({
  selector: 'consultation-component',
  template: `
    <main>
      <div class="c-proclaiming">
        <h2 class="c-proclaiming__text">
          На этой странице вы можете
          <span class="c-proclaiming__text--bold">задать вопрос специалисту</span>
          и получить консультацию по вашей проблеме!
          <span class="c-proclaiming__text--bold">Внимание!</span>
          Срок ответа может занять до 3-х рабочих дней!
        </h2>
      </div>
      
      <div class="l-consultants">
        <consultation-cart
          *ngFor="let item of specialists"
          [specialist]="item"
          (goToPageSpecialist)="goToPageSpecialist.emit($event)"
          (modal)="modal.emit($event)"
          style="margin-bottom: 16px;"
        ></consultation-cart>
      </div>
      
      <section class="c-consultations">
        <h2 class="c-consultations__title">Ответы специалистов</h2>
        <consultation-question
          *ngFor="let item of questions"
          [question]="item"
        ></consultation-question>

        <ion-infinite-scroll #infinite (ionInfinite)="doInfinite($event)">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </section>
    </main>
  `
})

export class ConsultationComponent implements OnInit, OnDestroy {
  @Input() specialists;
  @Input() questions;
  @Input() questionsNavigation;

  @Output() loadMoreQuestions: EventEmitter<any> = new EventEmitter<any>();
  @Output() goToPageSpecialist: EventEmitter<any> = new EventEmitter<any>();
  @Output() modal: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;
  counter = 0;

  public ngOnInit(): void {
    if (this.questionsNavigation.pageAll === 1 ||
      this.questionsNavigation.pageAll === this.questionsNavigation.pageCurrent) {
      this.infinite.enable(false);
    } else {
      this.infinite.threshold = '200px';
      this.infinite.enable(true);
    }
  }

  doInfinite(infiniteScroll) {
    if (this.counter === 0 &&
      this.questionsNavigation.pageAll > 1 &&
      this.questionsNavigation.pageAll !== this.questionsNavigation.pageCurrent) {
      // console.log('Begin async operation');
      this.loadMoreQuestions.emit();
      this.counter = 1;
      setTimeout(() => {
        this.counter = 0;
        infiniteScroll.complete();
      }, 2000)
    }

    if (this.questionsNavigation.pageAll === 1 ||
      this.questionsNavigation.pageAll === this.questionsNavigation.pageCurrent) {
      this.infinite.enable(false);
    }
  }

  public ngOnDestroy(): void {
    if (this.infinite) {
      this.infinite.complete();
      this.infinite.enable(false);
    }
  }
}

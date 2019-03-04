import { Unsubscriber } from '../../helpers/unsubscriber';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { NavController } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { ConsultationService } from '../../services/consultation.service';
import { debounceTime } from 'rxjs/operators';
import { SpecialistPageContainer } from './specialist-page/specialist-page-container';
import { LoadingProvider } from '../../services/loading/loading';

@Component({
  selector: 'consultation-container',
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          Вопросы специалистам
        </ion-title>

        <ion-buttons end>
          <!--<button ion-button icon-only (click)="openSearch()">-->
          <!--<ion-icon name="search"></ion-icon>-->
          <!--</button>-->
          <button ion-button icon-only class="cart-button" (click)="openCart()">
            <ion-icon name="cart">
              <ion-badge color="secondary">{{(productsLength$ | async) ? (productsLength$ | async) : 0}}</ion-badge>
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>


      <!--<ion-toolbar class="toolbar-secondary">-->
      <!--<form  class="search-form" (ngSubmit)="getSearch()" *ngIf="SearchList" [@animate]>-->
      <!--<ion-item>-->
      <!--<ion-icon name="search"></ion-icon>-->
      <!--<ion-input [(ngModel)]="search.search_string" name="search" placeholder="Поиск..." type="text"></ion-input>-->
      <!--</ion-item>-->
      <!--<ion-icon class="close-icon" name="close" (click)="showHideSearchList()"></ion-icon>-->
      <!--</form>-->
      <!--</ion-toolbar>-->
    </ion-header>

    <ion-content>
      <consultation-component
        *ngIf="specialists && specialists.length"
        [specialists]="specialists"
        [questions]="questions"
        [questionsNavigation]="questionsNavigation"
        (loadMoreQuestions)="loadMoreQuestions()"
        (goToPageSpecialist)="goToPageSpecialist($event)"
        (modal)="openModal($event)"
      ></consultation-component>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>

    <consultation-modal
      *ngIf="modal"
      [addQuestionFields]="addQuestionFields"
      [specialistId]="specialistId"
      (close)="openModal()"
    ></consultation-modal>
  `,
  providers: [ConsultationService]
})

export class ConsultationContainer extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  specialists;
  questions;
  questionsNavigation;
  modal = false;
  specialistId;
  addQuestionFields;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private consultationService: ConsultationService,
    private loading: LoadingProvider,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loading.showSpinner();
    this.wrapToUnsubscribe(this.consultationService.getSpecList(1)).subscribe(res => {
      this.specialists = res.result.specialists;
      this.questionsNavigation = res.result.questions.navigation;
      this.questions = res.result.questions.items;
      this.addQuestionFields = res.result.addQuestionFields;
      this.loading.hideSpinner();
    })
  }

  loadMoreQuestions() {
    this.wrapToUnsubscribe(this.consultationService.getSpecList(this.questionsNavigation.pageCurrent + 1))
      .pipe(
        debounceTime(300)
      )
      .subscribe((res: any) => {
        for (let i = 0; i < res.result.questions.items.length; i++) {
          this.questions.push(res.result.questions.items[i]);
        }
        this.questionsNavigation = res.result.questions.navigation;
      })
  }

  goToPageSpecialist(id) {
    this.navCtrl.push(SpecialistPageContainer, { id: id})
  }

  openModal(id) {
    this.specialistId = id;
    this.modal = !this.modal;
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

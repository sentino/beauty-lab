import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscriber } from '../../../helpers/unsubscriber';
import { selectCartProductsLength } from '../../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ConsultationService } from '../../../services/consultation.service';
import { CartContainer } from '../../cart/cart-container';
import { SearchPage } from '../../search/search';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LoadingProvider } from '../../../services/loading/loading';
import { SearchService } from '../../../services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AnalyticsService } from '../../../services/analytics.service';
import { AppVersion } from '@ionic-native/app-version/ngx';


@Component({
  selector: 'specialist-page',
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
    <ion-header>
      <ion-navbar [style.boxShadow]="searchList ? 'none' : ''">
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          Вопрос специалисту
        </ion-title>

        <ion-buttons end>
          <button ion-button icon-only (click)="searchList = !searchList">
            <ion-icon name="search"></ion-icon>
          </button>
          <button ion-button icon-only class="cart-button" (click)="openCart()">
            <ion-icon name="cart">
              <ion-badge color="secondary">{{(productsLength$ | async) ? (productsLength$ | async) : 0}}</ion-badge>
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>


      <form  class="search-form" (ngSubmit)="getSearch(search.value)" *ngIf="searchList" [@animate]>
        <ion-item>
          <ion-icon name="search"></ion-icon>
          <ion-input #search name="search" placeholder="Поиск..." type="text"></ion-input>
        </ion-item>
        <ion-icon class="close-icon" name="close" (click)="searchList = !searchList"></ion-icon>
      </form>
    </ion-header>

    <ion-content>
      <specialist-page-component
        *ngIf="specialist"
        [specialist]="specialist"
        (openModal)="openModal()"
        (share)="share()"
      ></specialist-page-component>
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

export class SpecialistPageContainer extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  modal = false;
  specialist;
  specialistId;
  addQuestionFields;

  searchList = false;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private consultationService: ConsultationService,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private loading: LoadingProvider,
    private searchService: SearchService,
    private ga: AnalyticsService,
    private plt: Platform,
    private appVersion: AppVersion,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loading.showSpinner();
    this.specialistId = this.navParams.get('id');

    this.ga.trackPage('specialistPage-' + this.specialistId);

    this.wrapToUnsubscribe(this.consultationService.getSpecialist(this.specialistId)).subscribe(res => {
      this.specialist = res.result;
      this.loading.hideSpinner();
    });

    this.wrapToUnsubscribe(this.consultationService.getSpecList(1)).subscribe(res => {
      this.addQuestionFields = res.result.addQuestionFields;
    })
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
  }

  share() {
    if (this.plt.is('ios')) {
      this.socialSharing.share(
        'Задай вопрос профильным специалистам фармацевтам и косметологам',
        'Beauty Lab',
        '',
        ''
      )
        .then(() => {})
        .catch(() => {});
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          'Задай вопрос профильным специалистам фармацевтам и косметологам',
          'Beauty Lab',
          '',
          "https://play.google.com/store/apps/details?id=" + val
        )
          .then(() => {})
          .catch(() => {});
      });
    }
  }

  openModal() {
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

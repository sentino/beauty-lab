import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscriber } from '../../../helpers/unsubscriber';
import { selectCartProductsLength } from '../../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { ConsultationService } from '../../../services/consultation.service';
import { CartContainer } from '../../cart/cart-container';
import { SearchPage } from '../../search/search';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'specialist-page',
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          Вопрос специалисту
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
      <specialist-page-component
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
  specialistId;
  addQuestionFields;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private consultationService: ConsultationService,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.specialistId = this.navParams.get('id');

    this.wrapToUnsubscribe(this.consultationService.getSpecList(1)).subscribe(res => {
      this.addQuestionFields = res.result.addQuestionFields;
    })
  }

  share() {
    // this.socialSharing.share(
      // this.name,
      // this.name,
      // this.image,
      // this.url).then(() => {
      // Success!
    // }).catch(() => {
      // Error!
    // });
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

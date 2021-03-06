import { Component, OnDestroy, OnInit } from '@angular/core';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { SubstancesService } from '../../services/substances.service';
import { MedicinesService } from '../../services/medicines.service';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { LoadingProvider } from '../../services/loading/loading';
import { SearchService } from '../../services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AnalyticsService } from '../../services/analytics.service';


@Component({
  selector: 'medicines-substances-page-container',
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
          {{name}}
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
      <main style="padding: 0 16px; padding-left: 22px; margin-top: 22px;">
        <div class="l-goods" style="display: flex; flex-flow: wrap;">
          <app-product-cart *ngFor="let item of products"
                            [type]="'lg'"
                            [cart]="item"
                            style="margin: auto;"
          ></app-product-cart>
        </div>
        
        <medicines-substances-page-component
          *ngIf="name"
          [name]="name"
          [desc]="desc"
          [type]="type"
        ></medicines-substances-page-component>

        <section class="c-section c-section--recommended c-section--no-space"
                 style="margin-left: -5px"
                 *ngIf="analogs && analogs.length">
          <h2 style="padding-left: 5px; margin-top: 22px;" class="c-section__title">Аналоги</h2>
          <div class="l-goods l-goods--nowrap" style="flex-direction: row; padding-left: 5px;">
            <app-product-cart *ngFor="let item of analogs"
                              [type]="'md'"
                              [cart]="item"
            ></app-product-cart>
          </div>
        </section>
      </main>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [MedicinesService, SubstancesService]
})

export class MedicinesSubstancesPageContainer extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  id;
  type;

  name;
  desc;
  products;
  analogs;

  searchList = false;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private medicinesService: MedicinesService,
    private substancesService: SubstancesService,
    private loading: LoadingProvider,
    private searchService: SearchService,
    private ga: AnalyticsService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loading.showSpinner();
    this.id = this.navParams.get('id');
    this.type = this.navParams.get('type');

    this.initializeData(this.id, this.type);
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
  }

  initializeData(id, type) {
    if (type === 'medicines') {
      this.ga.trackPage('medicinePage');
      this.wrapToUnsubscribe(this.medicinesService.getMedicinesById(id)).subscribe( res => {
        this.name = res.result.name;
        this.desc = res.result.desc;
        this.products = res.result.products;
        this.analogs = res.result.analogs;
        this.loading.hideSpinner();
      })
    } else if (type === 'substances') {
      this.ga.trackPage('substancePage');
      this.wrapToUnsubscribe(this.substancesService.getSubstancesById(id)).subscribe(res => {
        this.name = res.result.name;

        let arr = [];
        for (let i = 0; i < res.result.desc.length; i++) {
          arr.push({
            name: res.result.desc[i].name,
            text: res.result.desc[i].text,
            open: false
          });
        }
        this.desc = arr;

        this.products = res.result.products;
        this.analogs = res.result.analogs;
        this.loading.hideSpinner();
      })
    }
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

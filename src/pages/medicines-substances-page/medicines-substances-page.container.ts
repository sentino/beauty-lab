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


@Component({
  selector: 'medicines-substances-page-container',
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          {{name}}
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

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private medicinesService: MedicinesService,
    private substancesService: SubstancesService,
    private loading: LoadingProvider,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loading.showSpinner();
    this.id = this.navParams.get('id');
    this.type = this.navParams.get('type');

    this.initializeData(this.id, this.type);
  }

  initializeData(id, type) {
    if (type === 'medicines') {
      this.wrapToUnsubscribe(this.medicinesService.getMedicinesById(id)).subscribe( res => {
        this.name = res.result.name;
        this.desc = res.result.desc;
        this.products = res.result.products;
        this.analogs = res.result.analogs;
        this.loading.hideSpinner();
      })
    } else if (type === 'substances') {
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

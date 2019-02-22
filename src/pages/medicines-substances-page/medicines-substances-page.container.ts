import { Component, OnInit } from '@angular/core';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { SubstancesService } from '../../services/substances.service';
import { MedicinesService } from '../../services/medicines.service';


@Component({
  selector: 'medicines-substances-page-container',
  template: `
    <ion-header>
      <ion-navbar style="box-shadow: none;">
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
      <main style="padding: 0 16px; padding-left: 22px;">
        <div class="l-goods">
          <div class="c-good c-good--without-discount">
            <div class="c-good__label c-good__label--hit">ХИТ</div>
            <div class="c-good__label c-good__label--new">NEW</div>
            <div class="c-good__label c-good__label--min-price">MIN</div>
            <div class="c-good__label c-good__label--discount">10%</div>
            <div class="c-good__picked c-good__picked--hidden">
              <span class="c-good__checked-circle"></span>
            </div>
            <img src="./images/pills.jpg" alt="pills" class="c-good__image">
            <div class="l-good__info">
              <h2 class="c-good__title">
                Дексаметазон таблетки 0,5мг N56
              </h2>
              <div class="l-good__row l-good__row--little-margin">
                <span class="c-good__price c-good__price--del c-good__price--hidden">183 &#8381;</span>
                <span class="c-good__country">Poccия</span>
              </div>
              <div class="l-good__row l-good__row--little-margin">
                <span class="c-good__price">1 783 &#8381;</span>
                <button class="c-good__favorite"></button>
              </div>
              <button class="c-primary-button c-primary-button--narrow">КУПИТЬ</button>
            </div>
          </div>
        </div>

        <section class="c-section">
          <h2 class="c-section__title">Инструкция по применению Дексаметазон</h2>
          <div class="l-info">
            <medicines-substances-page-component
            ></medicines-substances-page-component>
          </div>
        </section>

        <section class="c-section c-section--recommended c-section--no-space" style="margin-left: -5px">
          <h2 style="padding-left: 5px;" class="c-section__title">Рекомендуемые товары</h2>
          <div class="l-goods l-goods--nowrap" style="flex-direction: row; padding-left: 5px;">
            <app-product-cart *ngFor="let item of products"
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

export class MedicinesSubstancesPageContainer implements OnInit{
  productsLength$ = this.store.select(selectCartProductsLength);

  id;
  type;

  name;
  products;
  analogs;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private medicinesService: MedicinesService,
    private substancesService: SubstancesService
  ) { }

  public ngOnInit(): void {
    this.id = this.navParams.get('id');
    this.type = this.navParams.get('type');

    this.initializeData(this.id, this.type);
  }

  initializeData(id, type) {
    if (type === 'medicines') {
      this.medicinesService.getMedicinesById(id).subscribe( res => {
        console.log(res);
        // debugger;
        this.name = res.result.name;
        this.products = res.result.products;
        this.analogs = res.result.analogs;
      })
    } else if (type === 'substances') {
      this.substancesService.getSubstancesById(id).subscribe(res => {
        console.log(res);
        // debugger;
        this.name = res.result.name;
        this.products = res.result.products;
        this.analogs = res.result.analogs;
      })
    }
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}

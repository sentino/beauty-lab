import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { Store } from '@ngrx/store';
import { Content, NavController } from 'ionic-angular';
import { selectCartProductsLength } from '../../app/store';
import { MedicinesService } from '../../services/medicines.service';
import { MedicinesSubstancesPageContainer } from '../medicines-substances-page/medicines-substances-page.container';
import { Unsubscriber } from '../../helpers/unsubscriber';


@Component({
  selector: 'medicines-container',
  template: `
    <ion-header>
      <ion-navbar style="box-shadow: none;">
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        
        <ion-title>
          Все лекарства
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

    <div class="c-filter" style="top: 56px;">
      <div class="l-filter__row" style="padding-left: 25px;">
        <div class="l-filter__buttons">
          <button class="c-filter__button" (click)="switcherFilter('А-Я')">А-Я</button>
          <button class="c-filter__button" (click)="switcherFilter('A-Z')">A-Z</button>
          <button class="c-filter__button" (click)="switcherFilter('0-9')">0-9</button>
        </div>
        <div class="c-mode">
          <button class="c-mode__button c-mode__button--list"></button>
        </div>
      </div>

      <section
        [style.display]="rusFilters ? 'block' : 'none'"
        style="background-color: rgba(50,50,50,0.50); height: 100vh; width: 100%; top: 42px; position: absolute;"
        (click)="closeFilter()"></section>
      <div [ngClass]="rusFilters ? 'l-filter__row l-filter__row--active' : 'l-filter__row l-filter__row--unactive'">
        <div class="c-filter__dropdown" style="padding-right: 16px;
                                              padding-left: 30px;">
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('А')">А</span>
            <span class="c-filter__item--modal" (click)="filterParams('Б')">Б</span>
            <span class="c-filter__item--modal" (click)="filterParams('В')">В</span>
            <span class="c-filter__item--modal" (click)="filterParams('Г')">Г</span>
            <span class="c-filter__item--modal" (click)="filterParams('Д')">Д</span>
            <span class="c-filter__item--modal" (click)="filterParams('Е')">Е</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ж')">Ж</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('З')">З</span>
            <span class="c-filter__item--modal" (click)="filterParams('И')">И</span>
            <span class="c-filter__item--modal" (click)="filterParams('К')">К</span>
            <span class="c-filter__item--modal" (click)="filterParams('Л')">Л</span>
            <span class="c-filter__item--modal" (click)="filterParams('М')">М</span>
            <span class="c-filter__item--modal" (click)="filterParams('Н')">Н</span>
            <span class="c-filter__item--modal" (click)="filterParams('О')">О</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('П')">П</span>
            <span class="c-filter__item--modal" (click)="filterParams('Р')">Р</span>
            <span class="c-filter__item--modal" (click)="filterParams('С')">С</span>
            <span class="c-filter__item--modal" (click)="filterParams('Т')">Т</span>
            <span class="c-filter__item--modal" (click)="filterParams('У')">У</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ф')">Ф</span>
            <span class="c-filter__item--modal" (click)="filterParams('Х')">Х</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('Ц')">Ц</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ч')">Ч</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ш')">Ш</span>
            <span class="c-filter__item--modal" (click)="filterParams('Щ')">Щ</span>
            <span class="c-filter__item--modal" (click)="filterParams('Э')">Э</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ю')">Ю</span>
            <span class="c-filter__item--modal" (click)="filterParams('Я')">Я</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('Показать все')">Показать все</span>
          </div>
        </div>
      </div>


      <section
        [style.display]="engFilters ? 'block' : 'none'"
        style="background-color: rgba(50,50,50,0.50); height: 100vh; width: 100%; top: 42px; position: absolute;"
        (click)="closeFilter()"></section>
      <div [ngClass]="engFilters ? 'l-filter__row l-filter__row--active' : 'l-filter__row l-filter__row--unactive'">
        <div class="c-filter__dropdown" style="padding-right: 16px;
                                              padding-left: 30px;">
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('A')">A</span>
            <span class="c-filter__item--modal" (click)="filterParams('B')">B</span>
            <span class="c-filter__item--modal" (click)="filterParams('C')">C</span>
            <span class="c-filter__item--modal" (click)="filterParams('D')">D</span>
            <span class="c-filter__item--modal" (click)="filterParams('E')">E</span>
            <span class="c-filter__item--modal" (click)="filterParams('F')">F</span>
            <span class="c-filter__item--modal" (click)="filterParams('G')">G</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('H')">H</span>
            <span class="c-filter__item--modal" (click)="filterParams('I')">I</span>
            <span class="c-filter__item--modal" (click)="filterParams('J')">J</span>
            <span class="c-filter__item--modal" (click)="filterParams('K')">K</span>
            <span class="c-filter__item--modal" (click)="filterParams('L')">L</span>
            <span class="c-filter__item--modal" (click)="filterParams('M')">M</span>
            <span class="c-filter__item--modal" (click)="filterParams('N')">N</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('O')">O</span>
            <span class="c-filter__item--modal" (click)="filterParams('P')">P</span>
            <span class="c-filter__item--modal" (click)="filterParams('Q')">Q</span>
            <span class="c-filter__item--modal" (click)="filterParams('R')">R</span>
            <span class="c-filter__item--modal" (click)="filterParams('S')">S</span>
            <span class="c-filter__item--modal" (click)="filterParams('T')">T</span>
            <span class="c-filter__item--modal" (click)="filterParams('U')">U</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('V')">V</span>
            <span class="c-filter__item--modal" (click)="filterParams('W')">W</span>
            <span class="c-filter__item--modal" (click)="filterParams('X')">X</span>
            <span class="c-filter__item--modal" (click)="filterParams('Y')">Y</span>
            <span class="c-filter__item--modal" (click)="filterParams('Z')">Z</span>
            <span class="c-filter__item--modal">&nbsp;</span>
            <span class="c-filter__item--modal">&nbsp;</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('Показать все')">Показать все</span>
          </div>
        </div>
      </div>


      <section
        [style.display]="numbFilters ? 'block' : 'none'"
        style="background-color: rgba(50,50,50,0.50); height: 100vh; width: 100%; top: 42px; position: absolute;"
        (click)="closeFilter()"></section>
      <div [ngClass]="numbFilters ? 'l-filter__row l-filter__row--active' : 'l-filter__row l-filter__row--unactive'">
        <div class="c-filter__dropdown" style="padding-right: 16px;
                                              padding-left: 30px;">
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('0')">0</span>
            <span class="c-filter__item--modal" (click)="filterParams('1')">1</span>
            <span class="c-filter__item--modal" (click)="filterParams('2')">2</span>
            <span class="c-filter__item--modal" (click)="filterParams('3')">3</span>
            <span class="c-filter__item--modal" (click)="filterParams('4')">4</span>
            <span class="c-filter__item--modal" (click)="filterParams('5')">5</span>
            <span class="c-filter__item--modal" (click)="filterParams('6')">6</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('7')">7</span>
            <span class="c-filter__item--modal" (click)="filterParams('8')">8</span>
            <span class="c-filter__item--modal" (click)="filterParams('9')">9</span>
            <span class="c-filter__item--modal">&nbsp;</span>
            <span class="c-filter__item--modal">&nbsp;</span>
            <span class="c-filter__item--modal">&nbsp;</span>
            <span class="c-filter__item--modal">&nbsp;</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('Показать все')">Показать все</span>
          </div>
        </div>
      </div>
    </div>
    
    <ion-content>
      <medicines-component
        [result]="result"
        (goToBrand)="goToBrand($event)"
      ></medicines-component>

      <ion-fab bottom right style="margin-bottom: 36px; margin-right: 16px;">
        <button ion-fab (click)="scrollToTop()">
          <ion-icon name="ios-arrow-up"></ion-icon>
        </button>
      </ion-fab>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [MedicinesService]
})

export class MedicinesContainer extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  @ViewChild(Content) content: Content;

  result = [];
  arrayForParameter = [];
  baseArr;

  rusFilters = false;
  engFilters = false;
  numbFilters = false;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private medicinesService: MedicinesService
  ) {
    super();
  }


  public ngOnInit(): void {
    this.wrapToUnsubscribe(this.medicinesService.getMedicines()).subscribe(res => {
      let result = res.result;

      for (const key of Object.keys(result)) {
        let item = {
          'category': key,
          'brandItems': result[key]
        };

        this.result.push(item);

        for (let i = 0; i < result[key].length; i++) {
          this.arrayForParameter.push(result[key][i]);
        }
      }

      this.baseArr = this.result;
    })
  }

  goToBrand(id) {
    this.navCtrl.push(MedicinesSubstancesPageContainer, { id: id, type: 'medicines' })
  }

  closeFilter() {
    this.rusFilters = false;
    this.engFilters = false;
    this.numbFilters = false;
  }

  switcherFilter(param) {
    if (param === 'А-Я') {
      this.rusFilters = true;
      this.engFilters = false;
      this.numbFilters = false;
    } else if (param === 'A-Z') {
      this.rusFilters = false;
      this.engFilters = true;
      this.numbFilters = false;
    } else if (param === '0-9') {
      this.rusFilters = false;
      this.engFilters = false;
      this.numbFilters = true;
    }
  }

  filterParams(param) {
    if (this.baseArr && this.baseArr.length) {
      if (param === 'Показать все') {
        this.result = this.baseArr
      } else {
        this.result = this.baseArr.filter(el => el.category === param);
      }
    }
    this.closeFilter();
  }

  scrollToTop() {
    this.content.scrollToTop(700);
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

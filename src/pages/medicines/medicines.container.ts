import { Component, OnInit } from '@angular/core';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { Store } from '@ngrx/store';
import { NavController } from 'ionic-angular';
import { selectCartProductsLength } from '../../app/store';
import { MedicinesService } from '../../services/medicines.service';
import { MedicinesSubstancesPageContainer } from '../medicines-substances-page/medicines-substances-page.container';


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

    <ion-content>
      <medicines-component
        [result]="result"
        (goToBrand)="goToBrand($event)"
        (filterArray)="filterArray($event)"
      ></medicines-component>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [MedicinesService]
})

export class MedicinesContainer implements OnInit {
  productsLength$ = this.store.select(selectCartProductsLength);

  result = [];
  arrayForParameter = [];
  baseArr;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private medicinesService: MedicinesService
  ) { }


  public ngOnInit(): void {
    this.medicinesService.getMedicines().subscribe(res => {
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
    this.navCtrl.setRoot(MedicinesSubstancesPageContainer, { id: id, type: 'medicines' })
  }

  filterArray(sort) {
    this.result = this.baseArr.filter(el => el.category === sort);
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}
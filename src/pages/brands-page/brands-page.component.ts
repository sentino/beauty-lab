import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';


@Component({
  selector: 'brands-page-component',
  template: `
    <div class="c-filter">
      <div class="l-filter__row" style="padding-left: 25px;">
        <div class="l-filter__buttons">
          <button class="c-filter__button" (click)="onChangeBrand()">{{name}}</button>
          <button class="c-filter__button"  *ngIf="gamme && gamme.length" (click)="onChangeGamme()">{{nameGamme}}</button>
        </div>
      </div>
    </div>
    
    <main  style="margin-top: 25px; padding-left: 16px; padding-right: 16px;">
      <!--<div class="c-slider">-->
        <!--<img class="c-slider__item c-slider__item&#45;&#45;current" src="./images/slider.png">-->
        <!--<div class="l-slider__points">-->
          <!--<div class="c-slider__point"></div>-->
          <!--<div class="c-slider__point"></div>-->
          <!--<div class="c-slider__point"></div>-->
          <!--<div class="c-slider__point"></div>-->
          <!--<div class="c-slider__point c-slider__point&#45;&#45;current"></div>-->
        <!--</div>-->
      <!--</div>-->
      <div class="l-goods l-goods--space" style="display: flex; flex-flow: wrap;">
        <app-product-cart style="margin: auto"
          *ngFor="let item of _products"
          [type]="'lg'"
          [cart]="item"
        ></app-product-cart>
      </div>

      <ion-infinite-scroll #infinite (ionInfinite)="doInfinite($event)">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </main>
  `
})

export class BrandsPageComponent implements OnInit, OnDestroy {
  @Input() name;
  @Input() gamme;
  @Input() nameGamme;
  @Input() products;
  @Input() navigation;

  @Output() changeBrand: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeGamme: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadMoreProducts: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;

  counter = 0;

  get _products() {
    return this.products;
  }


  public ngOnInit(): void {
    this.infinite.threshold = '8000px';
    this.infinite.enable(true);
  }

  onChangeBrand() {
    this.changeBrand.emit();
    this.infinite.enable(true);
  }

  onChangeGamme() {
    this.changeGamme.emit();
    this.infinite.enable(true);
  }


  doInfinite(infiniteScroll) {
    if (this.counter === 0 && this.navigation.pageAll > 1 && this.navigation.pageAll !== this.navigation.pageCurrent) {
      // console.log('Begin async operation');
      this.loadMoreProducts.emit();
      this.counter = 1;
      setTimeout(() => {
        this.counter = 0;
        infiniteScroll.complete();
      }, 2000)
    }

    if (this.navigation.pageAll === 1 || this.navigation.pageAll === this.navigation.pageCurrent) {
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

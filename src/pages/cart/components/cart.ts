import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cart',
  template: `
    <div class="c-good" *ngFor="let product of products">
      <button class="c-good__close" style="z-index: 1;" [disabled]="product.loading" (click)="delete(product.id)"></button>
      <div class="c-good__discount" style="z-index: 1"
           *ngIf="product.discountPercent">{{product.discountPercent}}%
      </div>
      <img *ngIf="product.image" [src]="product.image" alt="pills" class="c-good__image">
      <img *ngIf="!product.image" src="../../../assets/images/завантаження.jpg" alt="pills" class="c-good__image">
      <div class="l-good__info">
        <h2 class="c-good__title">
          {{(product.name.length > 80) ? (product.name | slice:0:80)+'...' : (product.name)}}
        </h2>
        <div class="l-good__row">
          <div class="l-good__price" *ngIf="product.priceFull > product.price">
            <span class="c-good__price c-good__price--del">{{product.priceFullFormat}}</span>
            <span class="c-good__price c-good__price--new">{{product.priceFormat}}</span>
          </div>

          <div class="l-good__price" *ngIf="product.price === product.priceFull">
            <span class="c-good__price c-good__price--new">{{product.priceFullFormat}}</span>
          </div>
          <button
            [ngClass]="product.in_wishlist === 'Y' ? 'c-good__favorite c-good__favorite--selected' : 'c-good__favorite'"
            (click)="clickWishList.emit({id: product.id, wishlist: product.in_wishlist})"
          ></button>
        </div>
        <div class="l-good__row l-good__row--large-margin">
          <div class="c-quantity">
            <span class="c-quantity__text">кол-во</span>
            <button class="c-quantity__button c-quantity__button--remove" (click)="quantityRemove(product.id)"></button>
            <div class="c-quantity__number">{{product.quantity}}</div>
            <button class="c-quantity__button c-quantity__button--add" (click)="quantityAdd(product.id)"></button>
          </div>
          <div class="l-good__price">
            <span class="c-good__price c-good__price--total">{{product.sumFormat}}</span>
          </div>
        </div>
      </div>

      <div class="loading" style="position: absolute; top: 0; left: 0; 
      width: 100%; height: 100%; background-color: #c0c0c059;" 
           *ngIf="product.loading">
        <ion-spinner *ngIf="product.loading" style="
                      position: relative;
                      left: calc(50% - 25px);
                      top: calc(50% - 25px);
                      width: 50px;
                      height: 50px;"></ion-spinner>
      </div>
    </div>
  `
})

export class AppCart {
  @Input() products;
  @Input() discount;

  @Output() deleteProduct: EventEmitter<any> = new EventEmitter();
  @Output() quantityProduct: EventEmitter<any> = new EventEmitter();
  @Output() clickWishList: EventEmitter<any> = new EventEmitter();

  quantity: number;

  delete(id) {
    this.deleteProduct.emit(id);
  }

  quantityRemove(id) {
    this.products.map(el => {
      if (el.id === id && el.quantity > 1) {
        el.quantity--;
        this.quantityProduct.emit({id, quantity: el.quantity});
      }
    })
  }

  quantityAdd(id) {
    this.products.map(el => {
      if (el.id === id && el.quantity < 999999) {
        el.quantity++;
        this.quantityProduct.emit({id, quantity: el.quantity});
      }
    })
  }

}

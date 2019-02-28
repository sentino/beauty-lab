import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-modal-one-click-order',
  template: `
    <div class="l-modal" style="overflow-y: auto; z-index: 10; left: 0;">
        <div class="l-modal" style="background: none;" (click)="close.emit()"></div>
        <div class="c-modal" style="z-index: 11;">
            <h2 class="c-modal__title" style="margin-top: 0;">
                Оформить заказ в 1 клик
            </h2>
            <button class="c-modal__close" (click)="close.emit()"></button>
            <p class="c-modal__text">
                Просто оставьте свой номер телефона, и наш консультант свяжется с Вами
                с понедельника по пятницу с 10:00 до 20:00, в
                субботу и воскресенье с 11:00 до 17:00.
            </p>

          <ion-list [formGroup]="form">
            <ion-item style=" border: none;
                            padding: 0;
                            background-color: white;">
              <ion-label color="secondary" floating>Имя</ion-label>
              <ion-input [formControl]="this.form.controls['name']"></ion-input>
            </ion-item>


            <ion-item style=" border: none;
                            padding: 0;
                            background-color: white;">
              <ion-label color="secondary" floating>Мобильный телефон</ion-label>
              <ion-input [formControl]="this.form.controls['phone']"></ion-input>
            </ion-item>
          </ion-list>

            <button class="c-default-button c-default-button--resized" [disabled]="form.invalid" (click)="submit()">
              ОТПРАВИТЬ</button>
        </div>
    </div>
  `
})
export class ModalOneClickOrder implements OnInit {
  @Input('productId') _productId;

  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  get productId() {
    return this._productId;
  }

  form: FormGroup;

  constructor(private cartService: CartService) {

  }

  public ngOnInit(): void {
    this.form = new FormGroup({
      'name': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      'phone': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^((\+7|7|8)+([0-9]){10})$/gm)
      ])
    })
  }

  submit() {
    let name = this.form.controls['name'].value;
    let phone = this.form.controls['phone'].value;

    if (this.productId) {
      this.cartService.orderGoodsInOneClick(name, phone, this.productId)
    } else {
      this.cartService.oneClickOrder(name, phone);
    }
    this.close.emit();
  }
}

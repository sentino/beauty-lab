import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-section-list-item-two',
  template: `
    <section [formGroup]="form" [className]="displayNone ? 'switchDisplayNone' : ''">
      <!--<ion-list-->
        <!--radio-group-->
        <!--[formArrayName]="'delivery'">-->
        <!--<section *ngFor="let item of form.controls.delivery.controls; let i = index">-->
          <!--<ion-item [formControlName]="i" ngDefaultControl>-->
            <!--<ion-label>Курьерская доставка</ion-label>-->
            <!--<ion-radio checked="true" value="0"></ion-radio>-->
          <!--</ion-item>-->
        <!--</section>-->
      <ion-list radio-group [formControl]="form.controls['delivery']">
        <ion-item *ngFor="let item of delivery">
          <ion-label>{{item.name}}</ion-label>
          <ion-radio value="{{item.id}}"></ion-radio>
        </ion-item>

        
        <section style="border-top: 1px solid #e0e0e0;" *ngIf="form.controls['delivery'].value">
          <ion-item style="margin: 5px 0" *ngIf="deliveryInfo.points">
            <ion-label>Пункты выдачи</ion-label>
            <ion-select 
              [(ngModel)]="deliveryPoint"
              [ngModelOptions]="{standalone: true}"
              (ngModelChange)="changePoint($event)">
              <ion-option *ngFor="let item of deliveryInfo.points; let i = index"
                  value="{{item.id}}">{{item.name}}</ion-option>
            </ion-select>
          </ion-item>


          <div class="l-radiobutton__info l-radiobutton__info--picked" style="padding: 0"
               *ngIf="deliveryInfo && !deliveryInfo.points && !pointResult">
            <div class="c-delivery">
              <h2 class="c-delivery__title c-delivery__title--thin" style="margin: 0">Стоимость доставки</h2>
              <span class="c-delivery__quantity c-delivery__quantity--thin">{{deliveryInfo.priceFormat}}</span>
            </div>
            <div class="c-delivery">
              <h2 class="c-delivery__title  c-delivery__title--thin" style="margin: 0">Срок доставки</h2>
              <span class="c-delivery__quantity c-delivery__quantity--thin">{{deliveryInfo.desc}}</span>
            </div>
          </div>

          <div class="l-radiobutton__info l-radiobutton__info--picked" style="padding: 0"
               *ngIf="pointResult">
            <div class="c-delivery">
              <h2 class="c-delivery__title c-delivery__title--thin" style="margin: 0">Стоимость доставки</h2>
              <span class="c-delivery__quantity c-delivery__quantity--thin">{{pointResult.price}} руб.</span>
            </div>
          </div>
        </section>
      </ion-list>
    </section>
  `
})

export class AppSectionListItemTwo {
  @Input() form;
  @Input() displayNone;
  @Input() delivery;
  @Input() priceDelivery;
  // @Input() deliveryInfo;

  @Output() pointResultId: EventEmitter<any> = new EventEmitter();
  @Output() selectedDeliveryPrice: EventEmitter<any> = new EventEmitter();

  deliveryInfo;
  pointResult;
  deliveryPoint;

  ngOnInit() {
    this.form.controls['delivery'].valueChanges.subscribe(res => {
      this.deliveryInfo = undefined;
      this.deliveryPoint = undefined;
      for (let i = 0; i < this.delivery.length; i++) {
        if (this.delivery[i].id === res) {
          this.deliveryInfo = this.delivery[i];
          this.selectedDeliveryPrice.emit(this.deliveryInfo.priceFormat);
          this.pointResult = undefined;
        }
      }
    })
  }

  changePoint(event) {
    for (let i = 0; i < this.deliveryInfo.points.length; i++) {
      if (this.deliveryInfo.points[i].id === Number(event)) {
        this.pointResult = this.deliveryInfo.points[i];
        this.pointResultId.emit(this.pointResult.id);
        this.selectedDeliveryPrice.emit(this.pointResult.priceFormat);
      }
    }
  }

}

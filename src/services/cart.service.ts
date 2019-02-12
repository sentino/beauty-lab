import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class CartService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getCart(): Observable<any> {
    return this.http.get(this.config.url + 'cart/list');
  }

  postCoupon(coupon: string) {
    return this.http.post(this.config.url + 'cart/list', {'coupon': coupon})
      .delay(1000)
      .map(res => res);
  }


  postProduct(id, quantity) {
    return this.http.post(this.config.url + 'cart/item', {'product': id, 'quantity': quantity });
  }

  orderGoodsInOneClick(name, phone, id) {
    this.http.post(this.config.url + 'order/createshortitem', {
      "name": name,
      "phone": phone,
      "item": id
    }).subscribe(res => {
      console.log('заказ товара в 1 клик', res);
    })
  }

  oneClickOrder(name, phone) {
    this.http.post(this.config.url + 'order/createshort', {
      "name": name,
      "phone": phone
    }).subscribe(res => {
      console.log('заказ в 1 клик', res);
    })
  }

  putProduct(id, quantity) {
    return this.http.put(this.config.url + 'cart/item', {'itemId': id, 'quantity': quantity });
  }

  delProduct(id) {
    return this.http.request('DELETE', this.config.url + 'cart/item', {body: { 'itemId': id }});
  }

}

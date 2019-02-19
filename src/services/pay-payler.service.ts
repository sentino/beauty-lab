import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class PayPaylerService {

  constructor(
    private http: HttpClient,
    public config: ConfigProvider,
  ) {}

  getData() {
    return this.http.get(this.config.url + 'order/create/')
  }

  putData(body) {
    return this.http.put(this.config.url + 'order/create/', body)
  }

  postData(body) {
    return this.http.post(this.config.url + 'order/create/', body)
  }

  postPay(orderId) {
    return this.http.post(this.config.url + 'order/pay/', {orderId: orderId})
  }
}

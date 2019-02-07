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

  testPostItem() {
    this.http.post(this.config.url + 'cart/item', {"product": '104810', "quantity": "1" }).subscribe(res => {
      console.log(res);
    });
  }

  getData() {
    return this.http.get(this.config.url + 'order/create/')
  }

  putData(body) {
    return this.http.put(this.config.url + 'order/create/', body)
  }

  postData(body) {
    return this.http.post(this.config.url + 'order/create/', body)
  }
}

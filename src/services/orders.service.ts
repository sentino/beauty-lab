import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class OrdersService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider
  ) {}

  getOrders(): Observable<any> {
    return this.http.get(this.config.url + 'user/orders')
  }

  postOrders(id): Observable<any> {
    return this.http.post(this.config.url + 'user/orders', {"order": id, "action": "copy"})
  }
}

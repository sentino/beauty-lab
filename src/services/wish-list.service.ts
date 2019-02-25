import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertProvider } from './alert/alert';

@Injectable()
export class WishListService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
    private alert: AlertProvider
  ) {}

  getList(): Observable<any> {
    return this.http.get(this.config.url + 'user/wishlist')
  }

  putItem(id) {
    this.http.put(this.config.url + 'user/wishlist', {'product': id}).subscribe((res: any) => {
      this.alert.show(res.result.successText);
    })
  }

  delItem(id) {
    this.http.request('DELETE', this.config.url + 'user/wishlist', {body: {'product': id}}).subscribe((res: any) => {
      this.alert.show(res.result.successText);
    });
  }
}

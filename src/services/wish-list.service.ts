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
  ) {}

  getList(): Observable<any> {
    return this.http.get(this.config.url + 'user/wishlist')
  }

  putItem(id): Observable<any> {
    return this.http.put(this.config.url + 'user/wishlist', {'product': id})
  }

  delItem(id): Observable<any> {
    return this.http.request('DELETE', this.config.url + 'user/wishlist', {body: {'product': id}})
  }
}

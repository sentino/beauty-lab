import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class BrandsService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getBrands(): Observable<any> {
    return this.http.get(this.config.url + 'brands/list')
  }
}

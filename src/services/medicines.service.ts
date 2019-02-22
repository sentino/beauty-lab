import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class MedicinesService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getMedicines(): Observable<any> {
    return this.http.get(this.config.url + 'products/list')
  }

  getMedicinesById(id): Observable<any> {
    return this.http.get(this.config.url + `products/view/${id}`)
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class SearchService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getSearch(value): Observable<any> {
    return this.http.get(this.config.url + 'catalog/search/?q=' + value + '&count=50');
  }
}

import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ArticlesPromotionsService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getPromotions(): Observable<any> {
    return this.http.get(this.config.url + 'actions/list')
  }

  getPromotionsById(id): Observable<any> {
    return this.http.get(this.config.url + `actions/view/${id}`)
  }

  getArticles(): Observable<any> {
    return this.http.get(this.config.url + 'articles/list')
  }

  getArticlesById(id): Observable<any> {
    return this.http.get(this.config.url + `articles/view/${id}`)
  }
}

import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BonusesService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getBonuses(): Observable<any> {
    return this.http.get(this.config.url + 'user/points')
  }
}

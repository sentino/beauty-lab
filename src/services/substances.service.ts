import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class SubstancesService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getSubstances(): Observable<any> {
    return this.http.get(this.config.url + 'mnn/list')
  }

  getSubstancesById(id): Observable<any> {
    return this.http.get(this.config.url + `mnn/view/${id}`)
  }
}

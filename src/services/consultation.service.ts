import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class ConsultationService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getSpecList(page): Observable<any> {
    return this.http.get(this.config.url + `specialist/list/?page=${page}`)
  }

  getSpecialist(id): Observable<any> {
    return this.http.get(this.config.url + `specialist/view/${id}`)
  }

  postQuestion(data): Observable<any> {
    return this.http.post(this.config.url + 'tools/question', data)
  }
}

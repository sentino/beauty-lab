import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProvider } from './config/config';
import { Observable } from 'rxjs';


@Injectable()
export class ContentPagesService {

  constructor(
    private http: HttpClient,
    private config: ConfigProvider,
  ) {}

  getContacts(): Observable<any> {
    return this.http.get(this.config.url + 'pages/contacts')
  }

  getAbout(): Observable<any> {
    return this.http.get(this.config.url + 'pages/about')
  }

  getLicense(): Observable<any> {
    return this.http.get(this.config.url + 'pages/license')
  }

  getGuarantees(): Observable<any> {
    return this.http.get(this.config.url + 'pages/guarantee')
  }

  getLegalEntities(): Observable<any> {
    return this.http.get(this.config.url + 'pages/forcorporateclients')
  }

  getPrivacyPolicy(): Observable<any> {
    return this.http.get(this.config.url + 'pages/privacypolicy')
  }

  getAgreement(): Observable<any> {
    return this.http.get(this.config.url + 'pages/termsuse')
  }

}

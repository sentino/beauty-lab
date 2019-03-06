import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  customerData: any;
  xContentSession: any;
  urls = [
    'https://api.lab-krasoty.ru/api/v1/auth/logout/',
    'https://api.lab-krasoty.ru/api/v1/user/profile/',
    'https://api.lab-krasoty.ru/api/v1/user/points/',
    'https://api.lab-krasoty.ru/api/v1/user/wishlist/',
    'https://api.lab-krasoty.ru/api/v1/user/orders/',
    'https://api.lab-krasoty.ru/api/v1/tools/subscribe/',
  ];


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    this.customerData = localStorage.getItem('customerData');
    this.xContentSession = localStorage.getItem('x-content-session');

    if (this.customerData) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization-Token': this.customerData,
          'x-content-session': this.xContentSession ? this.xContentSession : ''
        }
      });
      return next.handle(request).map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          localStorage.setItem('x-content-session', event.headers.get('x-content-session'));
        }
        return event;
      });
    } else {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-content-session': this.xContentSession ? this.xContentSession : ''
        }
      });
      return next.handle(request).map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          localStorage.setItem('x-content-session', event.headers.get('x-content-session'));
        }
        return event;
      });
    }
  }
}

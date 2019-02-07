import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { parseCookieValue } from '@angular/common/src/cookie';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  customerData: any;
  PHPSESSID: any;
  urls = [
    'https://api.lab-krasoty.ru/api/v1/auth/logout/',
    'https://api.lab-krasoty.ru/api/v1/user/profile/',
    'https://api.lab-krasoty.ru/api/v1/user/points/',
    'https://api.lab-krasoty.ru/api/v1/user/wishlist/',
    'https://api.lab-krasoty.ru/api/v1/user/orders/',
    'https://api.lab-krasoty.ru/api/v1/tools/subscribe/',
  ];

  // возвращает cookie с именем name, если есть, если нет, то undefined
  // getCookie(name) {
  //   let value = "; " + document.cookie;
  //   debugger;
  //   let parts = value.split("; " + name + "=");
  //   debugger;
  //   if (parts.length == 2) return parts.pop().split(";").shift();
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    this.customerData = localStorage.getItem('customerData');
    this.PHPSESSID = localStorage.getItem('PHPSESSID');
    // let PHPSESSID = this.getCookie('PHPSESSID');
    // debugger;

    // if (this.customerData &&
    //     request.url === this.urls[0] ||
    //     request.url === this.urls[1] ||
    //     request.url === this.urls[2] ||
    //     request.url === this.urls[3] ||
    //     request.url === this.urls[4] ||
    //     request.url === this.urls[5]) {
    //
    //   request = request.clone({
    //     setHeaders: {
    //       'Content-Type': 'application/json; charset=utf-8',
    //       'Authorization-Token': this.customerData,
    //       'withCredentials': 'true'
    //     }
    //   });
    //   return next.handle(request);
    // }
    if (this.customerData) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization-Token': this.customerData,
          // 'withCredentials': 'true'
          // 'PHPSESSID': this.PHPSESSID
        }
      });
      return next.handle(request);
    } else {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
      return next.handle(request);
    }
  }
}

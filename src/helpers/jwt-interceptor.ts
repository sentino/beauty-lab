import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  customerData: any;
  urls = [
    'https://api.lab-krasoty.ru/api/v1/catalog/sections/',
    'https://api.lab-krasoty.ru/api/v1/catalog/beauty/',
    'https://api.lab-krasoty.ru/api/v1/catalog/health/',
    'https://api.lab-krasoty.ru/api/v1/brands/list/',
    'https://api.lab-krasoty.ru/api/v1/products/list/',
    'https://api.lab-krasoty.ru/api/v1/mnn/list/',
    'https://api.lab-krasoty.ru/api/v1/actions/list/',
    'https://api.lab-krasoty.ru/api/v1/articles/list/',
    'https://api.lab-krasoty.ru/api/v1/specialist/list/',
    'https://api.lab-krasoty.ru/api/v1/pages/index/',
    'https://api.lab-krasoty.ru/api/v1/pages/contacts/',
    'https://api.lab-krasoty.ru/api/v1/pages/about/',
    'https://api.lab-krasoty.ru/api/v1/pages/license/',
    'https://api.lab-krasoty.ru/api/v1/pages/guarantee/',
    'https://api.lab-krasoty.ru/api/v1/pages/forcorporateclients/',
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available

    this.customerData = JSON.parse(localStorage.getItem('customerData'));

      // if (request.url === this.urls[0] ||
      //     request.url === this.urls[1] ||
      //     request.url === this.urls[2] ||
      //     request.url === this.urls[3] ||
      //     request.url === this.urls[4] ||
      //     request.url === this.urls[5] ||
      //     request.url === this.urls[6] ||
      //     request.url === this.urls[7] ||
      //     request.url === this.urls[8] ||
      //     request.url === this.urls[9] ||
      //     request.url === this.urls[10] ||
      //     request.url === this.urls[11] ||
      //     request.url === this.urls[12] ||
      //     request.url === this.urls[13] ||
      //     request.url === this.urls[14]) {
      //   return next.handle(request);
      //
      // } else {
        if (this.customerData && this.customerData.accessToken) {
          request = request.clone({
            setHeaders: {
              'Authorization-Token': this.customerData.accessToken,
              'Access-Control-Allow-Origin': 'http://localhost:8100',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          return next.handle(request);

        } else {
          // return EMPTY;
          return next.handle(request);
        }
      // }
  }
}

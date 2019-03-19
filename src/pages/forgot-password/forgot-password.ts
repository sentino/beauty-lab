import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { LoadingProvider } from '../../services/loading/loading';
import { ConfigProvider } from '../../services/config/config';
import { SearchPage } from '../../pages/search/search';
import { HttpClient } from '@angular/common/http';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { CartContainer } from '../cart/cart-container';
import { AnalyticsService } from '../../services/analytics.service';
import { AlertProvider } from '../../services/alert/alert';


@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  animations: [
    trigger('shakeCart', [
      state('inactive', style({
        animation: 'shake 0.75s'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('500ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
})
export class ForgotPasswordPage {
  productsLength$ = this.store.select(selectCartProductsLength);

  formData = {
    email: '',
  };
  response;
  errorMessage = '';
  forgot_complete = false;
  forgot_message;
  SearchList = false;
  Search_result;
  

  search = {
    "search_string": '',
  };

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loading: LoadingProvider,
    public http: HttpClient,
    public config: ConfigProvider,
    public navParams: NavParams,
    private ga: AnalyticsService,
    public alert: AlertProvider,
  ) {
    this.ga.trackPage('forgotPassword');
  }


  forgetPassword() {

    this.errorMessage = '';
    this.http.post(this.config.url + 'auth/forgotpassword/', this.formData).subscribe((data: any) => {


      this.response = data;
      
      if(this.response.result.error == 0){
        this.forgot_complete = true;
        this.forgot_message = this.response.result.successText;
      }

      if(this.response.result.error == 1){
        this.forgot_complete = false;
        this.alert.show(this.response.result.errorText);
      }
    },
    err => {
      this.forgot_complete = false;

      if(err.status == 422){
        this.alert.show("Пользователь не найден!Попробуйте ещё раз.");
      }
    }
  );
  }

  
  showHideSearchList() {
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch() {
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).subscribe(data => {
      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
}

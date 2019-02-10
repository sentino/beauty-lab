// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { LoadingProvider } from '../../services/loading/loading';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../services/config/config';
import { SearchPage } from '../../pages/search/search';
import { HttpClient } from '@angular/common/http';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  animations: [
    trigger('shakeCart', [
      state('inactive', style({
        animation: 'shake 0.75s'
      })),
      state('active', style({
        //  animation: 'shake 0.75s'
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
    public navParams: NavParams) {
  }
  forgetPassword() {
    this.loading.show();
    this.errorMessage = '';
    this.http.post(this.config.url + 'auth/forgotpassword/', this.formData).subscribe((data: any) => {
      this.loading.hide();

      console.log("Forg Data");
      console.log(data);
      this.response = data;
      
      if(this.response.result.error == 0){
        this.forgot_complete = true;
        this.forgot_message = this.response.result.successText;
      }

      if(this.response.result.error == 1){
        this.forgot_complete = false;
        console.log("Ошибочки"); 
        console.log(this.response.result.errorText);
        alert(this.response.result.errorText);
      }
    },
    err => {
      this.forgot_complete = false;
      this.loading.hide();
      console.log(err);
      if(err.status == 422){
        alert("Пользователь не найден!Попробуйте ещё раз.")
      }
    }
  );
  }

  
  showHideSearchList(){
    console.log("Search status");
    console.log(this.SearchList);
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch(){
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).subscribe(data => {
      // console.log(data.product_data.length + "   " + this.page);
      console.log("Search answer:");
      console.log(data);

      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
      console.log(err);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

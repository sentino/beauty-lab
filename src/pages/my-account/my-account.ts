// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { ConfigProvider } from '../../services/config/config';
import { Http } from '@angular/http';
import { Platform, NavController } from 'ionic-angular';
import { AlertProvider } from '../../services/alert/alert';
import { LoadingProvider } from '../../services/loading/loading';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import {Headers, RequestOptions} from '@angular/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validatorFnControlsMatch } from '../../helpers/customValidator';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';



@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
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
export class MyAccountPage {
  productsLength$ = this.store.select(selectCartProductsLength);

  pet: string = "puppies";

  phoneNumber: any = "";
  public mask = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  
  public data_mask = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];

  public zip = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  userForm: FormGroup;
  // usePasswordrForm: FormGroup;

  myAccountData = {
    email: '',                    // type string / required - email
    password: '',                 // type string / required - пароль
    passwordConfirmed: '',        // type string / required - повтор пароля
    name: '',                     // type string / required - имя
    lastName: '',                 // type string / required - фамилия
    secondName: '',               // type string / option - отчество
    birthday: '',                 // type string / option - день рождения
    phone: '',                    // type string / option - телефон
    addressZip: '',               // type string / option - индекс
    addressCity: '',              // type string / option - город
    addressStreet: '',             // type string / option - улица, адрес
    customers_picture: ''
  };

  ProfileData;
  response;
  SearchList = false;
  Search_result;
  pass_validation;

  search = {
    "search_string": '',
  };

  profilePicture = '';
  passwordData: { [k: string]: any } = {};


  get passwordConfirmedControl(): FormControl {
    return this.userForm.get('passwordConfirmed') as FormControl;
  }


  constructor(
    private store: Store<any>,
    public http: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    // public translate: TranslateService,
    public platform: Platform,
    public navCtrl: NavController,
    public alert: AlertProvider,
    public loading: LoadingProvider) {

    this.userForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),                 // type string / required - пароль
      passwordConfirmed: new FormControl(null, [Validators.required]),
    }, validatorFnControlsMatch('password', 'passwordConfirmed'));
  }

  getProfile(){
    // const headers = new Headers();
    // headers.append('Authorization-Token',this.shared.customerData.accessToken);

    // const options = new RequestOptions({headers: headers});

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization-Token': this.shared.customerData.accessToken
    //   })
    // };
    
    // this.http.get(this.config.url + 'user/profile/', httpOptions).subscribe(
    this.http.get(this.config.url + 'user/profile/').subscribe(
      (res: any) => {
        // console.log("User Profile:");
        // console.log(res);

        this.ProfileData = res;

        this.myAccountData.email = this.ProfileData.result.email;
        this.myAccountData.password = this.userForm.controls['password'].value;
        this.myAccountData.passwordConfirmed = this.userForm.controls['passwordConfirmed'].value;
        this.myAccountData.name = this.ProfileData.result.name;
        this.myAccountData.lastName = this.ProfileData.result.lastName;
        this.myAccountData.secondName = this.ProfileData.result.secondName;
        this.myAccountData.birthday = this.ProfileData.result.birthday;
        this.myAccountData.phone = this.ProfileData.result.phone;
        this.myAccountData.addressZip = this.ProfileData.result.addressZip;
        this.myAccountData.addressCity = this.ProfileData.result.addressCity;
        this.myAccountData.addressStreet = this.ProfileData.result.addressStreet;
      });
  }

  
  showHideSearchList(){
    // console.log("Search status");
    // console.log(this.SearchList);
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch(){
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).subscribe(data => {
      // console.log(data.product_data.length + "   " + this.page);
      // console.log("Search answer:");
      // console.log(data);

      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
      // console.log(err);
    });
  }

  updateProfile(){
    if(this.myAccountData.password === this.myAccountData.passwordConfirmed){
    this.loading.show();
    // const headers = new Headers();
    // headers.append('Authorization-Token',this.shared.customerData.accessToken);
    //
    // const options = new RequestOptions({headers: headers});

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization-Token': this.shared.customerData.accessToken
    //   })
    // };

    // this.http.put(this.config.url + 'user/profile/', this.myAccountData, httpOptions).subscribe(
    this.http.put(this.config.url + 'user/profile/', this.myAccountData).subscribe(
      (res: any) => {
        this.loading.hide();
        // console.log("User Response:");
        // console.log(res);
        this.response = res;

        this.shared.customerData.name = this.response.result.name;
        this.shared.customerData.email = this.response.result.email;
        this.shared.customerData.lastName = this.response.result.lastName;

        // console.log("New Name");
        // console.log(this.shared.customerData.name);
        // this.shared.customerData.surname = this.Userdata.surname;

      if(this.response.result.error == 0){
          // console.log("Ошибок нету");
          alert("Данные успешно сохранены!");
        }
  
        if(this.response.result.error == 1){
          // console.log("Ошибочки");
          // console.log(this.response.result.errorText);
          alert(this.response.result.errorText);
        }
      });
    }
    else{
      this.pass_validation = false;
      // console.log("This pass validation:");
      // console.log(this.pass_validation);
      alert("Пароли не совпадают!");
    }
  }


  // updateInfo(){

  //   const headers = new Headers();
  //   headers.append('accessToken',this.shared.customerData.accessToken);

  //   const options = new RequestOptions({headers: headers});
  
  //   this.http.put(this.config.url + 'user/profile/', this.myAccountData, options).subscribe(
  //     res => {
  //       this.loading.hide();
  //       this.Userdata = res;
  //       console.log("User info updated:");
        
  //       if(localStorage.langId == 'ru'){
  //         alert("Данные успешно изменены.");
  //       }
  
  //       if(localStorage.langId == 'en'){
  //         alert("Data successfully changed.");
  //       }
  
  //       this.shared.customerData.name = this.Userdata.name;
  //       this.shared.customerData.surname = this.Userdata.surname;
  //     },
  //     err => {
  //       var er_status = err.status;
  //       console.log(err);
  //       this.loading.hide();
  
  //       if(er_status == '422'){
  //         if(localStorage.langId == 'ru'){
  //           alert("Вы ввели пароль меньше 6 символов, или пароли не совпадают!");
  //         }
    
  //         if(localStorage.langId == 'en'){
  //           alert("You have entered a password less than 6 characters or the passwords do not match!");
  //         }
  //       }
  
  //       if(er_status == '401'){
  
  //         if(localStorage.langId == 'ru'){
  //           alert("Пожалуйста перезайдите в приложение. Возникли проблемы с вашим профилем!");
  //         }
    
  //         if(localStorage.langId == 'en'){
  //           alert("Please re-enter the application. There are problems with your profile!!");
  //         }
  //         this.loading.hide();
  //         this.navCtrl.push(LoginPage);
  //       }
        
  //       if(er_status == '500'){
  //         this.loading.show();
  //         if(localStorage.langId == 'ru'){
  //           alert("Возникла ошибка сервера. Зайдите пожалуйста позже!");
  //         }
    
  //         if(localStorage.langId == 'en'){
  //           alert("There was a server error. Please come back later!");
  //         }
  //       }
  //     });
  // }

  //============================================================================================  
  //function updating user information

  //============================================================================================  
  //function updating user password
  // updatePassword = function (form) {
  //   if (this.passwordData.currentPassword != this.shared.customerData.customers_password) {
  //     this.alert.show("Please enter Correct Password");
  //   }
  //   else {
  //     this.loading.show();
  //     this.passwordData.customers_id = this.shared.customerData.customers_id;
  //     var data = this.passwordData;
  //     this.http.post(this.config.url + 'updateCustomerPassword', data).map(res => res.json()).subscribe(data => {
  //       this.loading.hide();
  //       if (data.success == 1) {
  //         this.shared.customerData.customers_password = this.passwordData.customers_password;
  //         this.shared.login(this.shared.customerData);
  //         this.alert.show(data.message);
  //         this.passwordData.currentPassword = "";
  //         this.passwordData.customers_password = "";
  //       }
  //       else {
  //       }
  //     }, function (response) {
  //       this.loading.hide();
  //       this.alert.show("Server Error while changing password");
  //     });
  //   }

  // };

  ionViewWillEnter() {
    // this.myAccountData.customers_firstname = this.shared.customerData.customers_firstname;
    // this.myAccountData.customers_lastname = this.shared.customerData.customers_lastname;

    // this.profilePicture = this.config.url + this.shared.customerData.customers_picture;
    // this.myAccountData.customers_old_picture = this.shared.customerData.customers_picture;
    // this.myAccountData.customers_telephone = this.shared.customerData.customers_telephone;
    // try {
    //   // console.log(this.shared.customerData.customers_dob);
    //   this.myAccountData.customers_dob = new Date(this.shared.customerData.customers_dob).toISOString();
    //   // console.log(this.myAccountData.customers_dob);
    // } catch (error) {
    //   this.myAccountData.customers_dob = new Date("1-1-2000").toISOString();
    // }

  }
  openCart() {
    this.navCtrl.push(CartContainer);
  }

  steps: string = "first";

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  ngOnInit() {
    this.getProfile();

      localStorage.setItem("token",null);
  
      const FloatLabel = (() => {
        // add active class and placeholder 
        const handleFocus = (e) => {
          // alert("test");
          const target = e.target;
          target.parentNode.classList.add('active');
          target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
        };
        
        // remove active class and placeholder
        const handleBlur = (e) => {
          const target = e.target;
          if(!target.value) {
            target.parentNode.classList.remove('active');
          }
          target.removeAttribute('placeholder');    
        };  
        
        // register events
        const bindEvents = (element) => {
          const floatField = element.querySelector('input');
          floatField.addEventListener('focus', handleFocus);
          floatField.addEventListener('blur', handleBlur);    
        };
        
        // get DOM elements
        const init = () => {
          const floatContainers  = Array.from(document.querySelectorAll('.float-container'));
  
          floatContainers.forEach((element) => {
            if (element.querySelector('input').value) {
                element.classList.add('active');
            }      
            
            bindEvents(element);
          });
        };
        
        return {
          init: init
        };
      })();
      
      FloatLabel.init();
  }

}

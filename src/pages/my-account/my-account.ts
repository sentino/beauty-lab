import { Component } from '@angular/core';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { ConfigProvider } from '../../services/config/config';
import { Platform, NavController } from 'ionic-angular';
import { AlertProvider } from '../../services/alert/alert';
import { LoadingProvider } from '../../services/loading/loading';
import { HttpClient } from '@angular/common/http';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validatorFnControlsMatch } from '../../helpers/customValidator';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { AnalyticsService } from '../../services/analytics.service';



@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
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
export class MyAccountPage {
  productsLength$ = this.store.select(selectCartProductsLength);

  pet: string = "kittens";

  phoneNumber: any = "";
  public mask = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  
  public data_mask = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];

  public zip = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  userForm: FormGroup;
  form: FormGroup;

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
  steps: string = "first";


  get passwordConfirmedControl(): FormControl {
    return this.userForm.get('passwordConfirmed') as FormControl;
  }


  constructor(
    private store: Store<any>,
    public http: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public platform: Platform,
    public navCtrl: NavController,
    public alert: AlertProvider,
    public loading: LoadingProvider,
    private ga: AnalyticsService
    ) {
    this.ga.trackPage('profile');

    this.userForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),                 // type string / required - пароль
      passwordConfirmed: new FormControl(null, [Validators.required]),
    }, validatorFnControlsMatch('password', 'passwordConfirmed'));

    this.form = new FormGroup({
      phone: new FormControl('', [Validators.minLength(18)]),
    })
  }

  get returnReplace() {
    if (this.ProfileData) {
      return this.ProfileData.result.phone.slice(1).replace(/\D/gi, '');
    }
    return ''
  }

  // test(event) {
  //   console.log(event);
  //   this.form.controls['phone'].patchValue(event);
  // }

  getProfile() {
    this.http.get(this.config.url + 'user/profile/').subscribe(
      (res: any) => {
        this.ProfileData = res;
        this.myAccountData.email = this.ProfileData.result.email;
        this.myAccountData.password = this.userForm.controls['password'].value;
        this.myAccountData.passwordConfirmed = this.userForm.controls['passwordConfirmed'].value;
        this.myAccountData.name = this.ProfileData.result.name;
        this.myAccountData.lastName = this.ProfileData.result.lastName;
        this.myAccountData.secondName = this.ProfileData.result.secondName;
        this.myAccountData.birthday = this.ProfileData.result.birthday;

        this.form.controls['phone'].setValue(this.ProfileData.result.phone);
        this.form.controls['phone'].updateValueAndValidity({onlySelf:true, emitEvent:false});

        this.myAccountData.addressZip = this.ProfileData.result.addressZip;
        this.myAccountData.addressCity = this.ProfileData.result.addressCity;
        this.myAccountData.addressStreet = this.ProfileData.result.addressStreet;
      });
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

  updateProfile() {
    this.myAccountData.phone = this.form.controls['phone'].value;

    if(this.myAccountData.password === this.myAccountData.passwordConfirmed){

    this.http.put(this.config.url + 'user/profile/', this.myAccountData).subscribe(
      (res: any) => {

        this.response = res;

        this.shared.customerData.name = this.response.result.name;
        this.shared.customerData.email = this.response.result.email;
        this.shared.customerData.lastName = this.response.result.lastName;

      if(this.response.result.error == 0){
          alert("Данные успешно сохранены!");
        }
  
        if(this.response.result.error == 1){
          alert(this.response.result.errorText);
        }
      });
    }
    else{
      this.pass_validation = false;
      alert("Пароли не совпадают!");
    }
  }

  ionViewWillEnter() {
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  ngOnInit() {
    this.getProfile();

    localStorage.setItem("token",null);

    const FloatLabel = (() => {
      // add active class and placeholder
      const handleFocus = (e) => {
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

// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { LoadingProvider } from '../../services/loading/loading';
import { ConfigProvider } from '../../services/config/config';
import { Http } from '@angular/http';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { NavController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { MenuController } from 'ionic-angular';
import { trigger, transition, animate, style } from '@angular/animations';
import { App } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { HomePage } from '../home/home';
import { HttpClient } from '@angular/common/http';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validatorFnControlsMatch } from '../../helpers/customValidator';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({
            height: 0,
            overflow: 'hidden'
          }),
          animate('500ms', style({ height: 'auto' }))
        ]),
        transition(':leave', [
          style({ height: 'auto' }),
          animate('500ms', style({ height: 0, overflow: 'hidden' }))
        ])
      ]
    )
  ],
})
export class SignUpPage {

  registerForm: FormGroup;

  categoriesListIcon = 'add';
  categoriesLoginIcon = 'add';
  ProfileList = false;
  monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Агуст", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  public zip = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(
    public http: HttpClient,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    public navCtrl: NavController,
    private appVersion: AppVersion,
    public menuCtrl: MenuController,
    public appCtrl: App,
    public platform: Platform
  ) {

    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{2,}@[a-zA-Z]{2,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]),                    // type string / required - email
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),                 // type string / required - пароль
      passwordConfirmed: new FormControl(null, [Validators.required]),        // type string / required - повтор пароля
      name: new FormControl(null, [Validators.required]),                     // type string / required - имя
      lastName: new FormControl(null, [Validators.required]),                 // type string / required - фамилия
      secondName: new FormControl(null),               // type string / option - отчество
      birthday: new FormControl(null),                 // type string / option - день рождения
      phone: new FormControl(null, [Validators.pattern(/^((\+7|7|8)+([0-9]){10})$/gm)]),                    // type string / option - телефон
      addressZip: new FormControl(null),               // type string / option - индекс
      addressCity: new FormControl(null),              // type string / option - город
      addressStreet: new FormControl(null),             // type string / option - улица, адрес
      customers_picture: new FormControl(null),
      subscribe: new FormControl(true)
    }, validatorFnControlsMatch('password', 'passwordConfirmed'));
  }

  @ViewChild('datePicker') datePicker;

  signUp() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading.show();
    this.http.post(this.config.url + 'auth/register/', this.registerForm.value).subscribe((data: any) => {
      this.loading.hide();

      if (data.result.error == 0) {
        this.shared.userInfo(data.result);
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNav().setRoot(HomePage);
        this.menuCtrl.close();
      }

      if (data.result.error == 1) {
        alert(data.result.errorText);
      }
    },
      err => {
        this.loading.hide();
        alert(JSON.parse(err._body).result.errorText);
      });
  }


  showHideLoginList() {
    if (this.ProfileList == false) { this.ProfileList = true; this.categoriesLoginIcon = 'close'; }
    else { this.ProfileList = false; this.categoriesLoginIcon = 'add'; }
  }

  dismiss() {
    this.navCtrl.push(LoginPage);
    this.viewCtrl.dismiss();
  }

  ngOnInit() {
    localStorage.setItem("token", null);
  }

  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordConfirmedControl(): FormControl {
    return this.registerForm.get('passwordConfirmed') as FormControl;
  }
}

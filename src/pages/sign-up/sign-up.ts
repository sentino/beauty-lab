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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild, Input } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AppVersion } from '@ionic-native/app-version';
import { MenuController } from 'ionic-angular';
import { trigger, transition, animate, style } from '@angular/animations';
import { App} from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ height: 0,
                  overflow: 'hidden' }),
          animate('500ms', style({ height: 'auto' }))
        ]),
        transition(':leave', [
          style({ height: 'auto' }),
          animate('500ms', style({ height: 0,overflow: 'hidden' }))
        ])
      ]
    )
  ],
})
export class SignUpPage {
  formData = {
    "email": '',                    // type string / required - email
    "password": '',                 // type string / required - пароль
    "passwordConfirmed": '',        // type string / required - повтор пароля
    "name": '',                     // type string / required - имя
    "lastName": '',                 // type string / required - фамилия
    "secondName": '',               // type string / option - отчество
    "birthday": '',                 // type string / option - день рождения
    "phone": '',                    // type string / option - телефон
    "addressZip": '',               // type string / option - индекс
    "addressCity": '',              // type string / option - город
    "addressStreet": '',             // type string / option - улица, адрес
    "customers_picture": '',
    "subscribe": 'true'
  };

  image;
  errorMessage = '';
  response;
  categoriesListIcon = 'add';
  categoriesLoginIcon = 'add';
  ProfileList = false;
  masks: any;
  pass_validation;
  email_validation;
  maxDate;

  pass_counter;
  confirm_counter;

  phoneNumber: any = "";
  public mask = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  
  public data_mask = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];

  public zip = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(
    public http: Http,
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
    this.maxDate = new Date().toISOString();

    this.pass_counter = this.formData.password.length;
    this.confirm_counter = this.formData.passwordConfirmed.length;
  }

@ViewChild('datePicker') datePicker;

  signUp() {
    
    this.errorMessage = '';
    this.formData.customers_picture = this.image;
    var RegData = new FormData();

    RegData.append('email', this.formData.email);
    RegData.append('password', this.formData.password);
    RegData.append('passwordConfirmed', this.formData.passwordConfirmed);
    RegData.append('name', this.formData.name);
    RegData.append('lastName', this.formData.lastName);
    RegData.append('secondName', this.formData.secondName);
    RegData.append('birthday', this.formData.birthday);
    RegData.append('phone', this.formData.phone);
    RegData.append('addressZip', this.formData.addressZip);
    RegData.append('addressCity', this.formData.addressCity);
    RegData.append('addressStreet', this.formData.addressStreet);
    RegData.append('subscribe', this.formData.subscribe);
    
    if(this.formData.password === this.formData.passwordConfirmed){
      this.loading.show();
      this.pass_validation = true;
      this.http.post(this.config.url + 'auth/register/', RegData).map(res => res.json()).subscribe(data => {
        this.loading.hide();
        this.response = data;
  
        if(this.response.result.error == 0){
          console.log("Ошибок нету"); 
          this.shared.userInfo(this.response.result);
          
          this.viewCtrl.dismiss();
          this.appCtrl.getRootNav().setRoot(HomePage);
          this.menuCtrl.close();
        }
  
  
  
        if(this.response.result.error == 1){
          console.log("Ошибочки"); 
          console.log(this.response.result.errorText);
          alert(this.response.result.errorText);
        }
  
      },
      err =>  { 
        this.loading.hide();
        console.log(err);
        this.email_validation = false;
        alert(JSON.parse(err._body).result.errorText);
      });
    }
    else{
      this.pass_validation = false;
      console.log("This pass validation:");
      console.log(this.pass_validation);
      alert("Пароли не совпадают!");
    }
  }

  
  showHideLoginList() {
    if (this.ProfileList == false) { this.ProfileList = true; this.categoriesLoginIcon = 'close'; }
    else { this.ProfileList = false; this.categoriesLoginIcon = 'add'; }
  }


  @ViewChild(Slides) slides: Slides;
  
  openPrivacyPolicyPage() {
    let modal = this.modalCtrl.create('PrivacyPolicyPage');
    modal.present();
  }
  openTermServicesPage() {
    let modal = this.modalCtrl.create('TermServicesPage');
    modal.present();
  }

  goToSlide() {   
     
    this.slides.lockSwipes(false);
    this.slides.slideTo(2, 500);
    this.slides.lockSwipes(true);
  }

  openRefundPolicyPage() {
    let modal = this.modalCtrl.create('RefundPolicyPage');
    modal.present();
  }
  dismiss() {
    this.navCtrl.push(LoginPage);
    this.viewCtrl.dismiss();
  }
  
  ngOnInit() {
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

  steps: string = "first";
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad SignUpPage');
  // }
}

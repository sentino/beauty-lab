import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PayPaylerService } from '../../services/pay-payler.service';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';


@Component({
  selector: 'confirm-order-container',
  animations: [
    trigger(
      'slideInOut', [
        state('in', style({
          width: '0'
        })),
        state('out', style({
          width: '100%'
        })),
        transition('in => out', animate('300ms ease-in-out')),
        transition('out => in', animate('300ms ease-in-out'))
      ]
    ),
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
  providers: [
    PayPaylerService
  ],
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>
          Подтверждение заказа
        </ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content class="confirm-order">
      <app-confirm-order-component
        *ngIf="form"
        [form]="form"  
      ></app-confirm-order-component>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
    `
})

export class ConfirmOrderContainer implements OnInit{

  form: FormGroup;

  constructor (
    private payPayler: PayPaylerService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      'listItemOne': this.fb.group({
        'region': ['', [Validators.required]],
        'city': ['', [Validators.required]]
      }),
      'listItemTwo': this.fb.group({
        'delivery': ['', [Validators.required]]
      })
    })
  }

  public ngOnInit(): void {

    this.payPayler.getData().subscribe((res) => {
      console.log(res);
    });
  }
}

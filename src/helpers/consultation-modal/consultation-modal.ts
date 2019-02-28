import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsultationService } from '../../services/consultation.service';
import { Unsubscriber } from '../unsubscriber';
import { AlertProvider } from '../../services/alert/alert';


@Component({
  selector: 'consultation-modal',
  template: `
    <div class="l-modal" style="overflow-y: auto;">
      <div class="l-modal" style="background: none;" (click)="close.emit()"></div>
      <div class="c-modal" style="z-index: 11;">
        <h2 class="c-modal__title" style="margin-top: 0;">
          Задайте вопрос специалисту
        </h2>
        <button class="c-modal__close" (click)="close.emit()"></button>

        <ion-list [formGroup]="form" *ngIf="addQuestionFields && addQuestionFields.length">
          <ion-item style=" border: none;
                            padding: 0;
                            background-color: white;"
                    *ngFor="let item of form.get('fields').controls; let i = index;">
            <ion-label color="secondary" floating [innerText]="returnValue(i)"></ion-label>
            
            <ion-input
              [formControl]="control(i)"
              *ngIf="fieldsType(i) === 'text'"
            ></ion-input>
            
            <ion-textarea
              [formControl]="control(i)"
              *ngIf="fieldsType(i) === 'textarea'"
              rows="1"
              style="
                width: calc(100% - 10px);
                border: 0;
                border-radius: 0;
                background: transparent;"
              #myTextArea
              id="myTextArea"
              (keyup)="resize()"
            ></ion-textarea>

            <ion-select
              [formControl]="control(i)"
              *ngIf="fieldsType(i) === 'select'">
              <ion-option *ngFor="let item of selectedId(i);"
                          value="{{item.id}}">{{item.name}}</ion-option>
            </ion-select>
          </ion-item>
        </ion-list>

        <button class="c-default-button c-default-button--resized" [disabled]="form.invalid" (click)="submit()">
          ОТПРАВИТЬ</button>
      </div>
    </div>
  `,
  providers: [ConsultationService]
})

export class ConsultationModal extends Unsubscriber implements OnInit, OnDestroy {
  @Input() specialistId;
  @Input() addQuestionFields;

  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('myTextArea') myTextArea: ElementRef;

  form: FormGroup;
  selectedArray = [];

  constructor(
    private fb: FormBuilder,
    private alert: AlertProvider,
    private consultationService: ConsultationService
  ) {
    super();
  }


  public ngOnInit(): void {
    this.form = this.fb.group({
      fields: this.fb.array([])
    });

    let fields = this.form.get('fields') as FormArray;

    if (this.addQuestionFields && this.addQuestionFields.length) {
      for (let i = 0; i < this.addQuestionFields.length; i++) {
        fields.push(this.createField(this.addQuestionFields[i]));

        if (this.addQuestionFields[i].CODE === 'EMAIL') {
          fields.get(`${i}`).get('value').setValidators([
            Validators.required,
            Validators.pattern("[A-Za-z0-9._%+-]{2,}@[a-zA-Z]{2,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")
          ]);
          fields.get(`${i}`).get('value').updateValueAndValidity();

        } else {
          fields.get(`${i}`).get('value').setValidators([
            Validators.required
          ]);
          fields.get(`${i}`).get('value').updateValueAndValidity();
        }
      }
    }
  }

  createField(value): FormGroup {
    if (value.TYPE === 'select' && value.VALUES && value.VALUES.length) {
      this.selectedArray.push({
        code: value.CODE,
        values: value.VALUES
      });
    }

    return this.fb.group({
      value: '',
      code: value.CODE,
      name: value.NAME,
      type: value.TYPE
    });

  }

  control(i): AbstractControl {
    return this.form.get('fields').get(`${i}`).get('value')
  }

  returnValue(i) {
    return "*" + this.form.get('fields').get(`${i}`).get('name').value;
  }

  fieldsType(i) {
    return this.form.get('fields').get(`${i}`).get('type').value;
  }

  selectedId(index) {
    for (let i = 0; i < this.selectedArray.length; i++) {
      if (this.selectedArray[i].code === this.form.get('fields').get(`${index}`).get('code').value) {
        return this.selectedArray[i].values;
      }
    }
    return [{name: '', id: 0}];
  }

  resize() {
    let element = this.myTextArea['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    let scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.myTextArea['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }

  returnControlValue(i, control) {
    return this.form.get('fields').get(`${i}`).get(control).value
  }

  submit() {
    let fields = this.form.get('fields') as FormArray;
    let obj: any = {
      "SPECIALIST": this.specialistId
    };

    for (let i = 0; i < fields.length; i++) {
      let name = this.returnControlValue(i, 'code');
      let value = this.returnControlValue(i, 'value');

      obj[name] = value;
    }

    this.wrapToUnsubscribe(this.consultationService.postQuestion(obj)).subscribe(res => {
      this.close.emit();
      this.alert.show(res.result.successText);
    }, error => {
      this.alert.show(error.error.result.errorText);
    });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

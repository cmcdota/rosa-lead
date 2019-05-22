import { Component, EventEmitter, ElementRef, HostListener, OnInit, Output, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'rosa-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent), // DI forwardRef link for not yet elements
    multi: true // many time usable
  }]
})
export class InputComponent implements OnInit, ControlValueAccessor {

  @Input()
  public placeholder: string = '';

  @Input()
  public tabindex: number = -1;

  @Input()
  public controlOptions: FormControl;

  @Input()
  public controlName: string;

  @Input()
  public required: boolean = false;
  @Input()
  public className: string = 'default';
  @Input()
  public dropControl: boolean = false;
  @Input()
  public isExist: boolean = false;
  @Input()
  public fieldModify: string = '';

  @Input()
  public autofocus: boolean = false;
  @Input()
  public value: string;

  public showPhone: boolean = false;
  public _value: any;
  public allowedMask: any = false;
  public maskPhone = ['(', /[1-9]/, /\d/, /\d/, ')', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskDigits = [/[1-9]/];

  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('click', ['$event'])
  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() === 'input') {
       this.focusEvent.emit(true);
      // this._elRef.nativeElement.querySelector('input').focus();
    }
  }

  public blurLost(e): void {
    this.blurEvent.emit(true);
  }

  public setDisabledState(isDisabled: boolean): void {
  };


  constructor(private _elRef: ElementRef) { }
  public propagateChange: any = () => {};


  public writeValue(val: any) {
    if (val) {
      this._value = val;
    }
  }

 public registerOnChange(val: any) {
   this.propagateChange = val;
   if (val) {
   this._value = val;
   }
 }

 public registerOnTouched(fn: () => void): void { }

  public onChange(event) {
     return this.propagateChange(event.target.value)
  //  this.propagateChange(event.target.value);
  }

 public ngOnInit(): void {

  switch (this.fieldModify) {
    case 'phone':
      this.allowedMask = this.maskPhone;
      break;
    case 's':  // if (x === 'value2')
      this.allowedMask = this.maskDigits;
      break;
    case 'date':
      this.allowedMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      break;
    default:
      this.allowedMask = false;
  }

  }

}

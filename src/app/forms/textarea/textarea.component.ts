import { Component, EventEmitter, ElementRef, HostListener, OnInit, Output, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'rosa-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent), // DI forwardRef link for not yet elements
    multi: true // many time usable
  }]
})
export class TextareaComponent implements OnInit, ControlValueAccessor {

  @Input()
  public tabindex: string = '-1';

  @Input()
  public controlOptions: FormControl;

  @Input()
  public message: {};

  @Input()
  public controlName: string;
  @Input()
  public required: boolean = false;
  @Input()
  public className: string = 'default';
  public _value: string;
  @Output() blurEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() focusEvent: EventEmitter<any> = new EventEmitter<any>();
  @HostListener('click', ['$event'])
  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() === 'input') {
       this.focusEvent.emit(true);
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
   this._value = val;

 }
 public registerOnTouched(fn: () => void): void { }

  public onChange(event) {
     return this.propagateChange(event.target.value)
  }
  ngOnInit() {
  }

}

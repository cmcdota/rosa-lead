import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'rosa-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit, AfterViewInit {
  @Input()
  public label: string = 'Labeled';

  @Input()
  public tabindex: number = -1;

  @ViewChild('checkBoxRef')
  public checkbox;

  public isChecked: boolean;

  @Output() ChangeEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public ngAfterViewInit(): void {
    console.log('ngaftview')
    console.log(this.checkbox.nativeElement.checked);
    this.isChecked = this.checkbox.nativeElement.checked;
  }
  public clicked() {
    this.isChecked = !this.isChecked;
    console.log(this.isChecked);
    return this.ChangeEvent.emit(this.isChecked);
  }

  ngOnInit() {

  }

}

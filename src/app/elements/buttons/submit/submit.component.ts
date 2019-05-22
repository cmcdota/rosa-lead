import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'rosa-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  @Input() className: string = 'default';
  @Input() type: string = 'button';
  @Input() disabled: boolean  = false;
  @Input() content: string = 'Отправить';
  @Output() ClickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public ngOnInit(): void {

  }
}

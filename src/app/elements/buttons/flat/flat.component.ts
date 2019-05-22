import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'rosa-button-flat',
  templateUrl: './flat.component.html',
  styleUrls: ['./flat.component.scss']
})

export class FlatComponent implements OnInit {
  @Input() className: string = 'default';
  @Input() type: string = 'button';
  @Input() disabled: boolean  = false;
  @Input() content: string = 'Создать';
  @Output() ClickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public ngOnInit(): void {

  }
}

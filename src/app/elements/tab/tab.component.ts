import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'rosa-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  @Input() className: string = 'default';
  @Input() disabled: boolean  = false;
  @Input() content: string = 'Пункт';
  @Output() ClickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public ngOnInit(): void {

  }
}

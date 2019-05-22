import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rosa-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input()
  public header: string;
  @Input()
  public content: string = 'название элемента';
  @Input()
  public classList: string;
  @Input()
  public tabindex: number = -1;
  @Input()
  public helperContent: number = 0;

  @Output() ClickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}

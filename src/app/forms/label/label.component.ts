import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rosa-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input()
  public value: string

  @Input()
  public disabled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}

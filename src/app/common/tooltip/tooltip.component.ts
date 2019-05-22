import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rosa-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input()
  public innerContent: string;

  constructor() { }

  ngOnInit() {

  }

}

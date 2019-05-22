import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rosa-label-helper',
  templateUrl: './label-helper.component.html',
  styleUrls: ['./label-helper.component.scss']
})
export class LabelHelperComponent implements OnInit {
  @Input()
  public helperContent: string;
  public t: boolean  = false;
  constructor() { }

  ngOnInit() {
  }

}

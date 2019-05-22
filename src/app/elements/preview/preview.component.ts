import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rosa-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @Input()
  public header: string = 'Заголовок секции';
  @Input()
  public content: string = 'Значение секции';
  @Input()
  public contentAdd: string;
  constructor() { }

  ngOnInit() {
  }

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'rosa-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss']
})
export class HelperComponent {
  @Input()
  public message: string = 'сообщение';
  @Input()
  public type: string = 'default';
}

import { Component, OnInit, Input } from '@angular/core';
import { Lead } from './../../models/lead.model';

@Component({
  selector: 'rosa-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input()
  public lead: Lead;

  constructor() { }

  ngOnInit() {
  }

}

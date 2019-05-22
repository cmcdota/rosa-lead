import { Component, OnInit } from '@angular/core';
import { LeadService } from './../../services/lead.service';
import { Lead } from './../../models/lead.model';
import { Observable } from 'rxjs/Observable'
@Component({
  selector: 'rosa-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public leads$: Lead[];

  constructor(
    private _leadService: LeadService,
  ) { }
  public tab: number = 1;
  public setTab(value, e): void {
  e.preventDefault();
  this.tab = value;
}
public updateCards(val) {
  this.leads$ = [];
  this._leadService.getLeads().subscribe(data => {
    console.log('updates');
    this.leads$ = data;
  });
}

  ngOnInit() {
    this.updateCards(true);
  }

}

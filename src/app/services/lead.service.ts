import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpHeaders  } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Lead } from './../models/lead.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/delay';

@Injectable()
export class LeadService {
  public _leads: Observable<Lead[]>;

  constructor(private _http: HttpClient) { }

  public getLeads(): Observable<Lead[]> {
    console.log('getleads');
  //  if(!this._leads){
    //return this._http.get(`http://eclecticagency.ru/leads.json`)
    return this._http.get(`${environment.getLeads}`)
    .map((res: HttpResponse<any>) => { console.log(`res leads ${res}`);  return (<any>res).data});
  }
}

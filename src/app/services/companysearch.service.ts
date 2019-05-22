import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Company } from './../models/company.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()

export class CompanysearchService {
  constructor(
    private _http: HttpClient,
    @Inject('API_KEY') private _apiKey: string,
    @Inject('API_URL') private _apiUrl: string) { }

  public searchDadata(query: string): Observable<any[]> {
    // tslint:disable-next-line:max-line-length
    const _headers = new HttpHeaders({ 'Content-type': 'application/json; charset = UTF-8', 'Accept': 'application/json', 'Authorization': `Token ${this._apiKey}` });
    const _params = new HttpParams();
    const queryData = JSON.stringify({
      'query': query,
      'count': '5'
    });

    return this._http.post(this._apiUrl, queryData, { headers: _headers })
      .map((res: HttpResponse<Company[]>) => {
        return (<any>res).suggestions.map(item => {
          return item;
        });
      })
  };


  public checkCompany(type: string, tax: any): Observable<any> {
  const _headers = new HttpHeaders({'Content-type': 'application/json, charset = UTF-8'});
  const queryData = JSON.stringify({
    'method': 'check_exists',
    'inn': tax,
    'type': type,
  });

  return this._http.post(`${environment.checkLead}`, queryData, {headers: _headers});
}


  // сделать проверку dadata
  public checkDadata(): any {
    const _headers = new HttpHeaders();
    _headers.append('Content-type', 'application/json; charset = UTF-8');
    _headers.append('Accept', 'application/json');
    _headers.append('Authorization', `Token ${this._apiKey}`);
    const queryData = JSON.stringify({
      'query': 'Росбанк',
      'count': '1'
    });

    return this._http.post(this._apiUrl, queryData, { headers: _headers })
      .map((res: HttpResponse<Company>) => {
        return res;
      })
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
@Injectable()
export class OfficesearchService {

  constructor(private _http: HttpClient) {}

  public searchOffice(query: string): Observable<any> {
    console.log(query);
    const _headers = new HttpHeaders({'Content-type': 'application/json, charset = UTF-8'});
    const queryData = JSON.stringify({
      'method': 'find_do',
      'query': query
    });
    return this._http.post(`${environment.getOffices}`, queryData, {headers: _headers});
}

}


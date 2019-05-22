import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class ManagersearchService {

constructor(private _http: HttpClient) {}
  public searchUsers(query: string, type: string, productId: string, isCorporate: string = '0'): Observable<any> {
    const _headers = new HttpHeaders({'Content-type': 'application/json, charset = UTF-8'});
    const queryData = JSON.stringify({
      'method': 'users_do',
      'do': query,
      'type': type,
      'isCorporate': isCorporate,
      'product_id': productId
    });
    return this._http.post(`${environment.getUsers}`, queryData, {headers: _headers})
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class ProductsearchService {

  constructor(private _http: HttpClient) { }

  public searchProducts(query: string): Observable<any> {
    const _headers = new HttpHeaders({ 'Content-type': 'application/json, charset = UTF-8' });
    const queryData = JSON.stringify({
      'method': 'get_products',
      'query': query
    });
    return this._http.post(`${environment.getPro}`, queryData, { headers: _headers })
      .map((res: any[]) => {
        return (<any>res).data.map(item => {
          console.log(item);
          return item;
        })
      })
  }
}

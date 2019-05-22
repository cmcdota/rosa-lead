import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'ngx-auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticateService implements AuthService {

  constructor(private _http: HttpClient) { }

  public isAuthorized(): Observable<boolean> {
    const checkToken: boolean = !!localStorage.getItem('accessToken');
    Observable.of(checkToken).subscribe(data => console.log(data));
    return Observable.of(checkToken);
  }
  public TokenGenerator() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  public loadToken(): Promise<any> {
    let _headers = new HttpHeaders({ 'Cache-control': 'no-cache', 'Expires': '0', 'Pragma': 'no-cache' });
    return this._http.get(`${environment.getAuth}`, { headers: _headers })
      .map((response: HttpResponse<any>) => (<any>response))
      .toPromise()
      .then(data => {
        console.log(data);
        const newToken = this.TokenGenerator();
        console.log(data.login);
        console.log(`setting token in progress`);
        localStorage.clear();
        this.setToken(newToken, data.login, data.rb, data.email_outlook, data.branch, data.rbstaff.bLocation, data.rbstaff.filial, data.full_name, data.rbstaff.bPhoto);
        //  this._notify.success(`Авторизация прошла успешно`);

        return data;
      })
      .catch(error => {
        localStorage.clear();
        console.log(error);
        ///   this._notify.error(`При авторизации произошла ошибка ${error}`);
        return error;
      }
      )
  }
  public getAccessToken(): Observable<string>{
    const accessToken: string = 'accessToken';
    return Observable.of(accessToken);
  }

  public getUserId(): Observable<string>{
    const userId: string = 'authRB';
    return Observable.of(userId);
  }

  public getUserName(): Observable<string>{
    const userName: string = 'fullName';
    return Observable.of(userName);
  }

  public refreshToken(): Observable<any> {
   const refreshToken: string = 'refreshToken';
   return this._http.get('refreshToken')
   //.catch(()=> this.logout());
 }

   public refreshShouldHappen(response: HttpErrorResponse): boolean{
     return response.status === 401;
   }

   public verifyTokenRequest(url:string): boolean {
     return url.endsWith('refresh-token');
   }
  public setToken(token, login, userId, email, branch, location, filial, fullname, bPhoto): void {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('authLogin', login);
    localStorage.setItem('authEmail', email);
    localStorage.setItem('branch', branch);
    localStorage.setItem('location', location);
    localStorage.setItem('filial', filial);
    localStorage.setItem('fullName', fullname);
    localStorage.setItem('avatar', bPhoto);
    console.log(`token is setted ${token}`)
  }
}



/*
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'ngx-auth';
import { Observable } from 'rxjs/Observable';
import { NotifyService } from './notify.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticateService implements AuthService {

  constructor(private _http: HttpClient, private _notify: NotifyService) { }

  public isAuthorized(): Observable<boolean> {
    const checkToken: boolean = !!localStorage.getItem('accessToken');
    Observable.of(checkToken).subscribe(data => console.log(data));
    return Observable.of(checkToken);
  }



  public TokenGenerator() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


  public getAccessToken(): Observable<string> {
    const accessToken: string = localStorage.getItem('accessToken');
    return Observable.of(accessToken);
  }

  public getUserId(): Observable<string> {
    const userId: string = localStorage.getItem('authRB');
    return Observable.of(userId);
  }

  public getUserName(): Observable<string> {
    const userName: string = localStorage.getItem('fullName');
    return Observable.of(userName);
  }

  public setToken(token, login, userId, email, branch, location, filial, fullname, bPhoto): void {

    localStorage.setItem('accessToken', token);
    console.log(`token ${token}`)

    localStorage.setItem('authLogin', login);
    console.log(`login ${login}`)

    localStorage.setItem('authEmail', email);
    console.log(`email ${email}`)

    localStorage.setItem('branch', branch);
    localStorage.setItem('location', location);

    localStorage.setItem('filial', filial);

    localStorage.setItem('fullName', fullname);

    localStorage.setItem('avatar', bPhoto);
    console.log(`token is setted ${token}`)
  }





  public refreshToken(): Observable<any> {
    const refreshToken: string = localStorage.getItem('refreshToken');
    return this._http.get(`${environment.getAuth}`)
  }

  public logout(): void {
    location.reload(true);
  }

  public login(): Observable<any> {
    return this._http.post(`${environment.getAuth}`, {})
      .do((tokens) => console.log(tokens));
  }


  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return response.status === 401;
  }

  public verifyTokenRequest(url: string): boolean {
    return url.endsWith('refresh-token');
  }
}
*/

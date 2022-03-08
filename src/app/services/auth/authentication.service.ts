import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountModel } from 'src/app/models/auth/account.model';
import { LoginModel } from 'src/app/models/auth/login.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly TOKEN = 'access_token';
  private readonly ACCOUNT = 'account';

  private readonly apiUrl = '/api/authentication';

  constructor(private http: HttpClient) { }
  
  login(loginModel: LoginModel): Observable<AccountModel> {
    return this.http.post<AccountModel>(`${this.apiUrl}/login`, loginModel)
        .pipe(map((responseObject: AccountModel) => {
          this.setUserData(responseObject);
          return responseObject;
        }));
  }

  logout() {
    return this.http.get(`${this.apiUrl}/logout`).pipe(map(v => {
      this.cleanUserData();
      return v;
    }));
  }

  getUserData(): AccountModel | null {
    const account = localStorage.getItem(this.ACCOUNT);    
    if (!account) return null;
    
    const userData: AccountModel = <AccountModel>JSON.parse(account);
    return userData;
  }

  isAuthorized(): Boolean {
    const userData = this.getUserData();
    if (!userData) {
      console.log("there is no user data");
      this.cleanUserData();
      return false;
    }

    const token = userData.token;
    if (!token) {
      console.log("there is no token");
      this.cleanUserData();
      return false;
    }

    const userDataStr = atob(token.substring(token.indexOf('.') + 1, token.lastIndexOf('.')));
    const tokenData = JSON.parse(userDataStr);

    const isExpired = moment() < moment(tokenData.exp);
    if (isExpired) {
      console.log("your token expired");
      this.cleanUserData();
    }
    return userData !== null && !isExpired;
  }

  private setUserData(responseObject: AccountModel) {
    localStorage.setItem(this.TOKEN, responseObject.token!);
    localStorage.setItem(this.ACCOUNT, JSON.stringify(responseObject));
  }

  private cleanUserData() {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.ACCOUNT);
  }
}

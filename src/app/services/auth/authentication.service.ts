import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountModel } from 'src/app/models/auth/account.model';
import { LoginModel } from 'src/app/models/auth/login.model';

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


  private setUserData(responseObject: AccountModel) {
    localStorage.setItem(this.TOKEN, responseObject.token!);
    localStorage.setItem(this.ACCOUNT, JSON.stringify(responseObject));
  }

  private cleanUserData() {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.ACCOUNT);
  }
}

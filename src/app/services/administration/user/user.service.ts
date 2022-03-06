import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationRequestModel } from 'src/app/models/administration/registration-request.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = '/api/user';

  constructor(private http: HttpClient) { }

  register(regRequestModel: RegistrationRequestModel) {
    return this.http.post<any>(`${this.apiUrl}/register`, regRequestModel);
  }
}

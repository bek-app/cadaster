import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationRequestModel } from 'src/app/models/administration/registration-request.model';
import { UserModel } from 'src/app/models/administration/user.model';
import { PagedSortRequestModel } from 'src/app/models/general/page-sort-request.model';
import { PagedResponseModel } from 'src/app/models/general/page-response.model';
import { QueryUtil } from 'src/app/utils/query.util';
import { Params } from '@angular/router';
import { DictionaryModel } from '@models/general/dic.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = '/api/user';

  constructor(private http: HttpClient) { }

  register(regRequestModel: RegistrationRequestModel) {
    return this.http.post<any>(`${this.apiUrl}/register`, regRequestModel);
  }

  getList(request: PagedSortRequestModel<any>) {
    let params : Params = {};
    params = QueryUtil.convertToQueryParams(request, params);
    return this.http.get<PagedResponseModel<UserModel>>(`${this.apiUrl}`,{
      params: params
    });
  }

  get(id: string) {    
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }

  getStatuses() {
    let params : Params = {};
    return this.http.get<PagedResponseModel<DictionaryModel>>(`${this.apiUrl}/statuses`,{
      params: params
    });
  }

  create(user: UserModel) {
    return this.http.post(`${this.apiUrl}`, user);
  }

  update(user: UserModel) {
    return this.http.put(`${this.apiUrl}`, user);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}`, {
      params: { userId: id }
    })
  }
}

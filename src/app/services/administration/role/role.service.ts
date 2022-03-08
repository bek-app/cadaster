import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoleModel } from '@models/administration/role.model';
import { PagedResponseModel } from '@models/general/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly apiUrl = '/api/role';

  constructor(private http: HttpClient) { }

  getList() {
    return this.http.get<PagedResponseModel<RoleModel>>(`${this.apiUrl}`);
  }
}

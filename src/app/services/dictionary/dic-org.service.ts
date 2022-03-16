import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
 import { DicOrganization } from '../../models/dictionary/dic-org.model';

@Injectable({
  providedIn: 'root',
})
export class DicOrganizationService {
  constructor(private http: HttpClient) { }
  private readonly apiUrl = '/api/DicOrganization';

  getDicOrganizationById(id: number): Observable<DicOrganization[]> {
    return this.http
      .get<DicOrganization[]>(`${this.apiUrl}?id=${id}`)
      .pipe(map((response) => response))
  }

  getDicOrganizations(discriminator: string): Observable<DicOrganization[]> {
    return this.http
      .get<DicOrganization[]>(`${this.apiUrl}/list?discriminator=${discriminator}`)
      .pipe(map((response) => response))
  }

}

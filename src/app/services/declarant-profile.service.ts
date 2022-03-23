import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeclarantProfileService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getDeclarantProfile(): Observable<any[]> {
    return this.http
      .get<any[]>('api/DeclarantProfile')
      .pipe(map((data: any) => data));
  }

  registerDeclarantProfile(data: any) {
    return this.http.put<any>(
      'api/DeclarantProfile/register',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

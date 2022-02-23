import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DicUnitService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };



  constructor(private http: HttpClient) {}

  getDicUnit(): Observable<any[]> {
    return this.http
      .get<any[]>('api/DicUnit')
      .pipe(map((response) => response));
  }

  addDicUnit(data: any): Observable<any> {
    return this.http.put<any>(
      'api/DicUnit',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

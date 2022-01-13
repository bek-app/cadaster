import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DicProductService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getDicProduct(): Observable<any[]> {
    return this.http
      .get<any[]>('api/DicProduct')
      .pipe(map((response) => response));
  }

  addDicProduct(data: any): Observable<any> {
    return this.http.put<any>(
      'api/DicProduct',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

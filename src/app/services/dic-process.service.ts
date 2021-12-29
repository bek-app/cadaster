import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DicProcessService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  getDicProcess(): Observable<Dictionary[]> {
    return this.http
      .get<any[]>('api/DicProcess')
      .pipe(map((response) => response));
  }
  addDicProcess(data: Dictionary): Observable<Dictionary> {
    return this.http.put<Dictionary>(
      'api/DicProcess',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

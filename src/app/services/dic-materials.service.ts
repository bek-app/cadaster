import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DicMaterialService {
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  getDicMaterial(): Observable<Dictionary[]> {
    return this.http
      .get<any[]>('api/DicMaterial')
      .pipe(map((response) => response));
  }
  addDicMaterial(data: Dictionary): Observable<Dictionary> {
    return this.http.put<Dictionary>(
      'api/DicMaterial',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DicKatoService {
  constructor(private http: HttpClient) {}

  getDicKato(id: number): Observable<any[]> {
    return this.http
      .get<any[]>('api/DicKato?parentId=' + id)
      .pipe(map((response) => response));
  }
}

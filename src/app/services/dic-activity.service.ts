import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DicActivityService {
  constructor(private http: HttpClient) {}

  getDicActivity(id: number): Observable<any[]> {
    return this.http
      .get<any[]>('api/DicActivity?parentId=' + id)
      .pipe(map((response) => response));
  }
}

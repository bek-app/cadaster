import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DicOkedService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = '/api/DicOked';

  getDicOked(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/treeList`)
      .pipe(map((response) => response));
  }


}

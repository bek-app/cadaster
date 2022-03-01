import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class DicActivityService {
  constructor(private http: HttpClient) {}
  getDicActivity(): Observable<any[]> {
    return this.http
      .get<any[]>('api/DicActivity')
      .pipe(map((response) => response))
  }
  getDicActivityByParentId(parentId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`api/DicActivity?parentId=${parentId}`)
      .pipe(map((response) => response))
  }
}

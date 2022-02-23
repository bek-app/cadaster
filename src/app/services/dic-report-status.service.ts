import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { Dictionary } from '../models/dictionary.model'

@Injectable({
  providedIn: 'root',
})
export class DicReportStatusService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  }

  constructor(private http: HttpClient) {}

  getDicReportStatus(): Observable<any[]> {
    return this.http
      .get<any[]>('api/DicReportStatus/checkList')
      .pipe(map((response) => response))
  }

  // addDicReportStatus(data: any): Observable<any> {
  //   return this.http.put<any>(
  //     'api/DicReportStatus',
  //     JSON.stringify(data),
  //     this.httpOptions,
  //   )
  // }
}

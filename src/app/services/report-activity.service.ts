import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { ReportActivityModel } from '../models/report-activity.model'

@Injectable({
  providedIn: 'root',
})
export class ReportActivityService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  }

  constructor(private http: HttpClient) {}

  getReportActivityById(reportId: number): Observable<ReportActivityModel[]> {
    return this.http
      .get<ReportActivityModel[]>(
        `api/KdrReportActivity/list?reportId=${reportId}`,
      )
      .pipe(map((data: any) => data))
  }
  addReportActivity(data: any) {
    return this.http.put<any>(
      'api/KdrReportActivity',
      JSON.stringify(data),
      this.httpOptions,
    )
  }
}

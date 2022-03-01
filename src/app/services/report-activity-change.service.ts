import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ReportActivityChangeModel } from '../models/report-activity-change.model'
import { map, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ReportActivityChangeService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  }

  constructor(private http: HttpClient) {}

  getReportActivityChangeById(
    id: number,
  ): Observable<ReportActivityChangeModel[]> {
    return this.http
      .get<ReportActivityChangeModel[]>(
        `api/KdrReportActivityChange/getById?id=${id}`,
      )
      .pipe(map((data: any) => data))
  }

  getReportActivityChangeList(
    reportId: number,
  ): Observable<ReportActivityChangeModel[]> {
    return this.http
      .get<ReportActivityChangeModel[]>(
        `api/KdrReportActivityChange/list?reportId=${reportId}`,
      )
      .pipe(map((response) => response))
  }

  addReportActivityChange(
    data: ReportActivityChangeModel,
  ): Observable<ReportActivityChangeModel> {
    return this.http.put<ReportActivityChangeModel>(
      'api/KdrReportActivityChange',
      JSON.stringify(data),
      this.httpOptions,
    )
  }

  updateReportActivityChange(
    data: ReportActivityChangeModel,
  ): Observable<ReportActivityChangeModel> {
    return this.http.put<ReportActivityChangeModel>(
      'api/KdrReportActivityChange',
      JSON.stringify(data),
      this.httpOptions,
    )
  }

  deleteReportActivityChange(
    id: number,
  ): Observable<ReportActivityChangeModel> {
    return this.http.delete<ReportActivityChangeModel>(
      'api/KdrReportActivityChange?id=' + id,
    )
  }
}

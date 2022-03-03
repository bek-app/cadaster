import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReportPlanModel } from '@models/report-plan.model'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ReportPlanService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  }

  constructor(private http: HttpClient) {}

  getReportPlanById(id: number): Observable<ReportPlanModel[]> {
    return this.http
      .get<ReportPlanModel[]>('api/KdrReportPlan/getById?id=' + id)
      .pipe(map((data: any) => data))
  }

  getReportPlanByReportId(reportId: number): Observable<ReportPlanModel[]> {
    return this.http
      .get<ReportPlanModel[]>('api/KdrReportPlan/list?reportId=' + reportId)
      .pipe(map((data: any) => data))
  }

  getReportPlanProcessesByReportId(
    reportId: number,
  ): Observable<ReportPlanModel[]> {
    return this.http
      .get<ReportPlanModel[]>(
        'api/KdrReportPlan/processes?reportId=' + reportId,
      )
      .pipe(map((data: any) => data))
  }

  addReportPlan(data: any) {
    return this.http.put<any>(
      'api/KdrReportPlan',
      JSON.stringify(data),
      this.httpOptions,
    )
  }

  updateReportPlan(data: any) {
    return this.http.put<any>(
      'api/KdrReportPlan',
      JSON.stringify(data),
      this.httpOptions,
    )
  }

  deleteReportPlan(id: number): Observable<ReportPlanModel[]> {
    return this.http.delete<any>('api/KdrReportPlan?id=' + id)
  }
}

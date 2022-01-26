import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportCommentModel } from '../models/report-comment.model';
 @Injectable({
  providedIn: 'root',
})
export class ReportCommentService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getReportCommentById(reportId: number): Observable<ReportCommentModel[]> {
    return this.http
      .get<ReportCommentModel[]>(
        'api/KdrReportComment/list?reportId=' + reportId
      )
      .pipe(map((data: any) => data));
  }
  addReportComment(data: any) {
    return this.http.put<any>(
      'api/KdrReportComment',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

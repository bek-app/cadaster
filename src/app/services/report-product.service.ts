import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportProductModel } from '../models/report-product.model';

@Injectable({
  providedIn: 'root',
})
export class ReportProductService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getReportProductById(reportId: number): Observable<ReportProductModel[]> {
    return this.http
      .get<ReportProductModel[]>(
        'api/KdrReportProduct/list?reportId=' + reportId
      )
      .pipe(map((data: any) => data));
  }
  addReportProduct(data: any) {
    return this.http.put<any>(
      'api/KdrReportProduct',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportCarbonUnitModel } from '@models/report-carbon-unit.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportCarbonUnitService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getReportCarbonUnitById(
    reportId: number
  ): Observable<ReportCarbonUnitModel[]> {
    return this.http
      .get<ReportCarbonUnitModel[]>(
        `api/KdrReportCarbonUnit/list?reportId=${reportId}`
      )
      .pipe(map((data: any) => data));
  }

  getReportCarbonUnitSimpleByReportId(
    reportId: number
  ): Observable<ReportCarbonUnitModel[]> {
    return this.http
      .get<ReportCarbonUnitModel[]>(
        `api/KdrReportCarbonSimple/list?reportId=${reportId}`
      )
      .pipe(map((data: any) => data));
  }

  addReportCarbonUnit(data: any) {
    return this.http.put<any>(
      'api/KdrReportCarbonUnit',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

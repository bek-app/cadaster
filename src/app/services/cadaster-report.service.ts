import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CadasterReportModel } from '../models/cadaster-report.model';

@Injectable({
  providedIn: 'root',
})
export class CadasterReportService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getCadasterReportById(id: number): Observable<CadasterReportModel[]> {
    return this.http
      .get<CadasterReportModel[]>('api/KdrReport?id=' + id)
      .pipe(
        map((data: any) => data),
        catchError((error) => {
          return throwError('Its a Trap!');
        })
      );
  }

  getCadasterReportList(id: number): Observable<CadasterReportModel[]> {
    return this.http
      .get<CadasterReportModel[]>('api/KdrReport/list?userId=' + id)
      .pipe(map((response) => response));
  }

  addCadasterReport(
    data: CadasterReportModel
  ): Observable<CadasterReportModel> {
    return this.http.put<CadasterReportModel>(
      'api/KdrReport',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateCadasterReport(
    data: CadasterReportModel
  ): Observable<CadasterReportModel> {
    return this.http.put<CadasterReportModel>(
      'api/KdrReport',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteCadasterReport(id: number): Observable<CadasterReportModel> {
    return this.http.delete<CadasterReportModel>('api/KdrReport?id=' + id);
  }
}

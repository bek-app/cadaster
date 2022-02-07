import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParameterCalc } from '../models/parameter-calc.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterCalcService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  
  constructor(private http: HttpClient) {}

  getParameterCalcById(reportId: number): Observable<ParameterCalc[]> {
    return this.http
      .get<ParameterCalc[]>(
        'api/KdrReportParameterCalc/list?reportId=' + reportId
      )
      .pipe(map((data: any) => data));
  }
  addParameterCalc(data: any) {
    return this.http.put<any>(
      'api/KdrReportParameterCalc',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

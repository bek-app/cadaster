import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParameterGasModel } from '../models/parameter-gas.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterGasService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getParameterGasById(reportId: number): Observable<ParameterGasModel[]> {
    return this.http
      .get<ParameterGasModel[]>(
        'api/KdrReportParameterGas/list?reportId=' + reportId
      )
      .pipe(map((data: any) => data));
  }
  addParameterGas(data: any) {
    return this.http.put<any>(
      'api/KdrReportParameterGas',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParameterKoefModel } from '../models/parameter-koef.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterKoefService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getParameterKoefById(reportId: number): Observable<ParameterKoefModel[]> {
    return this.http
      .get<ParameterKoefModel[]>(
        'api/KdrReportParameterKoef/list?reportId=' + reportId
      )
      .pipe(map((data: any) => data));
  }
  addParameterKoef(data: any) {
    return this.http.put<any>(
      'api/KdrReportParameterKoef',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

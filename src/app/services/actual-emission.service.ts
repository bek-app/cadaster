import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ActualEmissionService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getActualEmissionById(reportId: number): Observable<any[]> {
    return this.http
      .get<any[]>('api/KdrReportActualEmission/list?reportId=' + reportId)
      .pipe(map((data: any) => data));
  }
  addActualEmission(data: any) {
    return this.http.put<any>(
      'api/KdrReportActualEmission',
      JSON.stringify(data),
      this.httpOptions
    );
  }
}

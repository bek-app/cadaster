import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CadasterReportModel } from '@models/cadaster-report.model';

@Injectable({
  providedIn: 'root',
})
export class CadasterReportService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };
  private readonly apiUrl = 'api/KdrReport';

  constructor(private http: HttpClient) {}

  getCadasterReportById(id: number): Observable<CadasterReportModel[]> {
    return this.http
      .get<CadasterReportModel[]>(`${this.apiUrl}?id=${id}`)
      .pipe(map((data: any) => data));
  }

  getCdrReportPlant(
    userId: number,
    year: number
  ): Observable<CadasterReportModel[]> {
    return this.http
      .get<CadasterReportModel[]>(
        `${this.apiUrl}/plants?userId=${userId}&year=${year}`
      )
      .pipe(map((response) => response));
  }

  getCadasterReportList(id: number): Observable<CadasterReportModel[]> {
    return this.http
      .get<CadasterReportModel[]>(`${this.apiUrl}/list?userId=${id}`)
      .pipe(map((response) => response));
  }

  changeReportStatus(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/changeStatus`,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  addCadasterReport(
    data: CadasterReportModel
  ): Observable<CadasterReportModel> {
    return this.http.put<CadasterReportModel>(
      `${this.apiUrl}`,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateCadasterReport(
    data: CadasterReportModel
  ): Observable<CadasterReportModel> {
    return this.http.put<CadasterReportModel>(
      `${this.apiUrl}`,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updateFieldCadasterReport(data: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/updatefield`,
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deleteCadasterReport(id: number): Observable<CadasterReportModel> {
    return this.http.delete<CadasterReportModel>(`${this.apiUrl}?id=${id}`);
  }

  getReportXml(id: number) {
    return this.http.get<any>(`${this.apiUrl}/xml/${id}`);
  }
}

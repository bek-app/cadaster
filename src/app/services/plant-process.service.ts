import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PlantProcessModel } from '../models/plant-process.model ';

@Injectable({
  providedIn: 'root',
})
export class PlantProcessService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getPlantProcessById(id: number): Observable<PlantProcessModel[]> {
    return this.http.get<PlantProcessModel[]>('api/PlantProcess?id=' + id).pipe(
      map((data: any) => data),
      catchError((error) => {
        return throwError('Its a Trap!');
      })
    );
  }

  getPlantProcessList(id: number): Observable<PlantProcessModel[]> {
    return this.http
      .get<PlantProcessModel[]>('api/PlantProcess/list?plantId=' + id)
      .pipe(map((response) => response));
  }

  addPlantProcess(data: PlantProcessModel): Observable<PlantProcessModel> {
    return this.http.put<PlantProcessModel>(
      'api/PlantProcess',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updatePlantProcess(data: PlantProcessModel): Observable<PlantProcessModel> {
    return this.http.put<PlantProcessModel>(
      'api/PlantProcess',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deletePlantProcess(id: number): Observable<PlantProcessModel> {
    return this.http.delete<PlantProcessModel>('api/PlantProcess?id=' + id);
  }
}

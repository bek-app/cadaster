import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PlantSourceModel } from '../models/plant-source.model';

@Injectable({
  providedIn: 'root',
})
export class PlantSourceService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getPlantSourceById(id: number): Observable<PlantSourceModel[]> {
    return this.http.get<PlantSourceModel[]>('api/PlantSource?id=' + id).pipe(
      map((data: any) => data),
      catchError((error) => {
        return throwError('Its a Trap!');
      })
    );
  }

  getPlantSourceList(id: number): Observable<PlantSourceModel[]> {
    return this.http
      .get<PlantSourceModel[]>('api/PlantSource/list?plantId=' + id)
      .pipe(map((response) => response));
  }

  addPlantSource(data: PlantSourceModel): Observable<PlantSourceModel> {
    return this.http.put<PlantSourceModel>(
      'api/PlantSource',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updatePlantSource(data: PlantSourceModel): Observable<PlantSourceModel> {
    return this.http.put<PlantSourceModel>(
      'api/PlantSource',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deletePlantSource(id: number): Observable<PlantSourceModel> {
    return this.http.delete<PlantSourceModel>('api/PlantSource?id=' + id);
  }
}

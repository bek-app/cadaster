import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PlantSamplingModel } from '../models/plant-sampling.model';

@Injectable({
  providedIn: 'root',
})
export class PlantSamplingService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getPlantSamplingById(id: number): Observable<PlantSamplingModel[]> {
    return this.http
      .get<PlantSamplingModel[]>('api/PlantSampling?id=' + id)
      .pipe(
        map((data: any) => data),
        catchError((error) => {
          return throwError('Its a Trap!');
        })
      );
  }

  getPlantSamplingList(id: number): Observable<PlantSamplingModel[]> {
    return this.http
      .get<PlantSamplingModel[]>('api/PlantSampling/list?plantId=' + id)
      .pipe(map((response) => response));
  }

  addPlantSampling(data: PlantSamplingModel): Observable<PlantSamplingModel> {
    return this.http.put<PlantSamplingModel>(
      'api/PlantSampling',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updatePlantSampling(
    data: PlantSamplingModel
  ): Observable<PlantSamplingModel> {
    return this.http.put<PlantSamplingModel>(
      'api/PlantSampling',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deletePlantSampling(id: number): Observable<PlantSamplingModel> {
    return this.http.delete<PlantSamplingModel>('api/PlantSampling?id=' + id);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { PlantActivityModel } from '../models/plant-activity.model'

@Injectable({
  providedIn: 'root',
})
export class PlantActivityService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  }

  constructor(private http: HttpClient) {}

  getPlantActivityById(id: number): Observable<PlantActivityModel[]> {
    return this.http
      .get<PlantActivityModel[]>('api/PlantActivity?id=' + id)
      .pipe(map((data: any) => data))
  }

  getPlantActivityList(id: number): Observable<PlantActivityModel[]> {
    return this.http
      .get<PlantActivityModel[]>('api/PlantActivity/list?plantId=' + id)
      .pipe(map((response) => response))
  }

  addPlantActivity(data: PlantActivityModel): Observable<PlantActivityModel> {
    return this.http.put<PlantActivityModel>(
      'api/PlantActivity',
      JSON.stringify(data),
      this.httpOptions,
    )
  }

  updatePlantActivity(
    data: PlantActivityModel,
  ): Observable<PlantActivityModel> {
    return this.http.put<PlantActivityModel>(
      'api/PlantActivity',
      JSON.stringify(data),
      this.httpOptions,
    )
  }

  deletePlantActivity(id: number): Observable<PlantActivityModel> {
    return this.http.delete<PlantActivityModel>('api/PlantActivity?id=' + id)
  }
}

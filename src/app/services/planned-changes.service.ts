import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { PlannedChangesModel } from '../models/plant-planned-changes.model'

@Injectable({
  providedIn: 'root',
})
export class PlannedChangesService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  }

  constructor(private http: HttpClient) {}

  getPlannedChangesById(id: number): Observable<PlannedChangesModel[]> {
    return this.http
      .get<PlannedChangesModel[]>('api/PlantChangePlan?id=' + id)
      .pipe(map((data: any) => data))
  }

  getPlannedChangesList(id: number): Observable<PlannedChangesModel[]> {
    return this.http
      .get<PlannedChangesModel[]>('api/PlantChangePlan/list?plantId=' + id)
      .pipe(map((response) => response))
  }

  addPlannedChanges(
    data: PlannedChangesModel,
  ): Observable<PlannedChangesModel> {
    return this.http.put<PlannedChangesModel>(
      'api/PlantChangePlan',
      JSON.stringify(data),
      this.httpOptions,
    )
  }

  updatePlannedChanges(
    data: PlannedChangesModel,
  ): Observable<PlannedChangesModel> {
    return this.http.put<PlannedChangesModel>(
      'api/PlantChangePlan',
      JSON.stringify(data),
      this.httpOptions,
    )
  }

  deletePlannedChanges(id: number): Observable<PlannedChangesModel> {
    return this.http.delete<PlannedChangesModel>('api/PlantChangePlan?id=' + id)
  }
}

import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PlantModel } from '../models/plant.model';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  plantIdRefreshList = new Subject();
  constructor(private http: HttpClient) {}

 
  getPlantById(id: number): Observable<PlantModel[]> {
    return this.http.get<PlantModel[]>('api/Plant?id=' + id).pipe(
      map((data: any) => data),
      catchError((error) => {
        return throwError('Its a Trap!');
      })
    );
  }

  getPlantList(id: number): Observable<PlantModel[]> {
    return this.http
      .get<PlantModel[]>('api/Plant/list?userId=' + id)
      .pipe(map((response) => response));
  }

  addPlant(data: PlantModel): Observable<PlantModel> {
    return this.http.put<PlantModel>(
      'api/Plant',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updatePlant(data: PlantModel): Observable<PlantModel> {
    return this.http.put<PlantModel>(
      'api/Plant',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deletePlant(id: number): Observable<PlantModel> {
    return this.http.delete<PlantModel>('api/Plant?id=' + id);
  }
}

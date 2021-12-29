import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PlantDeviceModel } from '../models/plant-device.model';

@Injectable({
  providedIn: 'root',
})
export class PlantDeviceService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getPlantDeviceById(id: number): Observable<PlantDeviceModel[]> {
    return this.http.get<PlantDeviceModel[]>('api/PlantDevice?id=' + id).pipe(
      map((data: any) => data),
      catchError((error) => {
        return throwError('Its a Trap!');
      })
    );
  }

  getPlantDeviceList(id: number): Observable<PlantDeviceModel[]> {
    return this.http
      .get<PlantDeviceModel[]>('api/PlantDevice/list?plantId=' + id)
      .pipe(map((response) => response));
  }

  addPlantDevice(data: PlantDeviceModel): Observable<PlantDeviceModel> {
    return this.http.put<PlantDeviceModel>(
      'api/PlantDevice',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updatePlantDevice(data: PlantDeviceModel): Observable<PlantDeviceModel> {
    return this.http.put<PlantDeviceModel>(
      'api/PlantDevice',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deletePlantDevice(id: number): Observable<PlantDeviceModel> {
    return this.http.delete<PlantDeviceModel>('api/PlantDevice?id=' + id);
  }
}

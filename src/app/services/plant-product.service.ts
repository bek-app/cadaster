import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PlantProductModel } from '../models/plant-product.model';

@Injectable({
  providedIn: 'root',
})
export class PlantProductService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  constructor(private http: HttpClient) {}

  getPlantProductById(id: number): Observable<PlantProductModel[]> {
    return this.http.get<PlantProductModel[]>('api/PlantProduct?id=' + id).pipe(
      map((data: any) => data),
      catchError((error) => {
        return throwError('Its a Trap!');
      })
    );
  }

  getPlantProductList(id: number): Observable<PlantProductModel[]> {
    return this.http
      .get<PlantProductModel[]>('api/PlantProduct/list?plantId=' + id)
      .pipe(map((response) => response));
  }

  addPlantProduct(data: PlantProductModel): Observable<PlantProductModel> {
    return this.http.put<PlantProductModel>(
      'api/PlantProduct',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  updatePlantProduct(data: PlantProductModel): Observable<PlantProductModel> {
    return this.http.put<PlantProductModel>(
      'api/PlantProduct',
      JSON.stringify(data),
      this.httpOptions
    );
  }

  deletePlantProduct(id: number): Observable<PlantProductModel> {
    return this.http.delete<PlantProductModel>('api/PlantProduct?id=' + id);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { DicUnitService } from './dic-unit.service';

@Injectable({
  providedIn: 'root',
})
export class DicUnitResolver implements Resolve<any> {
  constructor(
    private http: HttpClient,
    private dicUnitService: DicUnitService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.dicUnitService.getDicUnit().pipe(
      map((response) => response),
      catchError((error) => {
        return of('No data');
      })
    );
  }
}

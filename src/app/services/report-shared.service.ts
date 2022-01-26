import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportSharedService {
  editMode = new Subject();
  private messageSource = new Subject<any>();

  constructor(private route: Router) {}

  public getMessage(): Observable<any> {
    return this.messageSource.asObservable();
  }

  public setMessage(message: any) {
    return this.messageSource.next(message);
  }
}

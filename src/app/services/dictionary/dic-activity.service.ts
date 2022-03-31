import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Dictionary } from '@models/dictionary.model';

@Injectable({
  providedIn: 'root',
})
export class DicActivityService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = '/api/DicActivity';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8 ',
    }),
  };

  getDicActivity(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response) => response),
      catchError(this.handleError<Dictionary[]>('getDicActivity', []))
    );
  }

  getDicActivityByParentId(parentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?parentId=${parentId}`).pipe(
      map((response) => response),
      catchError(this.handleError<Dictionary[]>('getDicActivityByParentId', []))
    );
  }

  addDicActivity(data: Dictionary): Observable<Dictionary> {
    return this.http
      .put<Dictionary>(this.apiUrl, JSON.stringify(data), this.httpOptions)
      .pipe(
        tap((data: Dictionary) => this.log(`addDicActivity id=${data.id}`)),
        catchError(this.handleError<Dictionary>('addDicActivity'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error}`);
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}

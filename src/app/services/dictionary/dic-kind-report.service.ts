import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Dictionary } from '@models/dictionary.model'

@Injectable({
  providedIn: 'root',
})
export class DicKindReportService {
  constructor(private http: HttpClient) {}

  getDicKindReport(): Observable<Dictionary[]> {
    return this.http
      .get<Dictionary[]>('api/DicKindReport')
      .pipe(map((response) => response))
  }
}

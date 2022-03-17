import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignedDoc } from '@models/register/signed-doc.model';

@Injectable({
  providedIn: 'root'
})
export class SigndocService {
  private readonly apiUrl = '/api/signeddoc';
  constructor(private http: HttpClient) { }

  saveSignedDoc(entity: SignedDoc) {
    return this.http.post<SignedDoc>(`${this.apiUrl}`, entity);
  }

  getSignedDoc(id: string) {
    return this.http.get<SignedDoc>(`${this.apiUrl}/${id}`);
  }

  getSignedDocByEntityId(entityId: string) {
    return this.http.get<SignedDoc>(`${this.apiUrl}/entity/${entityId}`);
  }
}

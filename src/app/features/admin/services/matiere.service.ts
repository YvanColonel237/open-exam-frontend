// src/app/core/services/matiere.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Matiere } from 'src/app/models/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  private apiUrl = `${environment.apiUrl}/matieres`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de toutes les matières.
   */
  getAllMatieres(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.apiUrl);
  }

  /**
   * Récupère une matière par son code.
   */
  getMatiereByCode(code: string): Observable<Matiere> {
    return this.http.get<Matiere>(`${this.apiUrl}/${code}`);
  }

  /**
   * Crée une nouvelle matière.
   */
  createMatiere(matiere: Matiere): Observable<Matiere> {
    return this.http.post<Matiere>(this.apiUrl, matiere);
  }

  /**
   * Met à jour une matière existante.
   */
  updateMatiere(code: string, matiere: Matiere): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.apiUrl}/${code}`, matiere);
  }

  /**
   * Supprime une matière par son code.
   */
  deleteMatiere(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`);
  }
}

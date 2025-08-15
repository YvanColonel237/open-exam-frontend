// src/app/core/services/niveau.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Niveau } from 'src/app/models/niveau.model';

@Injectable({
  providedIn: 'root'
})
export class NiveauService {
  private apiUrl = `${environment.apiUrl}/niveaux`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de tous les niveaux.
   * @returns Un Observable de la liste des niveaux.
   */
  getAllNiveaux(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.apiUrl);
  }

  /**
   * Récupère un niveau par son ID.
   * @param id L'ID du niveau à récupérer.
   * @returns Un Observable du niveau.
   */
  getNiveauById(id: number): Observable<Niveau> {
    return this.http.get<Niveau>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau niveau.
   * @param niveau Les données du niveau à créer.
   * @returns Un Observable du niveau créé.
   */
  createNiveau(niveau: Niveau): Observable<Niveau> {
    return this.http.post<Niveau>(this.apiUrl, niveau);
  }

  /**
   * Met à jour un niveau existant.
   * @param id L'ID du niveau à mettre à jour.
   * @param niveau Les données du niveau à mettre à jour.
   * @returns Un Observable du niveau mis à jour.
   */
  updateNiveau(id: number, niveau: Niveau): Observable<Niveau> {
    return this.http.put<Niveau>(`${this.apiUrl}/${id}`, niveau);
  }

  /**
   * Supprime un niveau par son ID.
   * @param id L'ID du niveau à supprimer.
   * @returns Un Observable de type void.
   */
  deleteNiveau(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

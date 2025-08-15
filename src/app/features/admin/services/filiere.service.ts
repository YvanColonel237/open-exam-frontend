// src/app/core/services/filiere.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Filiere } from '../../../models/filiere.model';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {
  private apiUrl = `${environment.apiUrl}/filieres`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de toutes les filières.
   * @returns Un Observable de la liste des filières.
   */
  getAllFilieres(): Observable<Filiere[]> {
    return this.http.get<Filiere[]>(this.apiUrl);
  }

  /**
   * Récupère une filière par son ID.
   * @param id L'ID de la filière à récupérer.
   * @returns Un Observable de la filière.
   */
  getFiliereById(id: number): Observable<Filiere> {
    return this.http.get<Filiere>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée une nouvelle filière.
   * @param filiere Les données de la filière à créer.
   * @returns Un Observable de la filière créée.
   */
  createFiliere(filiere: Filiere): Observable<Filiere> {
    return this.http.post<Filiere>(this.apiUrl, filiere);
  }

  /**
   * Met à jour une filière existante.
   * @param id L'ID de la filière à mettre à jour.
   * @param filiere Les données de la filière à mettre à jour.
   * @returns Un Observable de la filière mise à jour.
   */
  updateFiliere(id: number, filiere: Filiere): Observable<Filiere> {
    return this.http.put<Filiere>(`${this.apiUrl}/${id}`, filiere);
  }

  /**
   * Supprime une filière par son ID.
   * @param id L'ID de la filière à supprimer.
   * @returns Un Observable de type void.
   */
  deleteFiliere(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

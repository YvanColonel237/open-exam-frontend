// src/app/features/admin/services/professeurs.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// L'interface pour la réponse du backend
export interface ProfesseurResponseDTO {
  idProfesseur: number;
  specialiteProfesseur: string;
  biographieProfesseur: string;
  statutProfesseur: string;
  idUtilisateur: number;
  emailConnexion: string;
  typeUtilisateur: string;
}

// L'interface pour la requête de mise à jour (ce que vous envoyez au backend)
export interface ProfesseurRequestDTO {
  specialiteProfesseur: string;
  biographieProfesseur: string;
  statutProfesseur: string;
}

// NOUVEAU : L'interface pour la requête de création (inclut l'email)
export interface ProfesseurCreateRequestDTO {
  email: string; // L'email est requis pour la création d'un nouvel utilisateur
  specialiteProfesseur: string;
  biographieProfesseur: string;
  statutProfesseur: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfesseursService {

  private apiBaseUrl = environment.apiUrl + '/professeurs';

  constructor(private http: HttpClient) { }

  getAllProfesseurs(): Observable<ProfesseurResponseDTO[]> {
    return this.http.get<ProfesseurResponseDTO[]>(this.apiBaseUrl);
  }

  getProfesseurById(id: number): Observable<ProfesseurResponseDTO> {
    return this.http.get<ProfesseurResponseDTO>(`${this.apiBaseUrl}/${id}`);
  }

  updateProfesseur(id: number, data: ProfesseurRequestDTO): Observable<ProfesseurResponseDTO> {
    return this.http.put<ProfesseurResponseDTO>(`${this.apiBaseUrl}/${id}`, data);
  }

  deleteProfesseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`);
  }

  // NOUVEAU : Méthode pour créer un professeur
  createProfesseur(data: ProfesseurCreateRequestDTO): Observable<any> {
    return this.http.post<any>(this.apiBaseUrl, data);
  }
}

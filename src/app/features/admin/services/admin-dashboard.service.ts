import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Ce modèle représente les données que nous attendons du backend pour le tableau de bord
export interface AdminSummary {
  totalAdministrateurs: number; // <-- Ligne ajoutée pour correspondre au backend
  totalProfessors: number;
  totalCandidates: number;
  totalExams: number;
  totalEpreuves: number;
  totalCorrections: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Récupère les données de synthèse du tableau de bord de l'administrateur.
   */
  getAdminSummary(): Observable<AdminSummary> {
    const url = `${this.apiUrl}/administrateurs/summary`;
    return this.http.get<AdminSummary>(url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
  import { CandidatResponseDTO, CandidatRequestDTO } from "../../../models/CandidatResponseDTO"; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class CandidatService {

  private apiBaseUrl = 'http://localhost:8080/api/candidats';

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de tous les candidats.
   * Correspond à l'endpoint GET /candidats.
   * @returns Un Observable qui émet la liste des candidats.
   */
  getAllCandidats(): Observable<CandidatResponseDTO[]> {
    return this.http.get<CandidatResponseDTO[]>(this.apiBaseUrl);
  }

  /**
   * Récupère un candidat par son ID.
   * Correspond à l'endpoint GET /candidats/{id}.
   * @param id L'ID du candidat à récupérer.
   * @returns Un Observable qui émet le candidat.
   */
  getCandidatById(id: number): Observable<CandidatResponseDTO> {
    return this.http.get<CandidatResponseDTO>(`${this.apiBaseUrl}/${id}`);
  }

  /**
   * Met à jour un candidat par son ID.
   * Correspond à l'endpoint PUT /candidats/{id}.
   * @param id L'ID du candidat à mettre à jour.
   * @param requestBody Le DTO contenant les informations à modifier.
   * @returns Un Observable qui émet le candidat mis à jour.
   */
  updateCandidat(id: number, requestBody: CandidatRequestDTO): Observable<CandidatResponseDTO> {
    return this.http.put<CandidatResponseDTO>(`${this.apiBaseUrl}/${id}`, requestBody);
  }

  /**
   * Supprime un candidat par son ID.
   * Correspond à l'endpoint DELETE /candidats/{id}.
   * @param id L'ID du candidat à supprimer.
   * @returns Un Observable qui émet une réponse vide en cas de succès (code 204).
   */
  deleteCandidat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`);
  }
}

// src/app/features/admin/corrections/services/correction.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CorrectionRequestDTO } from 'src/app/models/correction-request.dto';
import { CorrectionResponseDTO } from 'src/app/models/correction-response.dto';

@Injectable({
  providedIn: 'root'
})
export class CorrectionService {
  private apiUrl = 'http://localhost:8080/api/corrections'; // L'URL de base de votre contrôleur Spring Boot

  constructor(private http: HttpClient) { }

  /**
   * Crée une nouvelle correction.
   * @param correctionDTO Les données de la correction (hors fichiers).
   * @param documentFile Le fichier document (optionnel).
   * @param videoFile Le fichier vidéo (optionnel).
   */
  createCorrection(
    correctionDTO: CorrectionRequestDTO,
    documentFile: File | null,
    videoFile: File | null
  ): Observable<CorrectionResponseDTO> {
    const formData = new FormData();
    formData.append('correction', new Blob([JSON.stringify(correctionDTO)], { type: 'application/json' }));

    if (documentFile) {
      formData.append('documentFile', documentFile, documentFile.name);
    }
    if (videoFile) {
      formData.append('videoFile', videoFile, videoFile.name);
    }

    return this.http.post<CorrectionResponseDTO>(this.apiUrl, formData);
  }

  /**
   * Met à jour une correction existante.
   * @param id L'ID de la correction à mettre à jour.
   * @param correctionDTO Les données de la correction (hors nouveaux fichiers).
   * @param newDocumentFile Le nouveau fichier document (optionnel).
   * @param newVideoFile Le nouveau fichier vidéo (optionnel).
   */
  updateCorrection(
    id: number,
    correctionDTO: CorrectionRequestDTO,
    newDocumentFile: File | null,
    newVideoFile: File | null
  ): Observable<CorrectionResponseDTO> {
    const formData = new FormData();
    formData.append('correction', new Blob([JSON.stringify(correctionDTO)], { type: 'application/json' }));

    if (newDocumentFile) {
      formData.append('newDocumentFile', newDocumentFile, newDocumentFile.name);
    }
    if (newVideoFile) {
      formData.append('newVideoFile', newVideoFile, newVideoFile.name);
    }

    return this.http.put<CorrectionResponseDTO>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Récupère une correction par son ID.
   * @param id L'ID de la correction.
   */
  getCorrectionById(id: number): Observable<CorrectionResponseDTO> {
    return this.http.get<CorrectionResponseDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère toutes les corrections.
   */
  getAllCorrections(): Observable<CorrectionResponseDTO[]> {
    return this.http.get<CorrectionResponseDTO[]>(this.apiUrl);
  }

  /**
   * Supprime une correction par son ID.
   * @param id L'ID de la correction à supprimer.
   */
  deleteCorrection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Télécharge un fichier de correction.
   * @param fileName Le nom du fichier à télécharger.
   */
  downloadCorrectionFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileName}`, { responseType: 'blob' });
  }

  /**
   * Récupère les corrections par code d'épreuve.
   * @param codeEpreuve Le code de l'épreuve.
   */
  getCorrectionsByEpreuveCode(codeEpreuve: string): Observable<CorrectionResponseDTO[]> {
    return this.http.get<CorrectionResponseDTO[]>(`${this.apiUrl}/byEpreuve/${codeEpreuve}`);
  }

}

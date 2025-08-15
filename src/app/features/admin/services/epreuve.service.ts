// src/app/features/admin/epreuves/services/epreuve.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EpreuveRequestDTO } from 'src/app/models/epreuve-request.dto';
import { EpreuveResponseDTO } from 'src/app/models/epreuve-response.dto';
import { Epreuve } from 'src/app/models/epreuve.model';
import { EpreuveSearchFilters } from 'src/app/models/epreuve-search-filters.model';

@Injectable({
  providedIn: 'root'
})
export class EpreuveService {
  private apiUrl = 'http://localhost:8080/api/epreuves';

  constructor(private http: HttpClient) { }

  getAllEpreuves(): Observable<EpreuveResponseDTO[]> {
    return this.http.get<EpreuveResponseDTO[]>(this.apiUrl);
  }

  createEpreuve(epreuveRequest: EpreuveRequestDTO, file: File | null): Observable<EpreuveResponseDTO> {
    const formData = new FormData();
    formData.append('epreuve', new Blob([JSON.stringify(epreuveRequest)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.http.post<EpreuveResponseDTO>(this.apiUrl, formData);
  }

  updateEpreuve(codeEpreuve: string, epreuveRequest: EpreuveRequestDTO, newFile: File | null): Observable<EpreuveResponseDTO> {
    const formData = new FormData();
    formData.append('epreuve', new Blob([JSON.stringify(epreuveRequest)], { type: 'application/json' }));
    if (newFile) {
      formData.append('newFile', newFile, newFile.name);
    }
    return this.http.put<EpreuveResponseDTO>(`${this.apiUrl}/${codeEpreuve}`, formData);
  }

  getEpreuveByCode(codeEpreuve: string): Observable<EpreuveResponseDTO> {
    return this.http.get<EpreuveResponseDTO>(`${this.apiUrl}/${codeEpreuve}`);
  }

  deleteEpreuve(codeEpreuve: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codeEpreuve}`);
  }

  incrementDownloadCount(codeEpreuve: string): Observable<Epreuve> {
    return this.http.put<Epreuve>(`${this.apiUrl}/increment-download/${codeEpreuve}`, {});
  }

  downloadEpreuveVideo(codeEpreuve: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/video/${codeEpreuve}`, { responseType: 'blob' });
  }

  downloadEpreuveFile(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileName}`, { responseType: 'blob' });
  }

  searchEpreuves(filters: EpreuveSearchFilters): Observable<EpreuveResponseDTO[]> {
    let params = new HttpParams();
    if (filters.searchTerm) {
      params = params.set('searchTerm', filters.searchTerm);
    }
    if (filters.annee) {
      params = params.set('annee', filters.annee.toString());
    }
    if (filters.idFiliere) {
      params = params.set('idFiliere', filters.idFiliere.toString());
    }
    if (filters.idNiveau) {
      params = params.set('idNiveau', filters.idNiveau.toString());
    }
    return this.http.get<EpreuveResponseDTO[]>(`${this.apiUrl}`, { params });
  }

  getFavoriteEpreuves(): Observable<Epreuve[]> {
    return this.http.get<Epreuve[]>(`${this.apiUrl}/favorites`);
  }

  addFavoriteEpreuve(codeEpreuve: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites/add/${codeEpreuve}`, {});
  }

  removeFavoriteEpreuve(codeEpreuve: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/remove/${codeEpreuve}`);
  }
}

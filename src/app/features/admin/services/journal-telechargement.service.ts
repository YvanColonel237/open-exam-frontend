import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JournalTelechargementResponseDTO } from 'src/app/models/journal-telechargement-response.dto';

@Injectable({
  providedIn: 'root'
})
export class JournalTelechargementService {
  private apiUrl = 'http://localhost:8080/api/journal-telechargements';

  constructor(private http: HttpClient) { }

  getDownloadHistoryByCandidat(candidatId: number): Observable<JournalTelechargementResponseDTO[]> {
    return this.http.get<JournalTelechargementResponseDTO[]>(`${this.apiUrl}/byCandidat/${candidatId}`);
  }
}

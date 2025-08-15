import { Component, OnInit } from '@angular/core';

import { JournalTelechargementResponseDTO } from 'src/app/models/journal-telechargement-response.dto';
import { CommonModule } from '@angular/common';
import {JournalTelechargementService} from "../services/journal-telechargement.service";

@Component({
  selector: 'app-journal-telechargements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-telechargements.component.html',
  styleUrls: ['./journal-telechargements.component.scss']
})
export class JournalTelechargementsComponent implements OnInit {
  telechargements: JournalTelechargementResponseDTO[] = [];
  isLoading = true;
  error: string | null = null;
  candidatId: number = 1; // Remplacez cet ID par l'ID de l'utilisateur connecté

  constructor(private journalService: JournalTelechargementService) { }

  ngOnInit(): void {
    this.loadDownloadHistory();
  }

  loadDownloadHistory(): void {
    this.journalService.getDownloadHistoryByCandidat(this.candidatId).subscribe({
      next: (data) => {
        this.telechargements = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'historique des téléchargements.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}

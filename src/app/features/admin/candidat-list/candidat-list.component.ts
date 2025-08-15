import { Component, OnInit } from '@angular/core';
// Correction du chemin d'accès au modèle
import { CandidatResponseDTO } from '../../../models/CandidatResponseDTO';
import { CandidatService } from '../services/candidat.service';

@Component({
  selector: 'app-candidat-list',
  templateUrl: './candidat-list.component.html'
  // Supprimez cette ligne : styleUrls: ['./candidat-list.component.css']
})
export class CandidatListComponent implements OnInit {

  candidats: CandidatResponseDTO[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private candidatService: CandidatService) { }

  ngOnInit(): void {
    this.getAllCandidats();
  }

  getAllCandidats(): void {
    this.isLoading = true;
    this.error = null;
    this.candidatService.getAllCandidats().subscribe({
      next: (data) => {
        this.candidats = data;
        this.isLoading = false;
      },
      error: (e) => {
        this.error = 'Erreur lors du chargement des candidats.';
        this.isLoading = false;
        console.error(e);
      }
    });
  }

  deleteCandidat(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID du candidat non défini.');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
      this.candidatService.deleteCandidat(id).subscribe({
        next: () => {
          this.getAllCandidats(); // Recharger la liste après la suppression
        },
        error: (e) => {
          this.error = 'Erreur lors de la suppression du candidat.';
          console.error(e);
        }
      });
    }
  }
}

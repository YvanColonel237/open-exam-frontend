import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfesseursService, ProfesseurResponseDTO } from '../services/professeurs.service';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router'; // <-- Importez RouterModule

@Component({
  selector: 'app-professeur-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // <-- NOUVEAU: Ajoutez RouterModule
  ],
  templateUrl: './professeur-list.component.html',
  styleUrls: ['./professeur-list.component.scss']
})
export class ProfesseurListComponent implements OnInit {
  professeurs$: Observable<ProfesseurResponseDTO[]> | undefined;
  isLoading = true;
  error: string | null = null;

  constructor(
    private professeursService: ProfesseursService,
    private router: Router // Injectez le Router
  ) { }

  ngOnInit(): void {
    this.loadProfesseurs();
  }

  loadProfesseurs(): void {
    this.professeurs$ = this.professeursService.getAllProfesseurs();
    this.professeurs$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des professeurs.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteProfesseur(id: number | undefined): void {
    if (id && confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      this.professeursService.deleteProfesseur(id).subscribe({
        next: () => {
          // Recharger la liste après la suppression réussie
          this.loadProfesseurs();
          alert('Professeur supprimé avec succès !');
        },
        error: (err) => {
          alert('Erreur lors de la suppression du professeur.');
          console.error(err);
        }
      });
    }
  }
}

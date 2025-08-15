import { Component, OnInit } from '@angular/core';
import { Examen } from '../../../models/examen.model';
import { ExamenService } from '../services/examen.service';

@Component({
  selector: 'app-examen-list',
  templateUrl: './examen-list.component.html',
  // Supprimez ou commentez cette ligne pour résoudre l'erreur
  // styleUrls: ['./examen-list.component.css']
})
export class ExamenListComponent implements OnInit {

  examens: Examen[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private examenService: ExamenService) { }

  ngOnInit(): void {
    this.getAllExamens();
  }

  getAllExamens(): void {
    this.isLoading = true;
    this.error = null;
    this.examenService.getAllExamens().subscribe({
      next: (data) => {
        this.examens = data;
        this.isLoading = false;
      },
      error: (e) => {
        this.error = 'Erreur lors du chargement des examens.';
        this.isLoading = false;
        console.error(e);
      }
    });
  }

  deleteExamen(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID de l\'examen non défini.');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
      this.examenService.deleteExamen(id).subscribe({
        next: () => {
          this.getAllExamens(); // Recharger la liste après la suppression
        },
        error: (e) => {
          this.error = 'Erreur lors de la suppression de l\'examen.';
          console.error(e);
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CorrectionService } from '../../../core/services/correction.service';
import { CorrectionResponseDTO } from 'src/app/models/correction-response.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

declare var M: any;

@Component({
  selector: 'app-correction-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './correction-list.component.html',
  styleUrls: ['./correction-list.component.scss']
})
export class CorrectionListComponent implements OnInit {
  corrections: CorrectionResponseDTO[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private correctionService: CorrectionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCorrections();
  }

  loadCorrections(): void {
    this.isLoading = true;
    this.error = null;
    this.correctionService.getAllCorrections().subscribe({
      next: (data: CorrectionResponseDTO[]) => {
        this.corrections = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement des corrections. Code: ' + err.status;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteCorrection(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette correction ?')) {
      this.correctionService.deleteCorrection(id).subscribe({
        next: () => {
          M.toast({ html: 'Correction supprimée avec succès', classes: 'green darken-2' });
          // La ligne suivante est correcte si le modèle contient "id"
          this.corrections = this.corrections.filter(c => c.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Erreur lors de la suppression : ' + err.error?.message;
          M.toast({ html: 'Erreur lors de la suppression', classes: 'red darken-2' });
          console.error(err);
        }
      });
    }
  }

  downloadFile(fileName: string | null): void {
    if (fileName) {
      this.correctionService.downloadCorrectionFile(fileName).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          M.toast({html: `Téléchargement de ${fileName} en cours...`, classes: 'blue darken-2'});
        },
        error: (err: HttpErrorResponse) => {
          M.toast({html: `Erreur lors du téléchargement de ${fileName}.`, classes: 'red darken-2'});
          console.error(err);
        }
      });
    }
  }
}

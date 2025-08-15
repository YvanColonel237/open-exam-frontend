import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenService } from '../services/examen.service';
import { Examen } from 'src/app/models/examen.model';
import { Filiere } from 'src/app/models/filiere.model';
import { Niveau } from 'src/app/models/niveau.model';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-examen-create-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './examen-create-edit.component.html',
  styleUrls: ['./examen-create-edit.component.scss']
})
export class ExamenCreateEditComponent implements OnInit {

  examenForm!: FormGroup;
  isEditMode = false;
  examenId: number | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.examenForm = this.fb.group({
      libelleExamen: ['', Validators.required],
      dateExamen: ['', Validators.required],
      filiereId: [null, Validators.required],
      niveauId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.isEditMode = true;
          this.examenId = +idParam;
          return this.examenService.getExamenById(this.examenId);
        } else {
          this.isLoading = false;
          return of(null);
        }
      })
    ).subscribe({
      next: (examen) => {
        if (examen) {
          this.examenForm.patchValue({
            ...examen,
            dateExamen: examen.dateExamen ? this.formatDate(examen.dateExamen) : '',
            filiereId: examen.filiere.idFiliere,
            niveauId: examen.niveau.idNiveau
          });
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement de l\'examen. Code: ' + err.status;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.examenForm.valid) {
      const formValue = this.examenForm.value;

      // Correction ici : Créer des objets Filiere et Niveau complets pour satisfaire le compilateur

      const examenData: Examen = {
        // @ts-ignore
        idExamen: this.examenId, // Ajout de l'idExamen pour la mise à jour
        libelleExamen: formValue.libelleExamen,
        dateExamen: formValue.dateExamen,
        // Construction de l'objet Filiere avec toutes les propriétés
        // @ts-ignore
        filiere: {
          idFiliere: formValue.filiereId,
          nomFiliere: '', // Initialisation à une chaîne vide
          codeFiliere: '' // Initialisation à une chaîne vide
        } as Filiere,
        // Construction de l'objet Niveau avec toutes les propriétés
        // @ts-ignore
        niveau: {
          idNiveau: formValue.niveauId,
          nomNiveau: '', // Initialisation à une chaîne vide
          codeNiveau: '' // Initialisation à une chaîne vide
        } as Niveau
      };

      if (this.isEditMode && this.examenId !== null) {
        this.examenService.updateExamen(this.examenId, examenData).subscribe({
          next: () => {
            alert('Examen mis à jour avec succès !');
            this.router.navigate(['/admin/examens']);
          },
          error: (err: HttpErrorResponse) => {
            this.error = 'Erreur lors de la mise à jour : ' + err.error?.message;
            console.error(err);
          }
        });
      } else {
        this.examenService.createExamen(examenData).subscribe({
          next: () => {
            alert('Examen créé avec succès !');
            this.router.navigate(['/admin/examens']);
          },
          error: (err: HttpErrorResponse) => {
            this.error = 'Erreur lors de la création : ' + err.error?.message;
            console.error(err);
          }
        });
      }
    }
  }
}

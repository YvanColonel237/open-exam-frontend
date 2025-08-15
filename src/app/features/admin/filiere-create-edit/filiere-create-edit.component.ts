// src/app/features/admin/filieres/filiere-create-edit/filiere-create-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FiliereService } from '../services/filiere.service';
import { Filiere } from 'src/app/models/filiere.model';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

declare var M: any; // Déclarez M pour Materialize

@Component({
  selector: 'app-filiere-create-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './filiere-create-edit.component.html',
  styleUrls: ['./filiere-create-edit.component.scss']
})
export class FiliereCreateEditComponent implements OnInit {

  filiereForm!: FormGroup;
  isEditMode = false;
  filiereId: number | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private filiereService: FiliereService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filiereForm = this.fb.group({
      nomFiliere: ['', Validators.required],
      codeFiliere: ['', Validators.required],
      description: [''],
      niveauEtudeSpecifique: [''],
      departement: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.isEditMode = true;
          this.filiereId = +idParam;
          this.isLoading = true;
          return this.filiereService.getFiliereById(this.filiereId);
        } else {
          return of(null);
        }
      })
    ).subscribe({
      next: (filiere) => {
        if (filiere) {
          this.filiereForm.patchValue(filiere);
        }
        this.isLoading = false;
        // Mettre à jour les labels de Materialize
        setTimeout(() => M.updateTextFields(), 0);
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement de la filière. Code: ' + err.status;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.filiereForm.valid) {
      const filiereData = this.filiereForm.value as Filiere;

      if (this.isEditMode && this.filiereId !== null) {
        // Mode édition
        this.filiereService.updateFiliere(this.filiereId, filiereData).subscribe({
          next: () => {
            M.toast({html: 'Filière mise à jour avec succès !', classes: 'green darken-2'});
            this.router.navigate(['/filieres']);
          },
          error: (err: HttpErrorResponse) => {
            this.error = 'Erreur lors de la mise à jour : ' + err.error?.message;
            M.toast({html: 'Erreur lors de la mise à jour', classes: 'red darken-2'});
            console.error(err);
          }
        });
      } else {
        // Mode création
        this.filiereService.createFiliere(filiereData).subscribe({
          next: () => {
            M.toast({html: 'Filière créée avec succès !', classes: 'green darken-2'});
            this.router.navigate(['/filieres']);
          },
          error: (err: HttpErrorResponse) => {
            this.error = 'Erreur lors de la création : ' + err.error?.message;
            M.toast({html: 'Erreur lors de la création', classes: 'red darken-2'});
            console.error(err);
          }
        });
      }
    }
  }

}

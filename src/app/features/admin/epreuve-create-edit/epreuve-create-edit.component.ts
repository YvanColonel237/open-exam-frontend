// src/app/features/admin/epreuves/epreuve-create-edit/epreuve-create-edit.component.ts

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EpreuveService } from '../services/epreuve.service';
import { ExamenService } from '../services/examen.service';
import { FiliereService } from '../services/filiere.service';
import { NiveauService } from '../services/niveau.service';
import { MatiereService } from '../services/matiere.service';
import { EpreuveRequestDTO } from 'src/app/models/epreuve-request.dto';
import { EpreuveResponseDTO } from 'src/app/models/epreuve-response.dto';
import { Examen } from 'src/app/models/examen.model';
import { Filiere } from 'src/app/models/filiere.model';
import { Niveau } from 'src/app/models/niveau.model';
import { Matiere } from 'src/app/models/matiere.model';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

declare var M: any; // Déclarez M pour Materialize

@Component({
  selector: 'app-epreuve-create-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './epreuve-create-edit.component.html',
  styleUrls: ['./epreuve-create-edit.component.scss']
})
export class EpreuveCreateEditComponent implements OnInit, AfterViewInit {

  epreuveForm!: FormGroup;
  isEditMode = false;
  epreuveCode: string | null = null;
  isLoading = false;
  error: string | null = null;

  examens: Examen[] = [];
  filieres: Filiere[] = [];
  niveaux: Niveau[] = [];
  matieres: Matiere[] = [];

  fileSelected: File | null = null;
  currentFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private epreuveService: EpreuveService,
    private examenService: ExamenService,
    private filiereService: FiliereService,
    private niveauService: NiveauService,
    private matiereService: MatiereService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.epreuveForm = this.fb.group({
      annee: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      idExamen: [null, Validators.required],
      idFiliere: [null, Validators.required],
      idNiveau: [null, Validators.required],
      codeMatiere: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDropdowns();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const elems = document.querySelectorAll('select');
      M.FormSelect.init(elems, {});
    }, 500);
  }

  loadDropdowns(): void {
    this.isLoading = true;
    forkJoin({
      examens: this.examenService.getAllExamens(),
      filieres: this.filiereService.getAllFilieres(),
      niveaux: this.niveauService.getAllNiveaux(),
      matieres: this.matiereService.getAllMatieres()
    }).subscribe({
      next: (data) => {
        this.examens = data.examens;
        this.filieres = data.filieres;
        this.niveaux = data.niveaux;
        this.matieres = data.matieres;
        this.checkEditMode();
        this.isLoading = false;
        setTimeout(() => M.updateTextFields(), 0);
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement des listes de sélection. Code: ' + err.status;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  checkEditMode(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const codeParam = params.get('codeEpreuve');
        if (codeParam) {
          this.isEditMode = true;
          this.epreuveCode = codeParam;
          return this.epreuveService.getEpreuveByCode(this.epreuveCode);
        } else {
          return of(null);
        }
      })
    ).subscribe({
      next: (epreuve: EpreuveResponseDTO | null) => {
        if (epreuve) {
          this.epreuveForm.patchValue({
            annee: epreuve.annee,
            idExamen: epreuve.examen.idExamen,
            idFiliere: epreuve.filiere.idFiliere,
            idNiveau: epreuve.niveau.idNiveau,
            codeMatiere: epreuve.matiere.codeMatiere,
          });
          this.currentFileName = epreuve.nomFichier;
        }
        this.isLoading = false;
        setTimeout(() => M.updateTextFields(), 0);
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement de l\'épreuve. Code: ' + err.status;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onFileSelected(event: any): void {
    this.fileSelected = event.target.files[0] || null;
  }

  onSubmit(): void {
    if (this.epreuveForm.valid && this.fileSelected) { // Ajout d'une vérification du fichier
      this.isLoading = true;
      const formValue = this.epreuveForm.value;

      // Correction ici : Créer l'objet DTO avec la structure attendue par le back-end

      const epreuveRequest: EpreuveRequestDTO = {
        annee: formValue.annee,
        // @ts-ignore
        examen: { idExamen: formValue.idExamen } as Examen,
        filiere: { idFiliere: formValue.idFiliere } as Filiere,
        niveau: { idNiveau: formValue.idNiveau } as Niveau,
        matiere: { codeMatiere: formValue.codeMatiere } as Matiere,
      };

      if (this.isEditMode && this.epreuveCode !== null) {
        // Mode édition
        this.epreuveService.updateEpreuve(this.epreuveCode, epreuveRequest, this.fileSelected).subscribe({
          next: () => {
            M.toast({html: 'Épreuve mise à jour avec succès !', classes: 'green darken-2'});
            this.router.navigate(['/admin/epreuves']);
          },
          error: (err: HttpErrorResponse) => {
            this.error = 'Erreur lors de la mise à jour : ' + (err.error?.message || err.message);
            M.toast({html: 'Erreur lors de la mise à jour', classes: 'red darken-2'});
            this.isLoading = false;
            console.error(err);
          }
        });
      } else {
        // Mode création
        this.epreuveService.createEpreuve(epreuveRequest, this.fileSelected).subscribe({
          next: () => {
            M.toast({html: 'Épreuve créée avec succès !', classes: 'green darken-2'});
            this.router.navigate(['/admin/epreuves']);
          },
          error: (err: HttpErrorResponse) => {
            this.error = 'Erreur lors de la création : ' + (err.error?.message || err.message);
            M.toast({html: 'Erreur lors de la création', classes: 'red darken-2'});
            this.isLoading = false;
            console.error(err);
          }
        });
      }
    } else {
      M.toast({html: 'Veuillez remplir tous les champs et sélectionner un fichier.', classes: 'red darken-2'});
    }
  }
}

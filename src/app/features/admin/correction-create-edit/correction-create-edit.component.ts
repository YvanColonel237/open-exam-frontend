import {Component, OnInit, AfterViewInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CorrectionRequestDTO } from 'src/app/models/correction-request.dto';
import { CorrectionResponseDTO } from 'src/app/models/correction-response.dto';
import { EpreuveResponseDTO } from 'src/app/models/epreuve-response.dto';
import { CommonModule } from '@angular/common';
import { switchMap, of } from 'rxjs';
import {CorrectionService} from "../../../core/services/correction.service";
import {EpreuveService} from "../services/epreuve.service";

declare var M: any;

@Component({
  selector: 'app-correction-create-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './correction-create-edit.component.html',
  styleUrls: ['./correction-create-edit.component.scss']
})
export class CorrectionCreateEditComponent implements OnInit, AfterViewInit {
  correctionForm!: FormGroup;
  isEditMode = false;
  correctionId: number | null = null;
  epreuves: EpreuveResponseDTO[] = [];
  isLoading = true;
  error: string | null = null;
  currentDocumentFile: File | null = null;
  currentVideoFile: File | null = null;
  currentDocumentFileName: string | null = null;
  currentVideoFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private correctionService: CorrectionService,
    private epreuveService: EpreuveService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadEpreuves();
    this.checkEditMode();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      M.FormSelect.init(document.querySelectorAll('select'));
    }, 0);
  }

  initForm(): void {
    this.correctionForm = this.fb.group({
      codeEpreuve: ['', Validators.required],
      commentaire: ['']
    });
  }

  loadEpreuves(): void {
    // Le service doit retourner un Observable<EpreuveResponseDTO[]>
    this.epreuveService.getAllEpreuves().subscribe({
      next: (data: EpreuveResponseDTO[]) => {
        this.epreuves = data;
        setTimeout(() => {
          M.FormSelect.init(document.querySelectorAll('select'));
        }, 0);
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement des épreuves.';
        console.error(err);
      }
    });
  }

  checkEditMode(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (idParam && !isNaN(+idParam)) {
          this.isEditMode = true;
          this.correctionId = +idParam;
          return this.correctionService.getCorrectionById(this.correctionId);
        } else {
          this.isEditMode = false;
          this.correctionId = null;
          this.isLoading = false;
          return of(null);
        }
      })
    ).subscribe({
      next: (correction: CorrectionResponseDTO | null) => {
        if (correction) {
          this.correctionForm.patchValue({
            codeEpreuve: correction.epreuve?.codeEpreuve,
            commentaire: correction.commentaire,
          });
          this.currentDocumentFileName = correction.cheminDocument;
          this.currentVideoFileName = correction.cheminVideo;
        }
        this.isLoading = false;
        this.ngAfterViewInit();
        setTimeout(() => M.updateTextFields(), 0);
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement de la correction. Code: ' + err.status;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onDocumentFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.currentDocumentFile = file;
    }
  }

  onVideoFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.currentVideoFile = file;
    }
  }

  onSubmit(): void {
    if (this.correctionForm.invalid) {
      M.toast({html: 'Veuillez remplir tous les champs requis.', classes: 'red darken-2'});
      return;
    }

    this.isLoading = true;
    const correctionDTO: CorrectionRequestDTO = this.correctionForm.value;

    if (this.isEditMode && this.correctionId !== null) {
      this.correctionService.updateCorrection(this.correctionId, correctionDTO, this.currentDocumentFile, this.currentVideoFile).subscribe({
        next: () => {
          M.toast({html: 'Correction mise à jour avec succès.', classes: 'green darken-2'});
          this.router.navigate(['/admin/corrections']);
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Erreur lors de la mise à jour : ' + err.error?.message;
          this.isLoading = false;
          M.toast({html: 'Erreur lors de la mise à jour.', classes: 'red darken-2'});
          console.error(err);
        }
      });
    } else {
      this.correctionService.createCorrection(correctionDTO, this.currentDocumentFile, this.currentVideoFile).subscribe({
        next: () => {
          M.toast({html: 'Correction créée avec succès.', classes: 'green darken-2'});
          this.router.navigate(['/admin/corrections']);
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Erreur lors de la création : ' + err.error?.message;
          this.isLoading = false;
          M.toast({html: 'Erreur lors de la création.', classes: 'red darken-2'});
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

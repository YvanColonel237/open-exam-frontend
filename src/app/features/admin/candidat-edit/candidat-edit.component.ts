import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatService } from '../services/candidat.service';
import { CandidatResponseDTO } from '../../../models/CandidatResponseDTO';
import {finalize} from "rxjs";

@Component({
  selector: 'app-candidat-edit',
  templateUrl: './candidat-edit.component.html',
  // Supprimez ou commentez cette ligne si vous n'avez pas de fichier CSS
  // styleUrls: ['./candidat-edit.component.css']
})
export class CandidatEditComponent implements OnInit, AfterViewInit {

  candidatForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  candidatId!: number;

  @ViewChild('statutCandidat') statutSelect!: ElementRef;
  private M: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private candidatService: CandidatService
  ) { }

  ngOnInit(): void {
    this.candidatForm = this.fb.group({
      emailConnexion: [{ value: '', disabled: true }],
      dateInscription: [{ value: '', disabled: true }],
      statutCandidat: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.candidatId = +params['id'];
      if (this.candidatId) {
        this.loadCandidatData(this.candidatId);
      }
    });
  }

  ngAfterViewInit(): void {
    // S'assurer que Materialize existe avant d'initialiser le select
    if (typeof this.M !== 'undefined' && this.statutSelect) {
      this.M.FormSelect.init(this.statutSelect.nativeElement);
    }
  }

  loadCandidatData(id: number): void {
    this.isLoading = true;
    this.candidatService.getCandidatById(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data: CandidatResponseDTO) => {
        this.candidatForm.patchValue(data);
        // Important : re-initialiser Materialize après le chargement des données
        this.ngAfterViewInit();
      },
      error: (e) => {
        this.error = 'Erreur lors du chargement des données du candidat.';
        console.error(e);
      }
    });
  }

  onSubmit(): void {
    if (this.candidatForm.invalid) {
      return;
    }
    const updatedCandidat = { ...this.candidatForm.getRawValue() };
    this.candidatService.updateCandidat(this.candidatId, updatedCandidat).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        // CORRECTION : Rediriger vers la route correcte
        this.router.navigate(['/admin/candidats']);
      },
      error: (e) => {
        this.error = 'Erreur lors de la mise à jour du candidat.';
        console.error(e);
      }
    });
  }
}

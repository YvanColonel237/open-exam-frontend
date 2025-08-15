import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfesseursService } from '../services/professeurs.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-professeur-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './professeur-edit.component.html',
  styleUrls: ['./professeur-edit.component.scss']
})
export class ProfesseurEditComponent implements OnInit {

  professeurForm!: FormGroup;
  professeurId!: number;
  isLoading = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private professeursService: ProfesseursService
  ) {
    this.professeurForm = this.fb.group({
      specialiteProfesseur: ['', Validators.required],
      biographieProfesseur: [''],
      statutProfesseur: ['ACTIF', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.professeurId = +idParam; // Le + convertit la chaîne en nombre
        this.professeursService.getProfesseurById(this.professeurId).subscribe({
          next: (professeur) => {
            this.professeurForm.patchValue(professeur);
            this.isLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.error = 'Erreur lors du chargement du professeur. Code: ' + err.status;
            this.isLoading = false;
            console.error(err);
          }
        });
      } else {
        this.router.navigate(['/admin/professeurs']);
      }
    });
  }

  onSubmit(): void {
    if (this.professeurForm.valid) {
      this.professeursService.updateProfesseur(this.professeurId, this.professeurForm.value).subscribe({
        next: () => {
          alert('Professeur mis à jour avec succès !');
          this.router.navigate(['/admin/professeurs']);
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Erreur lors de la mise à jour. Code: ' + err.status;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/professeurs']);
  }
}

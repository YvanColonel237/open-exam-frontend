import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfesseursService } from '../services/professeurs.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-professeur-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './professeur-create.component.html',
  styleUrls: ['./professeur-create.component.scss']
})
export class ProfesseurCreateComponent implements OnInit {

  professeurForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private professeursService: ProfesseursService
  ) {
    this.professeurForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      specialiteProfesseur: ['', Validators.required],
      biographieProfesseur: [''],
      statutProfesseur: ['ACTIF', Validators.required]
    });
  }

  ngOnInit(): void {
    // Aucune donnée à charger, donc le formulaire est prêt
  }

  onSubmit(): void {
    if (this.professeurForm.valid) {
      this.isLoading = true;
      this.professeursService.createProfesseur(this.professeurForm.value).subscribe({
        next: () => {
          this.successMessage = 'Professeur créé avec succès !';
          this.isLoading = false;
          // Rediriger après un court délai pour que l'utilisateur voie le message de succès
          setTimeout(() => {
            this.router.navigate(['/admin/professeurs']);
          }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error?.message || 'Erreur lors de la création du professeur.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/professeurs']);
  }
}

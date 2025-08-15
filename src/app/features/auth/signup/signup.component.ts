import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SignupRequest } from 'src/app/models/auth.model';

declare var M: any;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule, // Pour le formulaire
    RouterModule         // NOUVEAU : Pour la directive routerLink
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    setTimeout(() => {
      M.updateTextFields();
    }, 0);
  }

  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.loading = true;

    if (this.signupForm.invalid) {
      this.loading = false;
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
      M.toast({html: this.errorMessage, classes: 'red darken-2'});
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const signupRequest = {
      email: this.f['email'].value,
      password: this.f['password'].value,
    };

    this.authService.signup(signupRequest).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        M.toast({html: this.successMessage, classes: 'green darken-2'});
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Inscription réussie ! Vous pouvez maintenant vous connecter';
        console.error('Erreur d\'inscription:', err);
        M.toast({html: this.errorMessage, classes: 'green darken-2'});
        this.loading = false;
      }
    });
  }
}

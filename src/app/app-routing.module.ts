import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { HomeComponent } from './core/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from "./core/guards/role.guard";
import { AdminDashboardComponent } from "./features/admin/admin-dashboard/admin-dashboard.component";
import { LayoutComponent } from "./shared/layout/layout.component";
import { ProfesseurListComponent } from "./features/admin/professeur-list/professeur-list.component";
import { ProfesseurEditComponent } from "./features/admin/professeur-edit/professeur-edit.component";
import { ProfesseurCreateComponent } from "./features/admin/professeur-create/professeur-create.component";
import { CandidatListComponent } from "./features/admin/candidat-list/candidat-list.component";
import { CandidatEditComponent } from "./features/admin/candidat-edit/candidat-edit.component";
import { ExamenListComponent } from "./features/admin/examen-list/examen-list.component";
import { ExamenCreateEditComponent } from "./features/admin/examen-create-edit/examen-create-edit.component";
import { FiliereListComponent } from './features/admin/filiere-list/filiere-list.component';
import { FiliereCreateEditComponent } from './features/admin/filiere-create-edit/filiere-create-edit.component';
import { EpreuveListComponent } from "./features/admin/epreuve-list/epreuve-list.component";
import { EpreuveCreateEditComponent } from "./features/admin/epreuve-create-edit/epreuve-create-edit.component";
import { CorrectionListComponent } from "./features/admin/correction-list/correction-list.component";
import { CorrectionCreateEditComponent } from "./features/admin/correction-create-edit/correction-create-edit.component";
import {
  JournalTelechargementsComponent
} from "./features/admin/journal-telechargements/journal-telechargements.component";


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'epreuves',
        component: EpreuveListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMINISTRATEUR', 'PROFESSEUR', 'CANDIDAT'] }
      },

      {
        path: 'candidats/profile',
        component: CandidatEditComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['CANDIDAT'] }
      },

      // Route pour l'historique du candidat
      {
        path: 'candidat/telechargements',
        component: JournalTelechargementsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['CANDIDAT'] }
      },

      {
        path: 'professeurs/profile',
        component: ProfesseurEditComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['PROFESSEUR'] }
      },
      {
        path: 'admin',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMINISTRATEUR'] },
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'professeurs', component: ProfesseurListComponent },
          { path: 'professeurs/create', component: ProfesseurCreateComponent },
          { path: 'professeurs/edit/:id', component: ProfesseurEditComponent },
          { path: 'candidats', component: CandidatListComponent },
          { path: 'candidats/edit/:id', component: CandidatEditComponent },
          { path: 'epreuves', component: EpreuveListComponent },
          { path: 'epreuves/create', component: EpreuveCreateEditComponent },
          { path: 'epreuves/edit/:codeEpreuve', component: EpreuveCreateEditComponent },
          { path: 'examens', component: ExamenListComponent },
          { path: 'examens/create', component: ExamenCreateEditComponent },
          { path: 'examens/edit/:id', component: ExamenCreateEditComponent },
          { path: 'filieres', component: FiliereListComponent },
          { path: 'filieres/create', component: FiliereCreateEditComponent },
          { path: 'filieres/edit/:id', component: FiliereCreateEditComponent },
          { path: 'corrections', component: CorrectionListComponent },
          { path: 'corrections/create', component: CorrectionCreateEditComponent },
          { path: 'corrections/edit/:id', component: CorrectionCreateEditComponent },
          // Ajout de la route pour le journal de l'administrateur
          { path: 'journal-telechargements', component: JournalTelechargementsComponent },
        ]
      },
    ]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

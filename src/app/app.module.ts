// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';

import { ProfesseurCreateComponent } from './features/admin/professeur-create/professeur-create.component';
import { CandidatListComponent } from './features/admin/candidat-list/candidat-list.component';
import { CandidatEditComponent } from './features/admin/candidat-edit/candidat-edit.component';
import { ExamenListComponent } from './features/admin/examen-list/examen-list.component';
import { CorrectionCreateEditComponent } from "./features/admin/correction-create-edit/correction-create-edit.component";
import { CorrectionListComponent } from './features/admin/correction-list/correction-list.component';
import {
  JournalTelechargementsComponent
} from "./features/admin/journal-telechargements/journal-telechargements.component";
import {AuthInterceptor} from "./core/interceptors/auth.interceptor";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LayoutComponent,
    CandidatListComponent,
    CandidatEditComponent,
    ExamenListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ProfesseurCreateComponent,
    CorrectionCreateEditComponent,
    CorrectionListComponent,
    JournalTelechargementsComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

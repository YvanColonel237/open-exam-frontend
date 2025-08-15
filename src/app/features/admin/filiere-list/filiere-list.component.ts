// src/app/features/admin/filieres/filiere-list/filiere-list.component.ts

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FiliereService } from '../services/filiere.service';
import { Filiere } from 'src/app/models/filiere.model';
import { HttpErrorResponse } from '@angular/common/http';

declare var M: any; // Déclarez M pour Materialize

@Component({
  selector: 'app-filiere-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './filiere-list.component.html',
  styleUrls: ['./filiere-list.component.scss']
})
export class FiliereListComponent implements OnInit, AfterViewInit {

  filieres: Filiere[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private filiereService: FiliereService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllFilieres();
  }

  ngAfterViewInit(): void {
    // Initialiser les tooltips de Materialize après que la vue est chargée
    setTimeout(() => {
      const elems = document.querySelectorAll('.tooltipped');
      M.Tooltip.init(elems, {});
    }, 0);
  }

  getAllFilieres(): void {
    this.isLoading = true;
    this.error = null;
    this.filiereService.getAllFilieres().subscribe({
      next: (data) => {
        this.filieres = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du chargement des filières. Code: ' + err.status;
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteFiliere(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      this.filiereService.deleteFiliere(id).subscribe({
        next: () => {
          M.toast({html: 'Filière supprimée avec succès', classes: 'green darken-2'});
          this.getAllFilieres(); // Rafraîchir la liste
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Erreur lors de la suppression : ' + err.error?.message;
          M.toast({html: 'Erreur lors de la suppression', classes: 'red darken-2'});
          console.error(err);
        }
      });
    }
  }
}

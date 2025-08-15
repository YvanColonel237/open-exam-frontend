import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { EpreuveService } from '../services/epreuve.service';
import { FiliereService } from '../services/filiere.service';
import { NiveauService } from '../services/niveau.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EpreuveResponseDTO } from 'src/app/models/epreuve-response.dto';
import { EpreuveSearchFilters } from 'src/app/models/epreuve-search-filters.model';
import { Filiere } from 'src/app/models/filiere.model';
import { Niveau } from 'src/app/models/niveau.model';


declare var M: any;

@Component({
  selector: 'app-epreuve-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './epreuve-list.component.html',
  styleUrls: ['./epreuve-list.component.scss']
})
export class EpreuveListComponent implements OnInit, AfterViewInit {

  epreuves: EpreuveResponseDTO[] = [];
  isLoading = true;
  error: string | null = null;
  favoriteEpreuveCodes: Set<string> = new Set<string>();
  isAdmin: boolean = false;
  isCandidat: boolean = false;

  searchFilters: EpreuveSearchFilters = {};
  annees: number[] = [];
  filieres: Filiere[] = [];
  niveaux: Niveau[] = [];

  constructor(
    private epreuveService: EpreuveService,
    private router: Router,
    private authService: AuthService,
    private filiereService: FiliereService,
    private niveauService: NiveauService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isUserAdmin();
    this.isCandidat = this.authService.isUserCandidat();
    this.loadFiltersData();
    this.performSearch();
  }

  ngAfterViewInit(): void {
    this.initTooltips();
  }

  performSearch(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      epreuves: this.epreuveService.searchEpreuves(this.searchFilters).pipe(
        catchError(err => {
          this.error = 'Erreur lors du chargement des épreuves. Code: ' + err.status;
          console.error(err);
          return of([]);
        })
      ),
      favorites: this.epreuveService.getFavoriteEpreuves().pipe(
        catchError(err => {
          console.error('Erreur lors du chargement des favoris', err);
          return of([]);
        })
      )
    }).pipe(
      finalize(() => {
        this.isLoading = false;
        this.initTooltips();
      })
    ).subscribe(({ epreuves, favorites }) => {
      this.epreuves = epreuves;
      this.favoriteEpreuveCodes = new Set(favorites.map(e => e.codeEpreuve));
    });
  }

  loadFiltersData(): void {
    this.epreuveService.getAllEpreuves().subscribe(epreuves => {
      const allAnnees = epreuves.map(e => e.anneeEpreuve);
      this.annees = [...new Set(allAnnees)].sort((a, b) => b - a);
    });

    this.filiereService.getAllFilieres().subscribe(filieres => {
      this.filieres = filieres;
    });

    this.niveauService.getAllNiveaux().subscribe(niveaux => {
      this.niveaux = niveaux;
    });
  }

  onFilterChange(): void {
    this.performSearch();
  }

  initTooltips(): void {
    setTimeout(() => {
      const elems = document.querySelectorAll('.tooltipped');
      if (elems) {
        M.Tooltip.init(elems, {});
      }
    }, 0);
  }

  isFavorite(codeEpreuve: string): boolean {
    return this.favoriteEpreuveCodes.has(codeEpreuve);
  }

  toggleFavorite(codeEpreuve: string): void {
    if (this.isFavorite(codeEpreuve)) {
      this.epreuveService.removeFavoriteEpreuve(codeEpreuve).subscribe({
        next: () => {
          this.favoriteEpreuveCodes.delete(codeEpreuve);
          M.toast({ html: 'Épreuve retirée des favoris', classes: 'yellow darken-3' });
        },
        error: (err) => {
          console.error('Erreur lors du retrait des favoris', err);
          M.toast({ html: 'Erreur lors du retrait des favoris', classes: 'red darken-2' });
        }
      });
    } else {
      this.epreuveService.addFavoriteEpreuve(codeEpreuve).subscribe({
        next: () => {
          this.favoriteEpreuveCodes.add(codeEpreuve);
          M.toast({ html: 'Épreuve ajoutée aux favoris !', classes: 'green darken-2' });
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout aux favoris', err);
          M.toast({ html: 'Erreur lors de l\'ajout aux favoris', classes: 'red darken-2' });
        }
      });
    }
  }

  deleteEpreuve(codeEpreuve: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette épreuve ?')) {
      this.epreuveService.deleteEpreuve(codeEpreuve).subscribe({
        next: () => {
          M.toast({ html: 'Épreuve supprimée avec succès', classes: 'green darken-2' });
          this.epreuves = this.epreuves.filter(e => e.codeEpreuve !== codeEpreuve);
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Erreur lors de la suppression : ' + err.error?.message;
          M.toast({ html: 'Erreur lors de la suppression', classes: 'red darken-2' });
          console.error(err);
        }
      });
    }
  }

  downloadEpreuve(fileName: string, codeEpreuve: string): void {
    this.epreuveService.downloadEpreuveFile(fileName).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        M.toast({ html: 'Téléchargement de l\'épreuve en cours...', classes: 'blue darken-2' });

        this.epreuveService.incrementDownloadCount(codeEpreuve).subscribe({
          next: (updatedEpreuve) => {
            const index = this.epreuves.findIndex(e => e.codeEpreuve === codeEpreuve);
            if (index !== -1) {
              this.epreuves[index].nombreTelechargements = updatedEpreuve.nombreTelechargements;
            }
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erreur lors de l\'incrémentation du compteur de téléchargements : ' + err.message);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors du téléchargement du fichier : ' + err.error?.message;
        M.toast({ html: 'Erreur lors du téléchargement', classes: 'red darken-2' });
        console.error(err);
      }
    });
  }

  downloadVideoForCandidat(epreuve: EpreuveResponseDTO): void {
    if (!epreuve.cheminFichier) {
      M.toast({ html: 'Aucun fichier vidéo associé à cette épreuve.', classes: 'red darken-2' });
      return;
    }

    this.epreuveService.downloadEpreuveVideo(epreuve.codeEpreuve).subscribe({
      next: (data: Blob) => {
        const downloadUrl = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = epreuve.cheminFichier;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        M.toast({ html: 'Téléchargement de la vidéo en cours...', classes: 'blue darken-2' });
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement de la vidéo', err);
        M.toast({ html: 'Échec du téléchargement de la vidéo.', classes: 'red darken-2' });
      }
    });
  }

  shouldShowCandidatDownloadButton(epreuve: EpreuveResponseDTO): boolean {
    return this.isCandidat && !!epreuve.cheminFichier;
  }
}

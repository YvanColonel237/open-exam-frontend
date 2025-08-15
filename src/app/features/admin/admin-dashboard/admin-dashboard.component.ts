import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- AJOUTEZ CECI
import { AdminDashboardService, AdminSummary } from '../services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  adminSummary: AdminSummary | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private adminDashboardService: AdminDashboardService) { }

  ngOnInit(): void {
    this.getDashboardSummary();
    console.log("Le composant AdminDashboardComponent a été initialisé.");
  }

  getDashboardSummary(): void {
    this.isLoading = true;
    this.adminDashboardService.getAdminSummary().subscribe({
      next: (data) => {
        this.adminSummary = data;
        this.isLoading = false;
        console.log('Données du tableau de bord chargées :', data);
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données : ' + err.message;
        this.isLoading = false;
        console.error('Erreur :', err);
      }
    });
  }
}

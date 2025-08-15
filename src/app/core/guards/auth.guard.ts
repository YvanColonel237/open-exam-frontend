// src/app/core/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators'; // Importez 'map' et 'take'
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // On utilise l'Observable isLoggedIn$ du service d'authentification
    return this.authService.isLoggedIn$.pipe(
      take(1), // Prend la dernière valeur et se désabonne pour éviter des fuites de mémoire.
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true; // L'utilisateur est connecté, l'accès est autorisé.
        } else {
          // L'utilisateur n'est pas connecté.
          // On le redirige vers la page de connexion.
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }
}

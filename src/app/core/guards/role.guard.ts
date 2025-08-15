// src/app/core/guards/role.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const expectedRoles = route.data['roles'] as Array<string>;
    console.log("--- Début du RoleGuard ---");
    console.log("Rôles attendus de la route :", expectedRoles);

    return this.authService.userType$.pipe(
      take(1),
      tap(currentUserRole => {
        console.log("Rôle de l'utilisateur :", currentUserRole);
      }),
      map(currentUserRole => {
        if (!currentUserRole) {
          console.warn("Utilisateur non connecté. Redirection vers la connexion.");
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        if (expectedRoles && expectedRoles.length > 0) {
          const userRoleUpper = currentUserRole.toUpperCase();
          const expectedRolesUpper = expectedRoles.map(role => role.toUpperCase());

          console.log("Rôle utilisateur normalisé :", userRoleUpper);
          console.log("Rôles attendus normalisés :", expectedRolesUpper);

          if (expectedRolesUpper.includes(userRoleUpper)) {
            console.log("Accès autorisé ! Le rôle correspond.");
            return true;
          } else {
            console.warn(`Accès refusé. Le rôle ne correspond pas.`);
            console.warn(`Rôle actuel: ${currentUserRole}. Rôles attendus: ${expectedRoles.join(', ')}`);
            this.router.navigate(['/']);
            return false;
          }
        }

        console.log("Accès autorisé ! Aucun rôle n'est spécifié pour cette route.");
        return true;
      })
    );
  }
}

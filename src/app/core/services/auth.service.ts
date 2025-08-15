// src/app/features/auth/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

// MODIFICATION : L'interface SignupRequest est mise à jour pour des raisons de sécurité
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  message?: string;
  userType: 'ADMINISTRATEUR' | 'PROFESSEUR' | 'CANDIDAT';
}

export interface SignupRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasJwt());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userTypeSubject = new BehaviorSubject<'ADMINISTRATEUR' | 'PROFESSEUR' | 'CANDIDAT' | null>(this.getUserTypeFromStorage());
  public userType$ = this.userTypeSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private hasJwt(): boolean {
    return !!localStorage.getItem('jwt');
  }

  private getUserTypeFromStorage(): 'ADMINISTRATEUR' | 'PROFESSEUR' | 'CANDIDAT' | null {
    const userType = localStorage.getItem('userType');
    if (userType === 'ADMINISTRATEUR' || userType === 'PROFESSEUR' || userType === 'CANDIDAT') {
      return userType;
    }
    return null;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/signin`, request).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.jwt);
        localStorage.setItem('userType', response.userType);
        this.isLoggedInSubject.next(true);
        this.userTypeSubject.next(response.userType);
      })
    );
  }

  signup(request: SignupRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, request);
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userType');
    this.isLoggedInSubject.next(false);
    this.userTypeSubject.next(null);
    this.router.navigate(['/login']);
  }

  getJwt(): string | null {
    return localStorage.getItem('jwt');
  }

  getUserType(): 'ADMINISTRATEUR' | 'PROFESSEUR' | 'CANDIDAT' | null {
    const userType = localStorage.getItem('userType');
    if (userType === 'ADMINISTRATEUR' || userType === 'PROFESSEUR' || userType === 'CANDIDAT') {
      return userType;
    }
    return null;
  }

  isUserAdmin(): boolean {
    return this.getUserType() === 'ADMINISTRATEUR';
  }

  isUserProfesseur(): boolean {
    return this.getUserType() === 'PROFESSEUR';
  }

  isUserCandidat(): boolean {
    return this.getUserType() === 'CANDIDAT';
  }



}

// src/app/models/auth.model.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  message?: string;
  userType: 'ADMINISTRATEUR' | 'PROFESSEUR' | 'CANDIDAT';
}

// MODIFICATION : Le champ userType est supprimé pour des raisons de sécurité
export interface SignupRequest {
  email: string;
  password: string;
}

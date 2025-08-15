// src/app/models/user.model.ts

export interface CurrentUser {
  email: string;
  userType: 'ADMINISTRATEUR' | 'PROFESSEUR' | 'CANDIDAT';
}

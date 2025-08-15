// src/app/models/matiere.model.ts

import { Niveau } from './niveau.model';

export interface Matiere {
  codeMatiere: string;
  libelleMatiere: string;
  niveau: Niveau;
}

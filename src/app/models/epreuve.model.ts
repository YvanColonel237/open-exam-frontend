// src/app/models/epreuve.model.ts

import { Examen } from "./examen.model";
import { Matiere } from "./matiere.model";
import { Filiere } from "./filiere.model";
import { Niveau } from "./niveau.model";

export interface Epreuve {
  nombreTelechargements: number;
  id: number;
  annee: number;
  codeEpreuve: string;
  nomFichier: string;
  cheminFichier: string;
  examen: Examen;
  matiere: Matiere;
  filiere: Filiere;
  niveau: Niveau;
}

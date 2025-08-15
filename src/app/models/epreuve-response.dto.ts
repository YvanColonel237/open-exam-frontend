// src/app/models/dto/epreuve-response.dto.ts

import { Examen } from "./examen.model";
import { Matiere } from "./matiere.model";
import { Filiere } from "./examen.model";
import { Niveau } from "./niveau.model";

export interface EpreuveResponseDTO {
  anneeEpreuve: number;
  nombreTelechargements: number;
  id: number;
  annee: number;
  codeEpreuve: string;
  nomFichier: string;
  cheminFichier: string;
  nbTelechargements: number;
  examen: Examen;
  matiere: Matiere;
  filiere: Filiere;
  niveau: Niveau;
}

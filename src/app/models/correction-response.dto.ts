// src/app/models/correction-response.dto.ts

import { Epreuve } from "./epreuve.model";
import { Professeur } from "./professeur.model"; // Assurez-vous d'avoir ce modèle

export interface CorrectionResponseDTO {
  id: number;
  idCorrection: number;
  cheminDocument: string;
  cheminVideo: string;
  dateAjout: string;
  commentaire: string;
  epreuve: Epreuve;
  professeur: Professeur;
}

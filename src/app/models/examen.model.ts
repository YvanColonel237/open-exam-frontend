

export interface Examen {
  idExamen?: number;
  dateExamen: string; // LocalDate en Java est géré comme une string en TypeScript
  libelleExamen: string;
  filiere: Filiere;
  niveau: Niveau;
}

// Modèle pour Filiere, à adapter si vous avez d'autres propriétés
export interface Filiere {

  idFiliere: number;
  libelleFiliere: string;
}

// Modèle pour Niveau, à adapter si vous avez d'autres propriétés
export interface Niveau {
  idNiveau: number;
  libelleNiveau: string;
}

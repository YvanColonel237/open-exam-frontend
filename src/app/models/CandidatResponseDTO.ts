// Cette interface correspond à la structure de données renvoyée par votre API Java
export interface CandidatResponseDTO {
  idCandidat?: number;
  dateInscription?: string; // Type string car Java LocalDate sera une chaîne au format ISO
  statutCandidat?: string;

  // Informations de l'utilisateur associé
  idUtilisateur?: number;
  emailConnexion?: string;
  typeUtilisateur?: string;
  dateCreation?: string; // Type string pour la même raison que dateInscription
}

// Pour les requêtes de mise à jour, un autre DTO peut être utile
export interface CandidatRequestDTO {
  dateInscription?: string;
  statutCandidat?: string;
}

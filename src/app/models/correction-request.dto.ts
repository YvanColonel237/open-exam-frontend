// src/app/models/correction-request.dto.ts

export interface CorrectionRequestDTO {
  epreuve: { codeEpreuve: string };
  commentaire?: string;
}

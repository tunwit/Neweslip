import { DocumentPublicDTO } from "./type.document";

//Full schema from DB
export type EmployeeDocumentPublicDTO = DocumentPublicDTO;

export type CreateEmployeeDocResultDTO = {
  employeeId: number;
  fileName: string;
  tag: string | null;
  mimeType: string;
  size: number;
  uploadedBy: string;
  metadata: unknown;
  success: boolean;
  errorMessage: string;
};

export type NewEmployeeDocumentDTO = {
  files: File[];
  tag: string;
};

export type GetPresignDTO = {
  id: number;
};

export type RenameEmployeeDocumentDTO = {
  newName: string;
};

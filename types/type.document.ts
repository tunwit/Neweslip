import { UserPublicDTO } from "./type.user";

export type DocumentPublicDTO = {
  id: number;
  createdAt: Date | null;
  fileName: string;
  tag: string | null;
  mimeType: string | null;
  size: number | null;
  metadata: unknown;
  editedAt: Date | null;
  uploadedBy: UserPublicDTO;
};

export type CreateDocResultDTO = {
  fileName: string;
  tag: string | null;
  mimeType: string;
  size: number;
  uploadedBy: string;
  metadata: unknown;
  success: boolean;
  errorMessage: string;
};

export type NewDocumentDTO = {
  files: File[];
  tag: string;
};

export type DocumentUploadTargetDTO = {
  key: string;
  fileName: string;
  uploadUrl: string;
  headers: {
    "Content-Type": string;
    "Content-Disposition": string;
  };
};

export type GetPresignDTO = {
  id: number;
};

export type RenameDocumentDTO = {
  newName: string;
};

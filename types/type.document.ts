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

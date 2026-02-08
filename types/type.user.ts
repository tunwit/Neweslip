export type UserPublicDTO = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  lastSignInAt: Date | null;
  imageUrl: string;
  hasImage: boolean;
};

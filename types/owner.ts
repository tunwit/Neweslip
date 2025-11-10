export interface Owner {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null | undefined;
  hasImage: boolean;
  imageUrl: string;
  lastSignInAt: number | null;
  lastActiveAt: number | null;
}

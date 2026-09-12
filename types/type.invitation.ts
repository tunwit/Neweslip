export enum INVITATION_STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REVOKE = "REVOKE",
}

export type CreateInvitation = {
  email: string;
};

export type CreateTokenRepounseDTO = {
  inviteUrl: string;
  token: string;
};

export type InvitationPublicDTO = {
  status: INVITATION_STATUS | null;
  email: string;
  createdBy: string;
  expiresAt: Date;
  shop: {
    id: number;
    name: string;
    avatar: string | null;
  };
};

export type InvitationWithTokenDTO = InvitationPublicDTO & { token: string };

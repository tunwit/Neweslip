export interface EmailPayload {
  id: number;
  email: string;
  metaData: {
    userId: string;
  };
}

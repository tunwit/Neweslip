
//Full schema from DB
export type BranchPublicDTO = {
  id: number;
  name: string;
  nameEng: string;
  address: string;
};

export type NewBranchDTO = {
  name: string;
  nameEng: string;
  address: string;
};

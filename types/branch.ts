import { branchesTable } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

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

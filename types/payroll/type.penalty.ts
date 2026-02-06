import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { SALARY_FIELD_DEFINATION_TYPE } from "../enum/enum";
import { salaryFieldsTable } from "@/db/schema";
import {
  COMPEN_FIELD_DEFINATION_TYPE,
  COMPEN_FIELD_STATUS,
} from "../enum/enum.compensation";
import { PENALTY_METHOD, PENALTY_TYPE } from "../enum/enum.penalty";

export type PenaltyFieldPublicDTO = {
  id: number;
  name: string;
  nameEng: string;
  type: PENALTY_TYPE;
  method: PENALTY_METHOD;
  fixedAmount: string | null;
};

export type NewPenaltyFieldDTO = {
  name: string;
  nameEng: string;
  type: PENALTY_TYPE;
  method: PENALTY_METHOD;
  fixedAmount: string | null;
};

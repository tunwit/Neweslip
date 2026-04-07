import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { SALARY_FIELD_DEFINATION_TYPE } from "../enum/enum";
import { salaryFieldsTable } from "@/db/schema";
import {
  COMPEN_FIELD_DEFINATION_TYPE,
  COMPEN_FIELD_STATUS,
} from "../enum/enum.compensation";
import { OT_METHOD, OT_TYPE } from "../enum/enum.ot";

export type OTFieldPublicDTO = {
  id: number;
  name: string;
  nameEng: string;
  type: OT_TYPE;
  method: OT_METHOD;
  multiplier: string;
  fixedAmount: string | null;
};

export type NewOTFieldDTO = {
  name: string;
  nameEng: string;
  type: OT_TYPE;
  method: OT_METHOD;
  multiplier: string;
  fixedAmount: string | null;
};

export type OTValuePublicDTO = {
  id: number;
  name: string;
  nameEng: string;
  type: OT_TYPE;
  amount: string;
  method: OT_METHOD;
  multiplier: string;
  fixedAmount: string | null;
  value: string;
};

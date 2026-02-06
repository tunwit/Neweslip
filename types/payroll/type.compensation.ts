import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { SALARY_FIELD_DEFINATION_TYPE } from "../enum/enum";
import { salaryFieldsTable } from "@/db/schema";
import {
  COMPEN_FIELD_DEFINATION_TYPE,
  COMPEN_FIELD_STATUS,
} from "../enum/enum.compensation";

export type CompensationFieldPublicDTO = {
  id: number;
  name: string;
  nameEng: string;
  type: COMPEN_FIELD_DEFINATION_TYPE;
  shopId: number;
};

export type NewCompensationFieldDTO = {
  name: string;
  nameEng: string;
  type: COMPEN_FIELD_DEFINATION_TYPE;
};

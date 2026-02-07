import { employeesTable, shopsTable } from "@/db/schema";
import {
  InferColumnsDataTypes,
  InferInsertModel,
  InferModel,
  InferSelectModel,
} from "drizzle-orm";

//Full schema from DB
export type ShopPublicDTO = {
  id: number;
  name: string;
  avatar: string | null;
  avatarUrl: string | null;
};

export type ShopConfigDTO = ShopPublicDTO & {
  taxId: string;
  avatar: string | null;
  avatarUrl: string | null;

  default_work_hours_per_day: number;
  default_workdays_per_month: number;

  SMTPHost: string;
  SMTPPort: number;
  SMTPSecure: boolean;

  emailName: string | null;
  emailAddress: string | null;
  emailPassword: string | null;
};

export type NewShopDTO = {
  name: string;
  nameEng: string;
  address: string;
};

export type UpdateShopDataDTO = Partial<{
  name: string;
  avatar: string | null;

  taxId: string;

  default_work_hours_per_day: number;
  default_workdays_per_month: number;
  SMTPHost: string;
  SMTPPort: number;
  SMTPSecure: boolean;

  emailName: string | null;
  emailAddress: string | null;
  emailPassword: string | null;
}>;

export type VerifyEmailDTO = {
  SMTPHost: string;
  SMTPPort: number;
  SMTPSecure: boolean;
  emailAddress: string;
  emailPassword: string;
};

export type ChangePasswordDTO = {
  oldPassword: string;
  newPassword: string;
};

export type ChangeAvatarDTO = {
  file: File;
};

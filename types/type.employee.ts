import { InferInsertModel } from "drizzle-orm";
import { EMPLOYEE_STATUS, GENDER } from "./enum/enum.employee";
import { BranchPublicDTO } from "./type.branch";

//Full schema from DB
export type EmployeePublicDTO = {
  status: EMPLOYEE_STATUS;
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  avatar: string | null;
  gender: GENDER;
  salary: string;
  createdAt: Date;
};

export type EmployeeWithBranchDTO = EmployeePublicDTO & {
  branch: BranchPublicDTO;
};

export type EmployeeDetailedDTO = {
  id: number;
  avatar: string | null;
  createdAt: Date;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  position: string | null;
  dateOfBirth: Date | null;
  gender: GENDER;
  phoneNumber: string;
  dateEmploy: Date | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  salary: string;
  bankName: string | null;
  bankAccountOwner: string | null;
  bankAccountNumber: string | null;
  promtpay: string | null;
  branch: BranchPublicDTO;
  status: EMPLOYEE_STATUS;
};

export type NewEmployeeDTO = {
  position?: string | undefined;
  dateOfBirth?: string | undefined;
  dateEmploy?: string | undefined;
  address1?: string | undefined;
  address2?: string | undefined;
  address3?: string | undefined;
  avatar?: File | undefined;
  bankName?: string | undefined;
  bankAccountOwner?: string | undefined;
  bankAccountNumber?: string | undefined;
  promtpay?: string | undefined;
  branchId: number;
  status: EMPLOYEE_STATUS;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  gender: GENDER;
  phoneNumber: string;
  salary: string;
};

export type UpdateEmployeeDTO = Partial<NewEmployeeDTO>;

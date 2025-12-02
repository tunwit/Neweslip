import { PAYROLL_PROBLEM } from "./enum/enum";

export interface PayrollProblem {
  type: PAYROLL_PROBLEM;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
    nickName: string;
    branch: string;
    branchEng: string;
  };
  message: string;
}

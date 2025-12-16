import { PAYROLL_PROBLEM, PAYROLL_PROBLEM_CODE } from "./enum/enum";

export interface PayrollProblem {
  type: PAYROLL_PROBLEM;
  code: PAYROLL_PROBLEM_CODE;
  employee: {
    firstName: string | null;
    lastName: string | null;
  };
  meta?: Record<string, any>;
}

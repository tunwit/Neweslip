export type CalculationContext = {
  totals: {
    earnings: number;
    deductions: number;
    penalties: number;
    overtime: number;
  };
  summary: {
    gross: number;
    adjustment: number;
  };
  netPay: number;
};

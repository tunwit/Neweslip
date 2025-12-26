import {
  PAY_PERIOD_STATUS,
  SALARY_FIELD_DEFINATION_TYPE,
} from "@/types/enum/enum";
import {
  PayrollPeriodSummary,
  PayrollRecordSummary,
} from "@/types/payrollPeriodSummary";
import { dateFormat, dateTimeFormat } from "@/utils/formmatter";
import XLSX, { WorkSheet } from "xlsx-js-style";

/* ============================
   Utility: Apply Money Format
=============================== */
function applyMoneyFormat(
  ws: WorkSheet,
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
) {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      const cell = ws[cellRef];
      if (!cell) continue;

      const num = Number(cell.v);
      if (isNaN(num)) continue;

      cell.t = "n";
      cell.v = num;
      cell.z = "#,##0.00";
    }
  }
}

/* ============================
   Utility: Border Styling
=============================== */
function applyBorder(ws: any, range: any) {
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      if (!ws[cellRef]) continue;

      ws[cellRef].s = {
        ...(ws[cellRef].s || {}),
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  }
}

/* ============================
   MAIN EXPORT FUNCTION
=============================== */
export function exportSummaryAsExcel(data: PayrollPeriodSummary) {
  /* ----------------------------------
     1) Collect dynamic columns
  ----------------------------------- */
  const incomeCols = new Set<string>();
  const deductionCols = new Set<string>();
  const otValueCols = new Set<string>();
  const otCols = new Set<string>();
  const penaltyValueCols = new Set<string>();
  const penaltyCols = new Set<string>();
  const nonCalcCols = new Set<string>();

  data.records.forEach((rec) => {
    rec.fields.forEach((f) => {
      if (f.type === SALARY_FIELD_DEFINATION_TYPE.INCOME)
        incomeCols.add(f.name);
      else if (f.type === SALARY_FIELD_DEFINATION_TYPE.DEDUCTION)
        deductionCols.add(f.name);
      else nonCalcCols.add(f.name);
    });
    rec.ot.forEach((o) => otCols.add(`${o.name} (value)`));
    rec.ot.forEach((o) => otCols.add(o.name));
    rec.penalties.forEach((p) => otCols.add(`${p.name} (value)`));
    rec.penalties.forEach((p) => penaltyCols.add(p.name));
  });

  const columns = [
    "ID",
    "Employee",
    "Branch",
    "Base Salary",
    ...incomeCols,
    ...otValueCols,
    ...otCols,
    ...deductionCols,
    ...penaltyValueCols,
    ...penaltyCols,
    ...nonCalcCols,
    "Gross",
    "Deduction",
    "Net",
    "Note"
  ];

  /* ----------------------------------
     2) Build rows
  ----------------------------------- */
  const rows = data.records.map((rec) => {
    const row: any = {};

    row["ID"] = rec.employee.id;
    row["Employee"] = `${rec.employee.firstName} ${rec.employee.lastName}`;
    row["Branch"] = rec.employee.branch.name;
    row["Base Salary"] = rec.baseSalary;
    row["Gross"] = rec.totals.totalEarning;
    row["Deduction"] = rec.totals.totalDeduction;
    row["Net"] = rec.totals.net;
    row["Note"] = rec.note || "";


    /* PRE-INITALIZE ALL DYNAMIC FIELDS WITH 0 */
    [
      ...incomeCols,
      ...otValueCols,
      ...otCols,
      ...deductionCols,
      ...penaltyValueCols,
      ...penaltyCols,
      ...nonCalcCols,
    ].forEach((col) => {
      row[col] = 0; // default = 0
    });

    rec.fields
      .filter((r) => r.type === SALARY_FIELD_DEFINATION_TYPE.INCOME)
      .forEach((f) => (row[f.name] = f.amount));
    rec.fields
      .filter((r) => r.type === SALARY_FIELD_DEFINATION_TYPE.DEDUCTION)
      .forEach((f) => (row[f.name] = f.amount));
    rec.ot.forEach((o) => (row[`${o.name} (value)`] = o.value));
    rec.ot.forEach((o) => (row[o.name] = o.amount));
    rec.penalties.forEach((p) => (row[`${p.name} (value)`] = p.value));
    rec.penalties.forEach((p) => (row[p.name] = p.amount));
    rec.fields
      .filter((r) => r.type === SALARY_FIELD_DEFINATION_TYPE.NON_CALCULATED)
      .forEach((f) => (row[f.name] = f.amount));

    return row;
  });

  /* ----------------------------------
     3) Create sheet at row 5
  ----------------------------------- */
  const ws = XLSX.utils.json_to_sheet(rows, {
    origin: "A5",
    header: columns,
  } as any);

  /* ----------------------------------
     Now define setCell AFTER ws exists
  ----------------------------------- */
  function setCell(
    cell: string,
    text: string | number,
    size = 18,
    bold = false,
    center = false,
    format: "s" | "n" = "s",
  ) {
    ws[cell] = {
      t: format,
      v: text,
      ...(format === "n" ? { z: "#,##0.00" } : {}),
      s: {
        font: { name: "TH SarabunPSK", sz: size, bold },
        alignment: center ? { horizontal: "center", vertical: "center" } : {},
      },
    };
  }

  /* ----------------------------------
     4) Add Title + Info Rows
  ----------------------------------- */
  setCell("A1", "Payroll Summary", 20, true, true);

  if (data.status === PAY_PERIOD_STATUS.DRAFT) {
    setCell("A2", "Draft version not a final summary", 18, true, true);
    ws["A2"].s.fill = { fgColor: { rgb: "ffff61" } };
  }

  setCell(
    "A3",
    `Period: ${dateFormat(
      new Date(data.start_period),
    )} - ${dateFormat(new Date(data.end_period))}`,
  );

  setCell("D3", `Total Employee: ${data.employeeCount}`, 18);
  setCell("G3", `Generated on: ${dateTimeFormat(new Date())}`, 18);

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
    { s: { r: 2, c: 3 }, e: { r: 2, c: 4 } },
    { s: { r: 2, c: 6 }, e: { r: 2, c: 8 } },
  ];

  /* ----------------------------------
     5) Style header row (Row 5)
  ----------------------------------- */
  const HEADER_ROW = 4; // 0-indexed → Row 5

  columns.forEach((col, index) => {
    const cellRef = XLSX.utils.encode_cell({ r: HEADER_ROW, c: index });
    if (!ws[cellRef]) return;

    ws[cellRef].s = {
      font: { bold: true, sz: 14, name: "TH SarabunPSK" },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "8fa7cf" } },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  });

  /* ----------------------------------
     6) Apply Money Format ONLY to numeric columns
  ----------------------------------- */
  const dataStartRow = 5;
  const dataEndRow = dataStartRow + rows.length - 1;
  const moneyStartCol = 3; // Base Salary column
  const moneyEndCol = columns.length - 1; // Net column

  applyMoneyFormat(ws, dataStartRow, moneyStartCol, dataEndRow, moneyEndCol);

  /* ----------------------------------
     7) Add Totals Row
  ----------------------------------- */
  const totalRow = dataEndRow + 1;

  setCell(
    XLSX.utils.encode_cell({ r: totalRow, c: columns.length - 5 }),
    "Total",
    18,
    true,
    true,
  );
  setCell(
    XLSX.utils.encode_cell({ r: totalRow, c: columns.length - 4 }),
    data.totalEarning,
    18,
    true,
    true,
    "n",
  );
  setCell(
    XLSX.utils.encode_cell({ r: totalRow, c: columns.length - 3 }),
    data.totalDeduction,
    18,
    true,
    true,
    "n",
  );
  setCell(
    XLSX.utils.encode_cell({ r: totalRow, c: columns.length - 2 }),
    data.totalNet,
    18,
    true,
    true,
    "n",
  );

  /* ----------------------------------
     8) Column widths & Row heights
  ----------------------------------- */
  ws["!cols"] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 18 },
    ...columns.slice(3).map(() => ({ wch: 12 })),
  ];

  ws["!rows"] = [
    { hpt: 26 },
    { hpt: 19 },
    { hpt: 23 },
    { hpt: 20 },
    { hpt: 28 },
    ...rows.map(() => ({ hpt: 25 })),
    { hpt: 25 },
  ];

  /* ----------------------------------
     9) Fix !ref range correctly
  ----------------------------------- */
  const range = XLSX.utils.decode_range(ws["!ref"] as any);
  range.e.r = totalRow;
  ws["!ref"] = XLSX.utils.encode_range(range);
  const tableRange = {
    s: { r: 4, c: 0 }, // A5
    e: { r: totalRow, c: columns.length - 1 }, // Last row & last column
  };
  applyBorder(ws, tableRange);

  /* ----------------------------------
     10) Create Workbook
  ----------------------------------- */
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payroll Summary");

  return XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
    cellStyles: true,
  });
}

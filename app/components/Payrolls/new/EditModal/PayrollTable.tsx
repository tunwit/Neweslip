import { moneyFormat } from "@/utils/formmatter";
import { Checkbox, Table } from "@mui/joy";
import Decimal from "decimal.js";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface PayrollTableProps<T extends { id: number }> {
  data: T[];
  renderName: (item: T) => string;
  renderAmount: (item: T) => number;
  showIncomeRow?: boolean;
  salary?: string;
  showValueColumn?: boolean; // show hours/units column
  autoCalculate?: boolean; // disable amount input & auto calc
  calculateAmount?: (item: T, value: number) => number;
  amountValues: Record<number, { amount: number; value?: number }>;
  setInputValues: Dispatch<
    SetStateAction<Record<number, { amount: number; value?: number }>>
  >;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
  baseSalary?: Decimal;
  setBaseSalary?: Dispatch<SetStateAction<Decimal>>;
  showFooter?:boolean
}

export default function PayrollTable<T extends { id: number }>({
  data,
  renderName,
  renderAmount,
  showIncomeRow = false,
  salary,
  showValueColumn = false,
  autoCalculate = false,
  calculateAmount,
  amountValues,
  setInputValues,
  setIsDirty,
  baseSalary,
  setBaseSalary,
  showFooter=true
}: PayrollTableProps<T>) {
  const [total, setTotal] = useState<Decimal>();
  
  const updateValue = (id: number, val: number) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: {
        value: prev[id]?.value ?? undefined,
        amount: val,
      },
    }));
    setIsDirty(true);
  };

  useEffect(() => {
    const sum = Object.values(amountValues).reduce((acc, v) => {
      return acc.plus(v?.amount ?? 0);
    }, new Decimal(0));

    const totalSum = showIncomeRow ? sum.plus(baseSalary ?? 0) : sum;
    setTotal(totalSum);
  }, [amountValues, showIncomeRow, baseSalary]);

  useEffect(() => {
    if (!autoCalculate || !calculateAmount || !data) return;

    setInputValues((prev) => {
      let updated = { ...prev };
      let changed = false;

      data.forEach((item: any) => {
        const value = prev[item.id]?.value ?? item.value ?? 0;
        const newAmount = calculateAmount(item, value);

        if (!prev[item.id] || prev[item.id].amount !== newAmount) {
          updated[item.id] = { value, amount: newAmount };
          changed = true;
        }
      });

      // Only return updated object if something changed
      return changed ? updated : prev;
    });

    if (data.length > 0) setIsDirty(true);
  }, [baseSalary, autoCalculate, calculateAmount, data]);

  const applyAutoAmount = (item: any, v: number) => {
    if (!autoCalculate || !calculateAmount) return;

    const newAmount = calculateAmount(item, v);
    setInputValues((prev) => ({
      ...prev,
      [item.id]: {
        value: v,
        amount: newAmount,
      },
    }));
    setIsDirty(true);
  };

  useEffect(() => {
    if (!data || Object.keys(amountValues).length > 0) return; // prevents infinite loop

    setInputValues((prev) => {
      const updated: Record<number, { amount: number; value?: number }> = {
        ...prev,
      };

      data.forEach((item: any) => {
        if (!updated[item.id]) {
          updated[item.id] = {
            amount: renderAmount(item),
            value: item.value ?? undefined,
          };
        }
      });

      return updated;
    });
  }, [data, baseSalary]);

  return (
    <div className="overflow-auto max-h-[calc(100vh-350px)]">
      <Table stickyHeader stickyFooter>
        <thead>
          <tr>
            <th className="w-8 lg:w-[5%] "></th>
            <th>Title</th>
            {showValueColumn && <th>Value</th>}
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {showIncomeRow && (
            <tr key={-1}>
              <td>
                <Checkbox checked={true} />
              </td>

              <td>Base Salary</td>

              {/* Amount */}
              <td>
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={baseSalary?.toNumber()}
                  onChange={(e) => {
                    setBaseSalary
                      ? setBaseSalary(new Decimal(e.target.value || 0))
                      : {};
                    setIsDirty(true);
                  }}
                  placeholder="0"
                />
              </td>
            </tr>
          )}

          {data.map((item: any) => {
            const record = amountValues[item.id];
            const value = record?.value ?? item.value;
            const amount = record?.amount ?? renderAmount(item);

            return (
              <tr key={item.id}>
                <td>
                  <Checkbox checked={true} />
                </td>

                <td>{renderName(item)}</td>

                {/* Value Column */}
                {showValueColumn && (
                  <td>
                    <input
                      type="number"
                      className="border rounded px-2 py-1 w-full"
                      value={value}
                      onChange={(e) => {
                        applyAutoAmount(item, Number(e.target.value));
                      }}
                      placeholder="0"
                    />
                  </td>
                )}

                {/* Amount */}
                <td>
                  <input
                    type="number"
                    className={`px-2 py-1 w-full rounded ${
                      autoCalculate
                        ? "bg-gray-200 cursor-not-allowed"
                        : "border"
                    }`}
                    value={amount}
                    readOnly={autoCalculate}
                    onChange={(e) => {
                      if (!autoCalculate)
                        updateValue(item.id, Number(e.target.value));
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot hidden={!showFooter}>
          <tr>
            <th colSpan={showValueColumn ? 3 : 2}>Total</th>
            <th>{moneyFormat(total || 0)}</th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

import { moneyFormat } from "@/utils/moneyFormat";
import { Checkbox, Table } from "@mui/joy";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface PayrollTableProps<T extends { id: number }> {
  data: T[];
  renderName: (item: T) => string;
  renderAmount: (item: T) => number;
  showIncomeRow?: boolean;
  salary?:number
  showValueColumn?: boolean;  // show hours/units column
  autoCalculate?: boolean;    // disable amount input & auto calc
  calculateAmount?: (item: T, value: number) => number;
  amountValues: Record<number, { amount: number ,value?:number}>;
  setInputValues: Dispatch<SetStateAction<Record<number, { amount: number,value?:number }>>>;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
}


export default function PayrollTable<T>({
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
  setIsDirty
}: PayrollTableProps<T>) {

  const [total, setTotal] = useState(0);
  const updateValue = (id: number, val: number) => {    
    setInputValues(prev => ({
      ...prev,
      [id]: {
        value: prev[id]?.value ?? undefined,
        amount: val,
      },
    }));
    setIsDirty(true)
  };

  useEffect(() => {
    let sum = Object.values(amountValues).reduce(
        (a, b) => a + (b?.amount || 0),
        0
      );

    if(showIncomeRow) {
      sum+=salary ?? 0
    }
    setTotal(sum)
  }, [amountValues]);

  useEffect(() => {
    const sum = Object.values(amountValues).reduce(
        (a, b) => a + (b?.amount || 0),
        0
      );
    setTotal(sum);
    }, []); // run once on mount

  
  const applyAutoAmount = (item: any ,v:number) => {
    if(!autoCalculate || !calculateAmount) return
   
    const newAmount = calculateAmount(item, v);
    setInputValues(prev => ({
      ...prev,
      [item.id]: {
        value: v,
        amount: newAmount,
      },
    }));
    setIsDirty(true)

  }
useEffect(() => {
  if (!data || Object.keys(amountValues).length > 0) return; // prevents infinite loop

  setInputValues(prev => {
    const updated: Record<number, { amount: number; value?: number }> = { ...prev };

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
}, [data]);



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
          {showIncomeRow && 
          <tr key={-1}>
            <td>
              <Checkbox checked={true} />
            </td>

            <td>Base Salary</td>

            {/* Amount */}
            <td>
              <p>{salary}</p>
            </td>
          </tr>}
          
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
                      onChange={e => applyAutoAmount(item, Number(e.target.value))}
                      placeholder="0"
                    />
                  </td>
                )}

                {/* Amount */}
                <td>
                  <input
                    type="number"
                    className={`px-2 py-1 w-full rounded ${
                      autoCalculate ? "bg-gray-200 cursor-not-allowed" : "border"
                    }`}
                    value={amount}
                    readOnly={autoCalculate}
                    onChange={e => {
                      if (!autoCalculate) updateValue(item.id, Number(e.target.value));
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={showValueColumn ? 3 : 2}>Total</th>
            <th>{moneyFormat(total)}</th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

import { Checkbox, Table } from "@mui/joy";
import React from "react";

interface PayrollIncomeTableProps {
  amount: number;
}

const INCOME = ["Position fee", "เบี้ยขยัน	", "สวัสดิการ", "ยอดเป้า", "โบนัส"];

export default function PayrollIncomeTable({
  amount,
}: PayrollIncomeTableProps) {
  return (
    <>
      <div className="overflow-auto max-h-[calc(100vh-350px)] ">
        <Table aria-label="basic table" stickyHeader stickyFooter>
          <thead>
            <tr>
              <th className="w-[5%]"></th>
              <th style={{ width: "70%" }}>Title</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="flex">
                  <Checkbox
                    checked={true}
                    disabled
                    style={{
                      transform: "scale(0.9)",
                    }}
                  />
                </div>
              </td>
              <td>Base Salary</td>
              <td>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="0.00"
                    defaultValue={amount}
                    className="w-full px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700  focus:border-transparent transition-all"
                  />
                  <p className="text-md">฿</p>
                </div>
              </td>
            </tr>
            {INCOME.map((v, i) => {
              return (
                <tr>
                  <td>
                    <div className="flex">
                      <Checkbox
                        checked={true}
                        style={{
                          transform: "scale(0.9)",
                        }}
                      />
                    </div>
                  </td>
                  <td>{v}</td>
                  <td>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700  focus:border-transparent transition-all"
                      />
                      <p className="text-md">฿</p>
                    </div>
                  </td>
                </tr>
              );
            })}
            {/* <tr>
              <td>
                <Checkbox checked={true} />
              </td>
              <td>OT (ชั่วโมง)</td>
              <td>
                <p className="w-full px-3 py-1">0.00</p>
              </td>
            </tr>
            <tr>
              <td>
                <Checkbox checked={true} />
              </td>
              <td>OT (วัน)</td>
              <td>
                <p className="w-full px-3 py-1">0.00</p>
              </td>
            </tr>
            <tr>
              <td>
                <Checkbox checked={true} />
              </td>
              <td>OT (x3)</td>
              <td>
                <p className="w-full px-3 py-1">0.00</p>
              </td>
            </tr> */}
          </tbody>
          <tfoot className="bg-red-100">
            <tr>
              <th colSpan={2}>Totals</th>
              <th>1,234</th>
            </tr>
          </tfoot>
        </Table>
      </div>
    </>
  );
}

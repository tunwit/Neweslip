import { Table } from "@mui/joy";
import React from "react";

const OT_ABSENT = [
  "OT (day)",
  "OT (hour)",
  "OT (x3)",
  "ขาด",
  "สาย",
  "ลาป่วย",
  "ลากิจ",
  "ลาพักร้อน",
];

export default function PayrollOTAbsentTable() {
  return (
    <>
      <div className="max-h-96 overflow-auto">
        <Table aria-label="basic table" stickyHeader stickyFooter>
          <thead>
            <tr>
              <th style={{ width: "80%" }}>Title</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {OT_ABSENT.map((v, i) => {
              return (
                <tr>
                  <td>{v}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-700  focus:border-transparent transition-all"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-red-100">
            <tr>
              <th>Totals</th>
              <td>1,319</td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </>
  );
}

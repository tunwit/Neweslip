"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Table } from "@mui/joy";
import React, { useState } from "react";
import AddIncomeModal from "./AddIncomeModal";

export default function IncomeTable() {
  const [open, setOpen] = useState<boolean>(false);
  const addIncomeHandler = () =>{
    setOpen(true);
  }

  return (
    <>
      <AddIncomeModal open={open} setOpen={setOpen} />
      <div>
        <div className="border border-[#d8d8d8] rounded-md px-1 max-h-[calc(100vh-350px)] overflow-auto">
          <Table stickyHeader hoverRow variant="plain" noWrap>
            <thead>
              <tr>
                <th className="font-medium">Label</th>
                <th className="font-medium w-[5%]"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Position fee</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>เบี้ยขยัน</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>สวัสดิการ</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>

              <tr>
                <td>ยอดเป้า</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>

              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
              <tr>
                <td>โบนัส</td>
                <td>
                  <Icon icon={"ic:baseline-edit"} className="text-xl" />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="mt-2">
          <Button onClick={()=>addIncomeHandler()}>Add Income</Button>
        </div>
      </div>
    </>
  );
}

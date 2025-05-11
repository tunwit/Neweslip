import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Table } from "@mui/joy";
import React, { useState } from "react";
import AddDeductionModal from "./AddDeductionModal";

export default function DeductionTable() {
  const [open, setOpen] = useState<boolean>(false);
  const addDeductionhandler = () => {
    setOpen(true);
  };
  return (
    <>
      <div className="border border-[#d8d8d8] rounded-md px-1 max-h-[calc(100vh-400px)] overflow-auto">
        <AddDeductionModal open={open} setOpen={setOpen} />
        <Table stickyHeader hoverRow variant="plain" noWrap>
          <thead>
            <tr>
              <th className="font-medium">Label</th>
              <th className="font-medium w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>เบิก</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>ประกันสังคม</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>จ่ายเงินกู้</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="mt-2">
        <Button onClick={() => addDeductionhandler()}>Add Deduction</Button>
      </div>
    </>
  );
}

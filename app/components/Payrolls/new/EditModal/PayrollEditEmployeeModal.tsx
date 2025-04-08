import { Modal, ModalClose, ModalDialog, ModalOverflow } from "@mui/joy";
import React from "react";

interface PayrollEditEmployeeModalProps {
  name: string;
  amount: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PayrollEditEmployeeModal({
  name,
  amount,
  open,
  setOpen,
}: PayrollEditEmployeeModalProps) {
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalOverflow>
          <ModalDialog sx={{ background: "#fafafa" }}>
            <ModalClose />
            <p>Modal</p>
            <p className="text-3xl font-bold">{name}</p>
            <div className="grid grid-cols-3 gap-5 bg-white p-4 rounded-sm shadow-sm">
              <div>
                <p className="font-bold">Income</p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  <p>Base salary</p>
                  <input
                    defaultValue={amount}
                    className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1"
                  />

                  <p>Position fee</p>
                  {/* <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" /> */}
                  <input className="focus:outline-none  border-b  w-20 px-1" />

                  <p>OT (day)</p>
                  {/* <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" /> */}
                  <input className="focus:outline-none bg-[#edf1f6] border border-[#c5c9cf] rounded-sm w-20 px-1" />

                  <p>OT (hour)</p>
                  <input className="focus:outline-none bg-[#edf1f6] border border-[#c5c9cf] rounded-sm w-20 px-1" />

                  <p>OT (x3)</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>เบี้ยขยัน</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>สวัสดิการ</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>ยอดเป้า</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>โบนัส</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />
                </div>
              </div>

              <div>
                <p className="font-bold">Deduction</p>
                <div className="grid grid-cols-2 gap-4">
                  <p>เบิก</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>ประกันสังคม</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>จ่ายเงินกู้</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>หนี้</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>สาย</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>ลา</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />
                </div>
              </div>
              <div>
                <p className="font-bold">Details</p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  <p>Base salary</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>Position fee</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>OT (day)</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>OT (hour)</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>OT (x3)</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>เบี้ยขยัน</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>สวัสดิการ</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>ยอดเป้า</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>โบนัส</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />
                </div>
              </div>
            </div>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </>
  );
}

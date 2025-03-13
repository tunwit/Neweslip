import {
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Typography,
} from "@mui/joy";
import React from "react";
import EmployeeStatus from "./EmployeeStatus";
import EmployeeDetailsModalInput from "./EmployeeDetailsModalInput";

interface EmployeeDetailsModalProps {
  name: string;
  email: string;
  nickname: string;
  amount: number;
  branch: string;
  status: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function EmployeeDetailsModal({
  name,
  email,
  nickname,
  amount,
  branch,
  status,
  open,
  setOpen,
}: EmployeeDetailsModalProps) {
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalOverflow>
          <ModalDialog sx={{ background: "#fafafa" }}>
            <ModalClose />
            <div className="flex flex-row gap-10 items-center p-2">
              <div className="flex gap-4  items-center">
                <div className="bg-teal-400 w-20 h-20 text-center rounded-full flex items-center justify-center">
                  <p className="text-xl">{name.charAt(0)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2 justify-center">
                  <p className="font-bold text-xl">{name}</p>
                  <EmployeeStatus status={status} />
                </div>

                {/* <p className="text-sm opacity-55">Manager</p> */}
                <EmployeeDetailsModalInput disabled={false} value="Manager" />
              </div>
            </div>

            <div className="flex flex-col gap-3 ">
              <div className="bg-white rounded-sm shadow-sm py-3 px-4">
                <p>Personal Infomation</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Employee ID</p>
                    <p>EMP0001</p>
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Email</p>
                    <EmployeeDetailsModalInput disabled={false} value={email} />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Nick name</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value={nickname}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Gender</p>
                    <EmployeeDetailsModalInput disabled={false} value="Male" />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Phone</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value="0952475183"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-sm shadow-sm py-3 px-4">
                <p>Address</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                  <div className="grid grid-cols-2">
                    <p className="font-semibold">House number</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value="58/297"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Village</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value="สราญสิริ"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Subdistrict (Tambon)</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value="บางตะไนย์"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">District (Amphoe)</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value="ปากเกร็ด"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Province</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value="นนทบุรี"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Zipcode</p>
                    <EmployeeDetailsModalInput disabled={false} value="11120" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-sm shadow-sm py-3 px-4">
                <p>Job Information</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Base Salary</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value={amount}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Date Employ</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value={"15 มกราคม 2566"}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Branch</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value={"Pakkret"}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Bank</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value={"กสิกรไทย"}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Bank Account</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value={"4199 5688 4758"}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-semibold">Account Owner</p>
                    <EmployeeDetailsModalInput
                      disabled={false}
                      value={"Thanut Thappota"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </>
  );
}

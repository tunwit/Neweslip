import {
  Button,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Typography,
} from "@mui/joy";
import React, { useState } from "react";
import EmployeeStatus from "./EmployeeStatus";
import EmployeeDetailsModalInput from "./EmployeeDetailsModalInput";
import { Edit, Save } from "@mui/icons-material";

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
  const [editmode, setEditmode] = useState(false);

  const handlerEdit = () => {
    setEditmode(!editmode);
  };
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalOverflow>
          <ModalDialog sx={{ background: "#fafafa" }}>
            <ModalClose />
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-10 items-center p-2">
                <div className="flex gap-4  items-center">
                  <div className="bg-teal-400 w-20 h-20 text-center rounded-full flex items-center justify-center">
                    <p className="text-xl">{name.charAt(0)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 ">
                  <div className="flex flex-row gap-2">
                    <p className="font-bold text-xl">{name}</p>
                    <EmployeeStatus status={status} />
                  </div>
                  <EmployeeDetailsModalInput
                    disabled={!editmode}
                    value="Manager"
                  />
                </div>
              </div>
              <div className="ml-auto">
                {editmode ? (
                  <Button
                    onClick={() => handlerEdit()}
                    startDecorator={<Save sx={{ fontSize: "16px" }} />}
                    sx={{ fontSize: "12px", gap: 0 }}
                    size="sm"
                    variant="outlined"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlerEdit()}
                    startDecorator={<Edit sx={{ fontSize: "16px" }} />}
                    sx={{ fontSize: "12px", gap: 0 }}
                    size="sm"
                    variant="outlined"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 ">
              <div className="bg-white rounded-sm shadow-sm py-3 px-4">
                <p className="font-semibold mb-2">Personal Infomation</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                  <div className="grid grid-cols-2">
                    <p>Employee ID</p>
                    <p>EMP0001</p>
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Email</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value={email}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Nick name</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value={nickname}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Gender</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value="Male"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Phone</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value="0952475183"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-sm shadow-sm py-3 px-4">
                <p className="font-semibold mb-2">Address</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                  <div className="grid grid-cols-2">
                    <p>House number</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value="58/297"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Village</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value="สราญสิริ"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Subdistrict (Tambon)</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value="บางตะไนย์"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>District (Amphoe)</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value="ปากเกร็ด"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Province</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value="นนทบุรี"
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Zipcode</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value="11120"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-sm shadow-sm py-3 px-4">
                <p className="font-semibold mb-2">Job Information</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                  <div className="grid grid-cols-2">
                    <p>Base Salary</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value={amount}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Date Employ</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value={"15 มกราคม 2566"}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Branch</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value={"Pakkret"}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Bank</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value={"กสิกรไทย"}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Bank Account</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
                      value={"4199 5688 4758"}
                    />
                  </div>

                  <div className="grid grid-cols-2">
                    <p>Account Owner</p>
                    <EmployeeDetailsModalInput
                      disabled={!editmode}
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

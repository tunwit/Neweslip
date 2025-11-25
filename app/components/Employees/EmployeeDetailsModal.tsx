"use client";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Edit, Save } from "@mui/icons-material";
import BranchSelector from "../../../widget/BranchSelector";
import { Employee, EmployeeWithShop, NewEmployee } from "@/types/employee";
import StatusSelector from "@/widget/StatusSelector";
import { changeEmployeeStatus } from "@/app/action/changeEmployeeStatus";
import EmployeeStatusBadge from "./EmployeeStatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import {
  createEmployeeFormField,
  createEmployeeFormSchema,
} from "@/types/formField";
import EmployeeDetailsForm from "./EmployeeDetailsForm";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { useZodForm } from "@/lib/useZodForm";
import normalizeNull from "@/utils/normallizeNull";
import { updateEmployee } from "@/app/action/updateEmployee";
import { useSnackbar } from "@/hooks/useSnackBar";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useUser } from "@clerk/nextjs";

interface EmployeeDetailsModalProps {
  employee: EmployeeWithShop;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function EmployeeDetailsModal({
  employee,
  open,
  setOpen,
}: EmployeeDetailsModalProps) {
  const [status, setStatus] = useState(employee.status);
  const queryClient = useQueryClient();
  const user = useUser();

  const handlerChangeStatus = async (newValue: EMPLOYEE_STATUS) => {
    setStatus(newValue);
    try {
      await changeEmployeeStatus({ employeeId: employee.id, status: newValue ,userId: user.user?.id || null});
      showSuccess(`Change Status to ${newValue} successful`);
    } catch (err) {
      showError(`Change Status failed\n${err}`);
    }

    queryClient.invalidateQueries({ queryKey: ["employees"] });
  };
  const { show, setMessage } = useSnackbar();


  const methods = useZodForm(createEmployeeFormSchema, {
    defaultValues: normalizeNull({
      avatar: employee.avatar,
      position: employee.position,
      firstName: employee.firstName,
      lastName: employee.lastName,
      nickName: employee.nickName,
      email: employee.email,
      dateOfBirth: employee.dateOfBirth
        ? new Date(employee.dateOfBirth)
        : undefined,
      phoneNumber: employee.phoneNumber,
      gender: employee.gender,
      branchId: employee.branch.id,
      salary: employee.salary,
      dateEmploy: employee.dateEmploy
        ? new Date(employee.dateEmploy)
        : undefined,
      bankName: employee.bankName,
      bankAccountNumber: employee.bankAccountNumber,
      bankAccountOwner: employee.bankAccountOwner,
      promtpay: employee.promtpay,
      status: employee.status,
    }),
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid, dirtyFields },
  } = methods;

  const onSave = async (data: createEmployeeFormField) => {
    try {
      await updateEmployee(employee.id, normalizeNull(data),user.user?.id || null);
      reset(data);
      showSuccess(`update employee successful`);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch (err) {
      showError(`Update employee failed failed\n${err}`);
    }
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          sx={{ background: "#fafafa", overflow: "scroll", width: "70%" }}
        >
          <ModalClose />
          <div className="flex flex-row justify-between items-center ">
            <div className="flex flex-row gap-10 items-center p-2">
              <div className="flex gap-4  items-center">
                <div className="bg-teal-400 w-20 h-20 text-center rounded-full flex items-center justify-center">
                  <p className="text-xl">{employee.firstName.charAt(0)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-0 ">
                <div className="flex flex-row gap-2">
                  <p className="font-bold text-xl">
                    {employee.firstName + " " + employee.lastName}
                  </p>
                  <EmployeeStatusBadge status={status} />
                  <StatusSelector
                    status={status}
                    onChange={handlerChangeStatus}
                  />
                </div>
                <div className="grid grid-cols-2">
                  <p>EMP{String(employee.id).padStart(3, "0")}</p>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <Button
                disabled={Object.keys(dirtyFields).length <= 0 || !isValid}
                onClick={handleSubmit(onSave)}
                startDecorator={<Save sx={{ fontSize: "16px" }} />}
                sx={{ fontSize: "12px", gap: 0 }}
                size="sm"
                variant="outlined"
              >
                Save
              </Button>
            </div>
          </div>
          <FormProvider {...methods}>
            <EmployeeDetailsForm employee={employee} />
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  );
}

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
  Tab,
  tabClasses,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { Edit, Save } from "@mui/icons-material";
import BranchSelector from "../../../widget/BranchSelector";
import { Employee, EmployeeWithShop, NewEmployee } from "@/types/employee";
import StatusSelector from "@/widget/StatusSelector";
import { changeEmployeeStatus } from "@/app/action/employee/changeEmployeeStatus";
import EmployeeStatusBadge from "./EmployeeStatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import {
  createEmployeeFormField,
  createEmployeeFormSchema,
} from "@/types/formField";
import EmployeeDetailsForm from "./detailsTab/EmployeeDetailsForm";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { useZodForm } from "@/lib/useZodForm";
import normalizeNull from "@/utils/normallizeNull";
import { updateEmployee } from "@/app/action/employee/updateEmployee";
import { useSnackbar } from "@/hooks/useSnackBar";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useUser } from "@clerk/nextjs";
import EmployeeDetailsFiles from "./documentsTab/EmployeeDetailsDocuments";
import EmployeeDetailsDocuments from "./documentsTab/EmployeeDetailsDocuments";
import { useTranslations } from "next-intl";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { changeEmployeeAvatar } from "@/app/action/employee/changeEmployeeAvatar";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { deleteEmployeeAvatar } from "@/app/action/employee/deleteEmployeeAvatar";

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
  const { user } = useUser();
  const { id: shopId } = useCurrentShop();

  const t = useTranslations("employees");

  const handlerChangeStatus = async (newValue: EMPLOYEE_STATUS) => {
    setStatus(newValue);
    try {
      await changeEmployeeStatus({
        employeeId: employee.id,
        status: newValue,
        userId: user?.id || null,
      });
      showSuccess(`Change Status to ${newValue} successful`);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch (err) {
      showError(`Change Status failed\n${err}`);
    }
  };

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
      salary: Number(employee.salary) || 0,
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
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid, dirtyFields, errors, isValidating },
  } = methods;

  const onSave = async (data: createEmployeeFormField) => {
    try {
      await updateEmployee(employee.id, normalizeNull(data), user?.id || null);
      reset(data);
      setOpen(false);
      showSuccess(`update employee successful`);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch (err) {
      showError(`Update employee failed failed\n${err}`);
    }
  };

  const handleSelectFile = async (file?: File) => {
    if (!file || !shopId || !user) return;
    try {
      await changeEmployeeAvatar(
        file,
        employee.id,
        shopId,
        user.id,
        employee.avatar,
      );
      showSuccess("Change avatar sucessful");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch (err) {
      showError(`Change avatar failed ${err}`);
    }
  };
  const handleRemove = async () => {
    if (!employee?.avatar || !shopId || !user) return;
    try {
      await deleteEmployeeAvatar(employee.avatar, employee.id, shopId, user.id);
      queryClient.invalidateQueries({
        queryKey: ["employees"],
        exact: false,
      });
      showSuccess("Remove avatar sucessful");
    } catch (err) {
      showError(`Remove avatar failed ${err}`);
    }
  };

  const avatar = `${process.env.NEXT_PUBLIC_CDN_URL}/${employee.avatar}`;

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} sx={{ zIndex: 100 }}>
        <ModalDialog
          sx={{ background: "#fafafa", overflow: "scroll", width: "70%" }}
        >
          <ModalClose />
          <div className="flex flex-row justify-between items-center ">
            <div className="flex flex-row gap-10 items-center p-2">
              <div className="flex gap-4  items-center">
                <ChangableAvatar
                  src={avatar}
                  editable={true}
                  size={80}
                  fallbackTitle={employee.firstName.charAt(0)}
                  onChange={handleSelectFile}
                  onRemove={handleRemove}
                />
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
                disabled={Object.keys(dirtyFields).length <= 0}
                onClick={handleSubmit(onSave)}
                startDecorator={<Save sx={{ fontSize: "16px" }} />}
                sx={{ fontSize: "12px", gap: 0 }}
                size="sm"
                variant="outlined"
              >
                {t("actions.save")}
              </Button>
            </div>
          </div>

          <Tabs
            aria-label="Basic tabs"
            defaultValue={0}
            orientation="horizontal"
          >
            <TabList
              sx={{
                [`& .${tabClasses.root}`]: {
                  fontSize: "sm",
                  fontWeight: "lg",
                  [`&[aria-selected="true"]`]: {
                    bgcolor: "background.surface",
                  },
                  [`&.${tabClasses.focusVisible}`]: {
                    outlineOffset: "-4px",
                  },
                },
              }}
            >
              <Tab>{t("tabs.details")}</Tab>
              <Tab>{t("tabs.documents")}</Tab>
            </TabList>
            <TabPanel value={0}>
              <FormProvider {...methods}>
                <EmployeeDetailsForm employee={employee} />
              </FormProvider>
            </TabPanel>
            <TabPanel value={1}>
              <EmployeeDetailsDocuments
                title="Personal Documents"
                tag="personal"
                employeeId={employee.id}
              />
            </TabPanel>
          </Tabs>
        </ModalDialog>
      </Modal>
    </>
  );
}

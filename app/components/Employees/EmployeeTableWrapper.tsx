import { Pagination } from "@mui/material";
import EmployeesTable from "./EmployeesTable";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import {
  EMPLOYEE_ORDERBY,
  EMPLOYEE_SORTBY,
  EMPLOYEE_STATUS,
} from "@/types/enum/enum";
import { Button } from "@mui/joy";
import { deleteEmployee } from "@/app/action/employee/deleteEmployee";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/hooks/useSnackBar";
import { useCheckBox } from "@/hooks/useCheckBox";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { auth } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { useDeleteEmployee, useEmployees } from "@/hooks/hook.employee";

interface EmployeeTableWrapperProps {
  sortBy?: EMPLOYEE_SORTBY;
  orderBy?: EMPLOYEE_ORDERBY;
  search_query?: string;
  branchId?: number;
  status?: EMPLOYEE_STATUS | null;
}

export function EmployeeTableWrapper({
  sortBy,
  orderBy,
  search_query,
  branchId,
  status,
}: EmployeeTableWrapperProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const { data, isError, isSuccess, isLoading } = useEmployees({
    sortBy,
    orderBy,
    search_query,
    branchId,
    status,
    page,
    limit,
  });

  const { checked, uncheckall } = useCheckBox<number>("allEmployeeTable");
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();
  const t = useTranslations("employees");
  const tnm = useTranslations("new_employees.modal.delete");
  const { mutateAsync: deleteMutate } = useDeleteEmployee();

  const user = useUser();

  const onPageChange = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const onDeleteEmployee = async () => {
    try {
      if (!shopId) return;
      uncheckall();
      await deleteMutate({ ids: checked });
      showSuccess(tnm("success"));
    } catch (err: any) {
      showError(tnm("fail", { err: err.message }));
    }
  };
  return (
    <>
      <section className="flex flex-col justify-center items-center w-full">
        <div className="w-full -mt-3">
          <Button
            disabled={checked ? checked.length === 0 : true}
            variant="plain"
            onClick={() => {
              onDeleteEmployee();
            }}
          >
            <p className="underline font-medium">{t("actions.delete")}</p>
          </Button>
        </div>
        <div className="mb-3 w-full border border-[#d4d4d4] rounded-sm max-h-[calc(100vh-400px)] overflow-x-auto overflow-y-auto shadow-sm">
          <div>
            <EmployeesTable
              data={data}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
          </div>
        </div>
        <Pagination
          count={data?.pagination.totalPages || 1}
          page={data?.pagination.page || page}
          onChange={onPageChange}
          shape="rounded"
          size="medium"
        />
      </section>
    </>
  );
}

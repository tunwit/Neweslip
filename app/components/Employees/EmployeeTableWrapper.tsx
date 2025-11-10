import { Pagination } from "@mui/material";
import EmployeesTable from "./EmployeesTable";
import { useEmployees } from "@/hooks/useEmployees";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { Button } from "@mui/joy";
import { deleteEmployee } from "@/app/action/deleteEmployee";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/hooks/useSnackBar";
import { useCheckBox } from "@/hooks/useCheckBox";
import { showError, showSuccess } from "@/utils/showSnackbar";

interface EmployeeTableWrapperProps {
  search_query?: string;
  branchId?: number;
  status?: EMPLOYEE_STATUS | null;
}

export function EmployeeTableWrapper({
  search_query,
  branchId,
  status,
}: EmployeeTableWrapperProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const { data, isError, isSuccess, isLoading } = useEmployees({
    search_query,
    branchId,
    status,
    page,
    limit,
  });

  const { checked, uncheckall} = useCheckBox<number>("allEmployeeTable");
  const { id } = useCurrentShop();
  const queryClient = useQueryClient();
  const { setMessage, show } = useSnackbar();

  const onPageChange = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const onDeleteEmployee = async () => {
    try {
      if (!id) return;
      uncheckall()
      await deleteEmployee(checked, id);
      showSuccess("Delete employee success");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch {
      showError("Delete employee failed");
    }
  };

  return (
    <>
      <section className="flex flex-col justify-center items-center">
        <div className="w-full -mt-3">
          <Button
            disabled={checked ? checked.length === 0 : true}
            variant="plain"
            onClick={() => {
              onDeleteEmployee();
            }}
          >
            <p className="underline font-medium">delete</p>
          </Button>
        </div>
        <div className=" mb-3 w-full border border-[#d4d4d4] rounded-sm max-h-[calc(100vh-400px)] overflow-x-auto overflow-y-auto shadow-sm">
          <EmployeesTable
            data={data}
            isLoading={isLoading}
            isSuccess={isSuccess}
          />
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

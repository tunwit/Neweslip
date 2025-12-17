import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { EmployeeWithShop } from "@/types/employee";
import BranchSelector from "@/widget/BranchSelector";
import { useCheckBox } from "@/hooks/useCheckBox";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
import { useEmployees } from "@/hooks/useEmployees";
import { getRandomPastelColor } from "@/utils/generatePastelColor";
import { createPayrollRecords } from "@/app/action/createPayrollRecord";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { Branch } from "@/types/branch";
import { useDebounce } from "use-debounce";
import { useUser } from "@clerk/nextjs";
import { Pagination } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedName } from "@/lib/getLocalizedName";

interface PayrollsAddEmployeeModal {
  periodId: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PayrollsAddEmployeeModal({
  periodId,
  open,
  setOpen,
}: PayrollsAddEmployeeModal) {
  const methods = useCheckBox<number>("payrollAddEmployeeTable");
  const queryClient = useQueryClient();
  const { checked, uncheckall } = methods;
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const [branchId, setBranchId] = useState<number>(-1);
  const { data, isLoading, isSuccess } = useEmployees({
    branchId: branchId,
    search_query: debounced,
    page: page,
  });
  const [selected, setSelected] = useState<EmployeeWithShop | null>(null);
  const { user } = useUser();
  const locale = useLocale();
  const te = useTranslations("employees");
  const tn = useTranslations("new_employees");
  const tc = useTranslations("common");
  const tnav = useTranslations("navigation");

  const onPageChange = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const handlerConfirm = async () => {
    if (!user?.id) return;
    try {
      await createPayrollRecords(checked, periodId, user?.id);
      queryClient.invalidateQueries({ queryKey: ["payrollRecord"] });
      queryClient.invalidateQueries({
        queryKey: ["payrollPeriod", periodId],
        exact: false,
      });

      showSuccess(tn("modal.create.success"));
      setOpen(false);
    } catch (err: any) {
      let msg = err.message;
      if (msg == "ER_DUP_ENTRY") msg = "You cannot add duplicate employee";
      showError(tn("modal.create.fail", { err: msg }));
    } finally {
      uncheckall();
    }
  };

  const avatarColors = useMemo(() => {
    return data?.data?.map(() => getRandomPastelColor()) || [];
  }, [data]);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        {/* <ModalOverflow> */}
        <ModalDialog sx={{ width: "50%" }}>
          <div className="flex flex-col justify-center w-full">
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-lg">
                {tnav("employees")}{" "}
                {tc("unit.people", {
                  count: data?.pagination.totalItems || 0,
                })}{" "}
              </p>
              <p>{tc("selected", { count: checked.length })}</p>
            </div>

            <div className="flex flex-row gap-2 my-2">
              <div className="w-[80%]">
                <p className="text-black text-xs mb-1">{te("search.label")}</p>
                <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
                  <Icon
                    className="text-[#424242]"
                    icon={"material-symbols:search-rounded"}
                  />
                  <input
                    type="text"
                    placeholder={te("search.placeholder")}
                    className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="w-[20%]">
                <p className="text-black text-xs mb-1">{te("fields.branch")}</p>
                <BranchSelector
                  branchId={branchId}
                  onChange={(b) => {
                    setBranchId(b);
                  }}
                  isEnableAll={true}
                />
              </div>
            </div>

            <div className="w-full overflow-auto h-[50vh]">
              <TableWithCheckBox
                editColumn={false}
                data={data?.data}
                isLoading={isLoading}
                isSuccess={isSuccess}
                checkboxMethods={methods}
                setSelectedItem={setSelected}
                setOpen={setOpen}
                columns={[
                  {
                    key: "name",
                    label: te("fields.name"),
                    width: "45%",
                    render: (row, i) => {
                      return (
                        <span className="flex flex-row items-center gap-2">
                          <div
                            className="w-9 aspect-square min-w-8 text-center rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: avatarColors[i] }}
                            onClick={() => setOpen(true)}
                          >
                            {row.firstName.charAt(0)}
                          </div>
                          <p>
                            {row.firstName} &nbsp;
                            {row.lastName}
                          </p>
                        </span>
                      );
                    },
                  },
                  {
                    key: "nickName",
                    label: te("fields.nickname"),
                    render: (row) => `${row.nickName}`,
                  },
                  {
                    key: "branch",
                    label: te("fields.branch"),
                    render: (row) => `${getLocalizedName(row.branch, locale)}`,
                  },
                ]}
              />
            </div>

            <div className="w-full flex justify-center mt-2">
              <Pagination
                count={data?.pagination.totalPages || 1}
                page={data?.pagination.page || page}
                onChange={onPageChange}
                shape="rounded"
                size="medium"
              />
            </div>

            <div className="flex flex-row gap-2 ml-auto mt-2">
              <Button
                size="sm"
                variant="outlined"
                onClick={() => setOpen(false)}
              >
                {te("actions.close")}
              </Button>
              <Button
                disabled={checked.length < 1}
                size="sm"
                onClick={() => handlerConfirm()}
              >
                {te("actions.create")}
              </Button>
            </div>
          </div>
        </ModalDialog>
      </Modal>
    </>
  );
}

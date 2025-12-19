"use client";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Add } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import PayrollsAddEmployeeModal from "@/app/components/Payrolls/new/AddModal/PayrollsAddEmployeeModal";
import { usePayrollRecords } from "@/hooks/payroll/record/usePayrollRecords";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCheckBox } from "@/hooks/useCheckBox";
import PayrollEditEmployeeModal from "@/app/components/Payrolls/new/EditModal/PayrollEditEmployeeModal";
import { PayrollRecord } from "@/types/payrollRecord";
import { deletePayrollRecords } from "@/app/action/payroll/record/deletePayrollRecord";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import { usePayrollPeriod } from "@/hooks/payroll/period/usePayrollPeriod";
import UsersIcon from "@/assets/icons/UsersIcon";
import PeriodEmployeeTable from "@/app/components/Payrolls/new/PeriodEmployeeTable";
import { useDebounce } from "use-debounce";
import { Modal, ModalDialog } from "@mui/joy";
import { PAY_PERIOD_STATUS_LABELS } from "@/types/enum/enumLabel";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { updatePayrollRecord } from "@/app/action/payroll/record/updatePayrollRecord";
import { updatePayrollPeriod } from "@/app/action/payroll/period/updatePayrollPeriod";
import { ClickAwayListener } from "@mui/material";
import { usePeriodFields } from "@/hooks/payroll/fields/usePeriodFields";
import AdvancedFilters from "@/widget/payroll/AdvancedFilters";
import { PayrollRecordSummary } from "@/types/payrollPeriodSummary";
import { useTranslations } from "next-intl";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";

export default function Home() {
  const methods = useCheckBox<number>("payrollRecordTable");
  const { checked } = methods;
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { name } = useCurrentShop();

  const [query, setQuery] = useState("");
  const [debouced] = useDebounce(query, 500);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(
    null,
  );
  const { user } = useUser();

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const periodId = useSearchParams().get("id");

  const {
    data: periodData,
    isLoading: loadingPeriod,
    error,
  } = usePayrollPeriod(Number(periodId));
  if (error || !periodId) {
    const basePath = pathname.replace(/\/edit$/, "");
    router.replace(basePath);
  }

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: periodData?.data?.start_period,
    to: periodData?.data?.end_period,
  });
  const [periodTitle, setPeriodTitle] = useState(periodData?.data?.name);
  const [titleDebounced] = useDebounce(periodTitle, 1000);
  const [debouncedDateRange] = useDebounce(dateRange, 500);
  const { data, isLoading: loadingRecord } = usePayrollRecords(
    Number(periodId),
  );

  const [baseRecords, setBaseRecords] = useState<PayrollRecord[]>([]);
  const [filterdRecord, setFilterdRecord] = useState<PayrollRecord[]>([]);
  const tPeriod = useTranslations("period");

  const deleteHandler = async () => {
    if (!user?.id) return;
    try {
      await deletePayrollRecords(checked, Number(periodId), user?.id);
      queryClient.invalidateQueries({ queryKey: ["payrollRecord"] });
      queryClient.invalidateQueries({
        queryKey: ["payrollPeriod", periodId],
        exact: false,
      });

      showSuccess(tPeriod("modal.delete.success"));
    } catch (err: any) {
      showError(tPeriod("modal.delete.fail", { err: err.message }));
    }
  };

  const summaryHandler = () => {
    const newPath = pathname.replace("/edit", "/summary");
    router.push(`${newPath}?id=${periodId}`);
  };

  const saveDataHandler = async () => {
    if (
      !titleDebounced ||
      !periodId ||
      !user?.id ||
      !periodData?.data ||
      !dateRange?.from ||
      !dateRange?.to
    )
      return;
    const result = {
      ...periodData?.data,
      name: titleDebounced,
      start_period: new Date(dateRange?.from),
      end_period: new Date(dateRange?.to),
    };

    try {
      await updatePayrollPeriod(Number(periodId), result, user?.id);
    } catch (err: any) {
      showError(tPeriod("modal.save.fail", { err: err.message }));
    } finally {
    }
  };

  useEffect(() => {
    if (!periodData?.data) return; //prevent firing too early
    if (!titleDebounced || !debouncedDateRange) return;

    saveDataHandler();
    queryClient.invalidateQueries({
      queryKey: ["payrollPeriod", periodId],
      exact: false,
    });
  }, [titleDebounced, debouncedDateRange]);

  useEffect(() => {
    if (!data?.data) return;
    setBaseRecords(data.data);
    setFilterdRecord(data.data);
  }, [data]);

  useEffect(() => {
    if (!periodData?.data) return;
    setPeriodTitle(periodData.data.name);
    setDateRange({
      from: periodData.data.start_period,
      to: periodData.data.end_period,
    });
    if (periodData?.data?.status !== PAY_PERIOD_STATUS.DRAFT) {
      const newPath = pathname.replace("/edit", "/view");
      router.push(`${newPath}?id=${periodId}`);
    }
  }, [periodData]);

  const onExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/payroll/periods/${periodId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll_summary_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      showError(tPeriod("modal.export.fail", { err: err.message }));
    } finally {
      setIsExporting(false);
    }
  };
  const isLoading = loadingPeriod || loadingRecord;

  let loadingMessage = "";
  if (loadingRecord) loadingMessage = tPeriod("load.loading_records");
  else if (loadingPeriod) loadingMessage = tPeriod("load.loading_payrolls");

  return (
    <main className="w-full bg-gray-100 font-medium ">
      <PayrollsAddEmployeeModal
        open={openAdd}
        setOpen={setOpenAdd}
        periodId={Number(periodId)}
      />
      {openEdit && (
        <PayrollEditEmployeeModal
          periodData={periodData?.data}
          selectedRecord={selectedRecord}
          open={openEdit}
          setOpen={setOpenEdit}
        />
      )}
      <Modal open={isLoading}>
        <ModalDialog>
          <div className="flex flex-col items-center justify-center">
            <Icon
              icon={"mynaui:spinner"}
              className="animate-spin"
              fontSize={50}
            />

            <p> {loadingMessage}</p>
          </div>
        </ModalDialog>
      </Modal>
      <title>{periodData?.data?.name}</title>

      <div className="flex flex-col h-full">
        <section className="px-10 pb-5 bg-white w-full border-b border-gray-200 sticky top-0">
          <div className="flex flex-row text-[#424242] text-xs mt-10">
            <p>
              {" "}
              {name} {">"} Dashboard {">"} Payrolls {">"}&nbsp;
            </p>
            <p className="text-blue-800">Edit Payrolls</p>
          </div>
          <div className="mt-3 flex flex-row justify-between">
            <input
              defaultValue={periodTitle}
              onChange={(e) => setPeriodTitle(e.target.value)}
              className="text-black rounded-md text-3xl font-bold p-2"
            ></input>

            <div className="flex gap-3 z-10 h-5">
              <Button
                loading={isExporting}
                disabled={isExporting}
                startDecorator={
                  <Icon icon="qlementine-icons:export-16" fontSize={20} />
                }
                color="neutral"
                variant="outlined"
                onClick={onExport}
              >
                {tPeriod("actions.export")}
              </Button>
              <Button
                startDecorator={
                  <Icon icon="fluent:list-bar-24-regular" fontSize={20} />
                }
                color="neutral"
                variant="outlined"
                onClick={summaryHandler}
              >
                {tPeriod("actions.summary")}
              </Button>
            </div>
          </div>

          <section className="grid grid-cols-4 gap-4 mt-5">
            <div className="bg-blue-50 from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    {tPeriod("fields.status")}
                  </p>
                  <p className="text-xl font-bold text-blue-900 mt-1">
                    {tPeriod(
                      `status.${PAY_PERIOD_STATUS_LABELS[periodData?.data?.status ?? "DRAFT"].toLowerCase()}`,
                    )}
                  </p>
                </div>
                <div className="bg-blue-200 p-2 rounded-lg">
                  <Icon
                    icon={"mdi:clock-outline"}
                    className="text-blue-700"
                    fontSize={20}
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">
                    {tPeriod("fields.employees")}
                  </p>
                  <p className="text-xl font-bold text-purple-900 mt-1">
                    {periodData?.data?.employeeCount}
                  </p>
                </div>
                <div className="bg-purple-200 p-2 rounded-lg">
                  <UsersIcon className="text-purple-700 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    {tPeriod("fields.total_amount")}
                  </p>
                  <p className="text-xl font-bold text-green-900 mt-1">
                    {moneyFormat(periodData?.data?.totalNet || 0)}
                  </p>
                </div>
                <div className="bg-green-200 p-2 rounded-lg">
                  <Icon
                    icon="tabler:currency-baht"
                    className="text-green-700 text-xl"
                    fontSize={20}
                  />
                </div>
              </div>
            </div>

            <div
              className="relative bg-orange-50 from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 cursor-pointer"
              onClick={() => setOpenCalendar(true)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">
                    {tPeriod("fields.period")}
                  </p>
                  <p className="text-xl font-bold text-orange-900 mt-1">
                    {dateFormat(new Date(periodData?.data?.start_period || 0))}{" "}
                    {" - "}
                    {dateFormat(new Date(periodData?.data?.end_period || 0))}
                  </p>
                </div>
                <div className="bg-orange-200 p-2 rounded-lg">
                  <Icon
                    icon="solar:calendar-outline"
                    className="text-orange-700 text-xl"
                    fontSize={20}
                  />
                </div>
              </div>
              {openCalendar && (
                <ClickAwayListener onClickAway={() => setOpenCalendar(false)}>
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range);
                      }}
                      numberOfMonths={2}
                      className="rounded-lg border shadow-md bg-white"
                    />
                  </div>
                </ClickAwayListener>
              )}
            </div>
          </section>
        </section>

        <section className="px-10 overflow-y-auto flex-1">
          <div className="mt-8 flex flex-col justify-between p-4 bg-white  rounded-md shadow">
            <div className="flex flex-row justify-between ">
              <div className="flex flex-row gap-3">
                <div className="w-96 ">
                  <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] h-full px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
                    <Icon
                      className="text-[#424242]"
                      icon={"material-symbols:search-rounded"}
                    />
                    <input
                      type="text"
                      placeholder={tPeriod("search.placeholder")}
                      className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="text-gray-700 border border-gray-300 rounded-md px-4 hover:bg-gray-50"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <span className="flex items-center gap-1">
                    <Icon icon={"mdi:filter-outline"} fontSize={18} />{" "}
                    <p className="font-light text-sm">
                      {tPeriod("filters.label")}
                    </p>
                  </span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setOpenAdd(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white p-2 rounded-md"
                >
                  <Add sx={{ fontSize: "20px" }} />{" "}
                  <p>{tPeriod("actions.add_employee")}</p>
                </button>
              </div>
            </div>
            <AdvancedFilters
              periodId={periodData?.data?.id || -1}
              show={showFilter}
              setShow={setShowFilter}
              originalData={data?.data || []}
              setData={setFilterdRecord}
            />
          </div>

          <div className="flex flex-col justify-center pb-10">
            <div className="flex flex-row-reverse">
              <button
                disabled={checked ? checked.length === 0 : true}
                onClick={deleteHandler}
                className="flex items-center gap-2 text-blue-600 disabled:text-gray-300 p-2 rounded-md"
              >
                <p className="underline font-medium">
                  {tPeriod("actions.delete")}
                </p>
              </button>
            </div>

            <PeriodEmployeeTable
              searchQuery={debouced}
              checkBoxMethod={methods}
              periodData={periodData?.data}
              records={(filterdRecord as PayrollRecord[]) || []}
              setSelected={setSelectedRecord}
              setOpenEdit={setOpenEdit}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Add } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import PayrollsAddEmployeeModal from "@/app/components/Payrolls/new/AddModal/PayrollsAddEmployeeModal";
import { usePayrollRecords } from "@/hooks/usePayrollRecords";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCheckBox } from "@/hooks/useCheckBox";
import { getRandomPastelColor } from "@/utils/generatePastelColor";
import BranchSelector from "@/widget/BranchSelector";
import PayrollEditEmployeeModal from "@/app/components/Payrolls/new/EditModal/PayrollEditEmployeeModal";
import { Employee } from "@/types/employee";
import { PayrollRecord } from "@/types/payrollRecord";
import { deletePayrollRecords } from "@/app/action/deletePayrollRecord";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { useRecordDetails } from "@/hooks/useRecordDetails";
import { useUser } from "@clerk/nextjs";
import { dateFormat, dateTimeFormat, moneyFormat } from "@/utils/formmatter";
import { usePayrollPeriod } from "@/hooks/usePayrollPeriod";
import UsersIcon from "@/assets/icons/UsersIcon";
import PeriodEmployeeTable from "@/app/components/Payrolls/new/PeriodEmployeeTable";
import { useDebounce } from "use-debounce";
import { Modal, ModalDialog } from "@mui/joy";
import { PAY_PERIOD_STATUS_LABELS } from "@/types/enum/enumLabel";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { usePayrollPeriodSummary } from "@/hooks/usePayrollPeriodSummary";
import SummaryCard from "@/app/components/Payrolls/summary/SummaryCard";
import PaySlipGenerateModal from "@/app/components/Payrolls/view/PaySlipGenerateModal";
import SendEmailsModal from "@/app/components/Payrolls/view/SendEmailsModal";
import AdvancedFilters from "@/widget/payroll/AdvancedFilters";
import { PayrollRecordSummary } from "@/types/payrollPeriodSummary";
import { motion, AnimatePresence } from "framer-motion";
import UnlockModal from "@/app/components/Payrolls/view/UnlockModal";
import SummarySection from "@/app/components/Payrolls/SummarySection";
import { useTranslations } from "next-intl";

export default function Home() {
  const methods = useCheckBox<number>("payrollRecordTable");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPayslipGenerate, setOpenPayslipGenerate] = useState(false);
  const [openSendEmails, setOpenSendEmails] = useState(false);
  const [openUnlock, setOpenUnlock] = useState(false);

  const [hideHeader, setHideHeader] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(
    null,
  );
  const [showFilter, setShowFilter] = useState(false);
  const [filtered, setFiltered] = useState<PayrollRecordSummary[]>([]);
  const [query, setQuery] = useState("");
  const [debouced] = useDebounce(query, 500);
  const periodId = useSearchParams().get("id");
  const tPeriod = useTranslations("period");
  const tv = useTranslations("view_payroll");
  const tc = useTranslations("common");
  const tBreadcrumb = useTranslations("breadcrumb");

  const { data: summaryData, isLoading: loadingSummary } =
    usePayrollPeriodSummary(Number(periodId));

  const { data: periodData, isLoading: loadingPeriod } = usePayrollPeriod(
    Number(periodId),
  );

  const onExportAsExcel = async () => {
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
  };

  const router = useRouter();
  const pathname = usePathname();

  const onPayment = () => {
    const newPath = pathname.replace("/view", "/payment");
    router.push(`${newPath}?id=${periodId}`);
  };

  useEffect(() => {
    if (periodData?.data?.status === PAY_PERIOD_STATUS.DRAFT) {
      const newPath = pathname.replace("/view", "/edit");
      router.push(`${newPath}?id=${periodId}`);
    }
  }, [periodData]);

  useEffect(() => {
    if (!summaryData?.data?.records) return;
    const q = debouced.toLowerCase();

    setFiltered(
      summaryData?.data?.records.filter((r) => {
        return (
          r.employee.firstName.toLowerCase().includes(q) ||
          r.employee.lastName.toLowerCase().includes(q) ||
          (r.employee.firstName + r.employee.lastName)
            .toLowerCase()
            .includes(q) ||
          r.employee.nickName.toLowerCase().includes(q) ||
          r.employee.branch.toLowerCase().includes(q)
        );
      }),
    );
  }, [summaryData?.data?.records, debouced]);

  const filteredTotalNet = useMemo(() => {
    return filtered.reduce((sum, r) => sum + (r.totals.net || 0), 0);
  }, [filtered]);

  const filteredTotalEarning = useMemo(() => {
    return filtered.reduce((sum, r) => sum + (r.totals.totalEarning || 0), 0);
  }, [filtered]);
  const filteredTotalDeduction = useMemo(() => {
    return filtered.reduce((sum, r) => sum + (r.totals.totalDeduction || 0), 0);
  }, [filtered]);

  const filteredTotalSalary = useMemo(() => {
    return filtered.reduce((sum, r) => {
      return sum + ("baseSalary" in r ? r.baseSalary || 0 : 0);
    }, 0);
  }, [filtered]);

  const isLoading = loadingPeriod || !summaryData;

  let loadingMessage = tc("load.preparing");
  if (loadingPeriod) loadingMessage = tPeriod("load.loading_payrolls");

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
      {openPayslipGenerate && summaryData?.data && (
        <PaySlipGenerateModal
          summaryData={summaryData.data}
          open={openPayslipGenerate}
          setOpen={setOpenPayslipGenerate}
        />
      )}

      {openSendEmails && summaryData?.data && (
        <SendEmailsModal
          summaryData={summaryData.data}
          open={openSendEmails}
          setOpen={setOpenSendEmails}
        />
      )}
      <UnlockModal
        periodId={Number(periodId) || -1}
        open={openUnlock}
        setOpen={setOpenUnlock}
      />

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

      <div className="flex flex-col h-full bg-white">
        <AnimatePresence initial={false}>
          {!hideHeader && (
            <motion.div
              key="header"
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden relative"
            >
              <section className="px-10 pb-5 bg-white w-full border-b border-gray-200 sticky top-0">
                <div className="flex flex-row text-[#424242] text-xs mt-10">
                  <p>
                    {" "}
                    Haris {">"} {tBreadcrumb("dashboard")} {">"}{" "}
                    {tBreadcrumb("payrolls")} {">"}&nbsp;
                  </p>
                  <p className="text-blue-800">{tBreadcrumb("view_payroll")}</p>
                </div>
                <div className="mt-5 flex flex-row justify-between items-center   ">
                  <div>
                    <span className="flex flex-row gap-3  items-center  text-black text-4xl font-bold">
                      <p>{periodData?.data?.name}</p>
                      <p className="text-lg opacity-50 font-light">
                        ({tv("info.read_only")})
                      </p>
                    </span>
                    <p className="opacity-50 mt-2">{tv("label")}</p>
                  </div>

                  <div className="flex gap-3 h-fit">
                    <div className="flex items-center gap-2 px-4 rounded-md bg-green-50 text-green-800 border-green-200 border">
                      <Icon
                        icon="icon-park-outline:check-one"
                        className="text-green-600"
                        fontSize={20}
                      />
                      <p className="font-medium">
                        {tPeriod("status.finalized")}
                      </p>
                    </div>
                    <Button
                      startDecorator={<Icon icon="uil:unlock" fontSize={20} />}
                      color="warning"
                      variant="outlined"
                      onClick={() => {
                        setOpenUnlock(true);
                      }}
                    >
                      {tPeriod("actions.unlock")}
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
                            `status.${PAY_PERIOD_STATUS_LABELS[periodData?.data?.status!]?.toLowerCase()}`,
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
                          {tPeriod("fields.grand_total")}
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

                  <div className="bg-orange-50 from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-700 font-medium">
                          {tPeriod("fields.period")}
                        </p>
                        <p className="text-xl font-bold text-orange-900 mt-1">
                          {dateFormat(
                            new Date(periodData?.data?.start_period || 0),
                          )}{" "}
                          {" - "}
                          {dateFormat(
                            new Date(periodData?.data?.end_period || 0),
                          )}
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
                  </div>
                </section>
                <button
                  className="flex w-full items-center justify-center mt-4"
                  onClick={() => setHideHeader(!hideHeader)}
                >
                  <Icon icon="icon-park-outline:up" fontSize={20} />
                </button>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="px-10 overflow-y-auto flex-1  space-y-3 ">
          <div hidden={!hideHeader} className={`bg-white py-3 sticky top-0`}>
            <button
              className={`flex w-full items-center justify-center rotate-180  transition-all `}
              onClick={() => setHideHeader(!hideHeader)}
            >
              <Icon icon="icon-park-outline:up" fontSize={20} />
            </button>
          </div>
          <div
            className={`bg-green-50 p-4 border border-green-200 rounded-md my-5`}
          >
            <div className="flex flex-row gap-3">
              <Icon
                icon="icon-park-outline:check-one"
                className={`text-green-600 mt-1`}
                fontSize={20}
              />
              <div>
                <p className="text-green-900">{tv("section.label")}</p>
                <p className="font-light text-xs text-green-700 ">
                  {tv("section.description", {
                    name:
                      summaryData?.data?.finalizedByUser?.fullName || "unknown",
                    date: dateTimeFormat(
                      new Date(summaryData?.data?.finalized_at || 0),
                    ),
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Icon
                  icon="mage:file-3"
                  className="text-blue-600"
                  fontSize={24}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tv("actions.generate.label")}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {tv("actions.generate.description")}
                </p>
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  onClick={() => setOpenPayslipGenerate(true)}
                >
                  {tv("actions.generate.btn")}
                  <Icon
                    icon="lsicon:right-outline"
                    className="text-blue-600"
                    fontSize={24}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Icon
                  icon="mynaui:send"
                  className="text-purple-600"
                  fontSize={24}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tv("actions.send_mail.label")}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {tv("actions.send_mail.description")}
                </p>
                <button
                  onClick={() => setOpenSendEmails(true)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  {tv("actions.send_mail.btn")}
                  <Icon
                    icon="lsicon:right-outline"
                    className="text-purple-600"
                    fontSize={24}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Icon
                  icon="qlementine-icons:export-16"
                  className="text-orange-600"
                  fontSize={24}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tv("actions.export.label")}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {tv("actions.export.description")}
                </p>
                <span className="flex flex-row gap-2">
                  <button
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                    onClick={onExportAsExcel}
                  >
                    {tv("actions.export.btn")}
                    <Icon
                      icon="lsicon:right-outline"
                      className="text-orange-600"
                      fontSize={24}
                    />
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Icon
                  icon="famicons:card-outline"
                  className="text-indigo-600"
                  fontSize={24}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tv("actions.payment.label")}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {tv("actions.payment.description")}
                </p>
                <button
                  onClick={onPayment}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  {tv("actions.payment.btn")}
                  <Icon
                    icon="lsicon:right-outline"
                    className="text-indigo-600"
                    fontSize={24}
                  />
                </button>
              </div>
            </div>
          </div>
          <section className="flex-1">
            <div className="mt-3 flex flex-col justify-between p-4  bg-white border border-gray-200  rounded-md">
              <div className="flex flex-row justify-between h-10">
                <div className="flex flex-row gap-3 h-full">
                  <div className="w-96 ">
                    <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] h-full px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
                      <Icon
                        className="text-[#424242]"
                        icon={"material-symbols:search-rounded"}
                      />
                      <input
                        type="text"
                        placeholder={tPeriod("search.placeholder")}
                        className="text-[#424242] font-light text-sm  w-full h-full  focus:outline-none "
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
              </div>
              <AdvancedFilters
                periodId={periodData?.data?.id || -1}
                show={showFilter}
                setShow={setShowFilter}
                originalData={summaryData?.data?.records || []}
                setData={setFiltered}
              />
            </div>
          </section>
          <div className="space-y-3 mb-5">
            {filtered.map((record) => {
              return (
                <SummaryCard
                  key={record.id}
                  record={record as PayrollRecordSummary}
                />
              );
            })}
            <SummarySection
              totalSalary={filteredTotalSalary}
              totalDeduction={filteredTotalDeduction}
              totalEarning={filteredTotalEarning}
              totalNet={filteredTotalNet}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

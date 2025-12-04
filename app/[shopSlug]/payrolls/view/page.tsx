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
import { moneyFormat } from "@/utils/formmatter";
import { usePayrollPeriod } from "@/hooks/usePayrollPeriod";
import UsersIcon from "@/assets/icons/UsersIcon";
import PeriodEmployeeTable from "@/app/components/Payrolls/new/PeriodEmployeeTable";
import { useDebounce } from "use-debounce";
import { Modal, ModalDialog } from "@mui/joy";
import { PAY_PERIOD_STATUS_LABELS } from "@/types/enum/enumLabel";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { usePayrollPeriodSummary } from "@/hooks/usePayrollPeriodSummary";
import SummaryCard from "@/app/components/Payrolls/summary/SummaryCard";

export default function Home() {
  const methods = useCheckBox<number>("payrollRecordTable");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(
    null,
  );
  const periodId = useSearchParams().get("id");

  const { data: summaryData, isLoading: loadingSummary } =
    usePayrollPeriodSummary(Number(periodId));

  const { data: periodData, isLoading: loadingPeriod } = usePayrollPeriod(
    Number(periodId),
  );


  const router = useRouter();
  const pathname = usePathname();

  const summaryHandler = () => {
    const newPath = pathname.replace("/edit", "/summary");
    router.push(`${newPath}?id=${periodId}`);
  };

  useEffect(() => {
    if (periodData?.data?.status === PAY_PERIOD_STATUS.DRAFT) {
      const newPath = pathname.replace("/view", "/edit");
      router.push(`${newPath}?id=${periodId}`);
    }
  }, [periodData]);

  const isLoading = loadingPeriod;

  let loadingMessage = "";
  if (loadingPeriod) loadingMessage = "Loading Period...";

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
              Haris {">"} Dashboard {">"} Payrolls {">"}&nbsp;
            </p>
            <p className="text-blue-800">View Payroll</p>
          </div>
          <div className="mt-5 flex flex-row justify-between items-center   ">
            <div>
              <span className="flex flex-row  items-center  text-black text-4xl font-bold">
                {periodData?.data?.name}{" "}
                <p className="text-lg opacity-50">(read only)</p>
              </span>
              <p className="opacity-50 mt-2">
                You cannot edit finalized payroll
              </p>
            </div>

            <div className="flex gap-3 h-fit">
              <div className="flex items-center gap-2 px-4 rounded-md bg-green-50 text-green-800 border-green-200 border">
                <Icon
                  icon="icon-park-outline:check-one"
                  className="text-green-600"
                  fontSize={20}
                />
                <p className="font-medium">FINALIZED</p>
              </div>
              <Button
                startDecorator={<Icon icon="uil:unlock" fontSize={20} />}
                color="warning"
                variant="outlined"
                onClick={summaryHandler}
              >
                Unlock
              </Button>
            </div>
          </div>

          <section className="grid grid-cols-4 gap-4 mt-5">
            <div className="bg-blue-50 from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Status</p>
                  <p className="text-xl font-bold text-blue-900 mt-1">
                    {PAY_PERIOD_STATUS_LABELS[periodData?.data?.status!]}
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
                    Employee
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
                    Total Amount
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
                  <p className="text-sm text-orange-700 font-medium">Period</p>
                  <p className="text-xl font-bold text-orange-900 mt-1">
                    {new Date(periodData?.data?.start_period!).toDateString()} -{" "}
                    {new Date(periodData?.data?.end_period!).toDateString()}
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
        </section>

        <section className="px-10 overflow-y-auto flex-1 my-5 space-y-3 ">
          <div className={`bg-green-50 p-4 border border-green-200 rounded-md`}>
            <div className="flex flex-row gap-3">
              <Icon
                icon="icon-park-outline:check-one"
                className={`text-green-600 mt-1`}
                fontSize={20}
              />
              <div>
                <p className="text-green-900">Payroll Successfully Finalized</p>
                <p className="font-light text-xs text-green-700 ">
                  Finalized by Admin User on 2025-12-02 14:30
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
                  Regenerate Pay Slips
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Create PDF slips for all employees
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  Generate{" "}
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
                  Send Emails
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Email slips to employees
                </p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  Send Emails{" "}
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
                  Export Report
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Excel or PDF format
                </p>
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                  Excel | PDF
                </button>
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
                <h3 className="font-semibold text-gray-900 mb-1">Payment</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Generate bank transfer file
                </p>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                  To payment
                  <Icon
                    icon="lsicon:right-outline"
                    className="text-indigo-600"
                    fontSize={24}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-3 ">
            {summaryData?.data?.records.map((record) => {
              return <SummaryCard key={record.id} record={record} />;
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

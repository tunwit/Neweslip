"use client";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Add } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import PayrollsAddEmployeeModal from "@/app/components/Payrolls/new/AddModal/PayrollsAddEmployeeModal";
import { useSelectedEmployees } from "@/app/components/Payrolls/new/hooks/useSelectedEmployee";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
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
import { usePayrollPeriodSummary } from "@/hooks/usePayrollPeriodSummary";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import SummaryCard from "@/app/components/Payrolls/summary/SummaryCard";
import { usePayrollPeriodVerify } from "@/hooks/usePayrollPeriodVerify";
import ProblemCard from "@/app/components/Payrolls/summary/problemCard";

export default function Home() {
  const methods = useCheckBox<number>("payrollRecordTable");
  const { checked } = methods;

  const [query, setQuery] = useState("");
  const periodId = useSearchParams().get("id");
  const { data: periodData } = usePayrollPeriod(Number(periodId));
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { data: summaryData } = usePayrollPeriodSummary(Number(periodId));
  const pathname = usePathname();
  const router = useRouter();
  const { data: verify } = usePayrollPeriodVerify(Number(periodId));
  console.log(verify?.data);

  const backToEditHandler = () => {
    const newPath = pathname.replace("/summary", "/edit");
    router.push(`${newPath}?id=${periodId}`);
  };

  return (
    <main className="w-full bg-gray-100 font-medium ">
      <title>{periodData?.data?.name}</title>
      <div className="flex flex-col h-full overflow-y-auto flex-1">
        <section className="px-10 pb-5 bg-white w-full border-b border-gray-200 sticky top-0">
          <div className=" flex flex-row text-[#424242] text-xs mt-10">
            <p>
              {" "}
              Haris {">"} Dashboard {">"} Payrolls {">"}&nbsp;
            </p>
            <p className="text-blue-800">Summary Review</p>
          </div>
          <div className="mt-5 flex flex-row justify-between">
            <span>
              <p className="text-black text-4xl font-bold">
                Review Payroll Summary
              </p>
              <p className=" text-gray-700 mt-2">{periodData?.data?.name}</p>
            </span>

            <div className="flex gap-3">
              <Button
                sx={{ height: 40 }}
                startDecorator={
                  <Icon icon="lets-icons:back-light" fontSize={20} />
                }
                color="neutral"
                variant="outlined"
                onClick={backToEditHandler}
              >
                Back to edit
              </Button>
              <Button
                sx={{ height: 40 }}
                startDecorator={<Icon icon="gg:check-o" fontSize={20} />}
              >
                Finalize
              </Button>
            </div>
          </div>
        </section>

        <section className="px-10 mt-8">
          <div
            hidden={verify?.data?.length !== 0}
            className={`bg-green-50 p-4 border border-green-200 rounded-md`}
          >
            <div className="flex flex-row items-center gap-3">
              <Icon
                icon="lets-icons:check-fill"
                className={`text-green-500`}
                fontSize={20}
              />
              <div>
                <p>This payroll has been reviewed for potential issues.</p>
                <p className="font-light text-xs">
                  No issues were detected, but please verify all details before
                  finalizing.
                </p>
              </div>
            </div>
          </div>

          <div
            hidden={verify?.data?.length === 0}
            className="bg-white p-4 rounded-md shadow"
          >
            <span className="flex flex-row items-center gap-3">
              <Icon
                icon="ep:warning"
                className="text-orange-700"
                fontSize={20}
              />
              <h1 className="font-semibold text-md">
                Issues Requiring Attention ({verify?.data?.length})
              </h1>
            </span>

            <div className="flex flex-col gap-2 mt-3">
              {verify?.data?.map((v, _) => {
                return (
                  <ProblemCard
                    key={_}
                    type={v.type}
                    employeeName={
                      v.employee.firstName + " " + v.employee.lastName
                    }
                    message={v.message}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex flex-col px-10  mt-5 gap-4">
          {summaryData?.data?.records.map((record) => {
            return <SummaryCard key={record.id} record={record} />;
          })}
        </section>
        <section className="px-10 mb-5">
          <div className="bg-white rounded-lg border border-gray-200 mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payroll Summary
            </h2>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Total Base Salary</p>
                <p className="text-xl font-bold text-gray-900">
                  ฿ {moneyFormat(summaryData?.data?.totalBaseSalary || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 mb-2">Total Earnings</p>
                <p className="text-xl font-bold text-green-900">
                  ฿ {moneyFormat(summaryData?.data?.totalEarning || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 mb-2">Total Deductions</p>
                <p className="text-xl font-bold text-red-900">
                  ฿ {moneyFormat(summaryData?.data?.totalDeduction || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <p className="text-sm text-blue-700 mb-2 uppercase font-semibold">
                  Grand Total
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  ฿ {moneyFormat(summaryData?.data?.totalNet || 0)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

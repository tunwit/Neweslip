"use client";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { moneyFormat } from "@/utils/formmatter";
import { usePayrollPeriod } from "@/hooks/usePayrollPeriod";
import UsersIcon from "@/assets/icons/UsersIcon";
import PeriodEmployeeTable from "@/app/components/Payrolls/new/PeriodEmployeeTable";
import { useDebounce } from "use-debounce";
import { usePayrollPeriodSummary } from "@/hooks/usePayrollPeriodSummary";
import {
  PAY_PERIOD_STATUS,
  SALARY_FIELD_DEFINATION_TYPE,
} from "@/types/enum/enum";
import SummaryCard from "@/app/components/Payrolls/summary/SummaryCard";
import { usePayrollPeriodVerify } from "@/hooks/usePayrollPeriodVerify";
import ProblemCard from "@/app/components/Payrolls/summary/problemCard";
import { Modal, ModalDialog } from "@mui/joy";
import { useEffect, useMemo, useState, useTransition } from "react";
import FinalizeModal from "@/app/components/Payrolls/summary/FinalizeModal";
import { PayrollRecord } from "@/types/payrollRecord";
import {
  PayrollPeriodSummary,
  PayrollRecordSummary,
} from "@/types/payrollPeriodSummary";
import AdvancedFilters from "@/widget/payroll/AdvancedFilters";
import { useTranslations } from "next-intl";
import SummarySection from "@/app/components/Payrolls/SummarySection";
import { useCurrentShop } from "@/hooks/useCurrentShop";

export default function Home() {
  const periodId = useSearchParams().get("id");
  const [openFinalizeModal, setOpenFinalizeModal] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [query, setQuery] = useState("");
  const [debouced] = useDebounce(query, 500);
  const [filtered, setFiltered] = useState<PayrollRecordSummary[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const { name } = useCurrentShop();

  const {
    data: periodData,
    isLoading: loadingPeriod,
    error,
  } = usePayrollPeriod(Number(periodId));
  const tBreadcrumb = useTranslations("breadcrumb");
  const t = useTranslations("summary_period");
  const tPeriod = useTranslations("period");

  const { data: summaryData, isLoading: loadingSummary } =
    usePayrollPeriodSummary(Number(periodId));
  const pathname = usePathname();
  const router = useRouter();
  const { data: verify, isLoading: loadingVerify } = usePayrollPeriodVerify(
    Number(periodId),
  );

  if (error || !periodId) {
    const basePath = pathname.replace(/\/summary$/, "");
    router.replace(basePath);
  }
  useEffect(() => {
    if (!summaryData?.data) return;
    if (summaryData?.data?.status !== PAY_PERIOD_STATUS.DRAFT) {
      const newPath = pathname.replace("/summary", "/view");
      router.push(`${newPath}?id=${periodId}`);
    }
  }, [summaryData]);

  const backToEditHandler = () => {
    const newPath = pathname.replace("/summary", "/edit");
    router.push(`${newPath}?id=${periodId}`);
  };

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

  const isLoading =
    loadingPeriod || loadingSummary || loadingVerify || finalizing;

  let loadingMessage = "";
  if (finalizing)
    loadingMessage = "Finalizing payroll this might take a while...";
  if (loadingPeriod) loadingMessage = "Loading Period...";
  if (loadingSummary) loadingMessage = "Calculating Payroll...";
  if (loadingVerify) loadingMessage = "Verifying Payroll...";

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

  return (
    <main className="w-full bg-gray-100 font-medium ">
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
      <FinalizeModal
        open={openFinalizeModal}
        setOpen={setOpenFinalizeModal}
        setFinalizing={setFinalizing}
        periodSummary={summaryData?.data}
        problems={verify?.data || []}
      />
      <title>{periodData?.data?.name}</title>
      <div className="flex flex-col h-full overflow-y-auto flex-1">
        <section className="px-10 pb-5 bg-white w-full border-b border-gray-200 sticky top-0">
          <div className=" flex flex-row text-[#424242] text-xs mt-10">
            <p>
              {" "}
              {name} {">"} {tBreadcrumb("dashboard")} {">"}{" "}
              {tBreadcrumb("payrolls")} {">"}&nbsp;
            </p>
            <p className="text-blue-800">{tBreadcrumb("summary_payroll")}</p>
          </div>
          <div className="mt-5 flex flex-row justify-between">
            <span>
              <p className="text-black text-4xl font-bold">{t("label")}</p>
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
                {t("actions.back_to_edit")}
              </Button>
              <Button
                sx={{ height: 40 }}
                startDecorator={<Icon icon="gg:check-o" fontSize={20} />}
                onClick={() => setOpenFinalizeModal(true)}
              >
                {tPeriod("actions.finalize")}
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
                className={`text-green-600`}
                fontSize={20}
              />
              <div>
                <p className="text-green-900">{t("no_issue.label")}</p>
                <p className="font-light text-xs text-green-700">
                  {t("no_issue.label")}
                  {t("no_issue.description")}
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
                {t("issues.label", { count: verify?.data?.length || 0 })}
              </h1>
            </span>

            <div className="flex flex-col gap-2 mt-3">
              {verify?.data?.map((v, _) => {
                return <ProblemCard key={_} issue={v} />;
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="mt-8 mx-10 flex flex-col justify-between p-4   bg-white  rounded-md shadow">
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

        <section className="flex flex-col px-10  mt-5 gap-4">
          {filtered.map((record) => {
            return (
              <SummaryCard
                key={record.id}
                record={record as PayrollRecordSummary}
              />
            );
          })}
        </section>
        <section className="px-10 mb-5">
          <div className="bg-white rounded-lg border border-gray-200 mt-6 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("info.summary")}
            </h2>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {tPeriod("fields.total_base_salary")}
                </p>
                <p className="text-xl font-bold text-gray-900">
                  ฿ {moneyFormat(filteredTotalSalary || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 mb-2">
                  {tPeriod("fields.total_earning")}
                </p>
                <p className="text-xl font-bold text-green-900">
                  ฿ {moneyFormat(filteredTotalEarning || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 mb-2">
                  {tPeriod("fields.total_deduction")}
                </p>
                <p className="text-xl font-bold text-red-900">
                  ฿ {moneyFormat(filteredTotalDeduction || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                <p className="text-sm text-blue-700 mb-2 uppercase font-semibold">
                  {tPeriod("fields.grand_total")}
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  ฿ {moneyFormat(filteredTotalNet || 0)}
                </p>
              </div>
            </div>
          </div>
          <SummarySection
            totalSalary={filteredTotalSalary}
            totalDeduction={filteredTotalDeduction}
            totalEarning={filteredTotalEarning}
            totalNet={filteredTotalNet}
          />
        </section>
      </div>
    </main>
  );
}

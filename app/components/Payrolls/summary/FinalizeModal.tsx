"use client";
import { finalizePayroll } from "@/app/action/finalizePayroll";
import UsersIcon from "@/assets/icons/UsersIcon";
import { PAYROLL_PROBLEM } from "@/types/enum/enum";
import { PayrollPeriodSummary } from "@/types/payrollPeriodSummary";
import { PayrollProblem } from "@/types/payrollProblem";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import { showError } from "@/utils/showSnackbar";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useState } from "react";

interface FinalizeModalPros {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setFinalizing: Dispatch<SetStateAction<boolean>>;
  periodSummary?: PayrollPeriodSummary;
  problems: PayrollProblem[];
}
export default function FinalizeModal({
  open,
  setOpen,
  setFinalizing,
  periodSummary,
  problems,
}: FinalizeModalPros) {
  const { user } = useUser();
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const isCriticalPresence =
    problems.filter((p) => p.type === PAYROLL_PROBLEM.CRITICAL).length > 0;

  const finalizeHandler = async () => {
    if (!periodSummary || isCriticalPresence || !user) return;
    setFinalizing(true);
    try {
      await finalizePayroll(periodSummary.id, user.id);
      const newPath = pathname.replace("/summary", "/view");
      router.push(`${newPath}?id=${periodSummary.id}`);
      queryClient.invalidateQueries({
        queryKey: ["payrollRecord", periodSummary.id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["payrollPeriod", periodSummary.id],
        exact: false,
      });
      setOpen(false);
    } catch (err) {
      showError(`Cannot finalize payroll ${err}`);
    } finally {
      setFinalizing(false);
    }
  };
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ padding: 0, width: "50%" }}>
        <ModalClose />
        <section className="bg-blue-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 ">
              <Icon
                icon="simple-line-icons:check"
                fontSize={24}
                className="text-white"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Finalize Payroll
              </h2>
              <p className="text-sm text-gray-600">Review before finalizing</p>
            </div>
          </div>
        </section>
        <section className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Payroll Information
            </h3>
            <div className="bg-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon icon="solar:calendar-outline" fontSize={18} />
                  <span className="text-sm">Period</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {dateFormat(new Date(periodSummary?.start_period || 0))}{" "}
                  {" - "}
                  {dateFormat(new Date(periodSummary?.end_period || 0))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Icon icon="mynaui:users" fontSize={18} />
                  <span className="text-sm">Total Employees</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {periodSummary?.employeeCount} people
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Financial Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600">Base Salary</span>
                <span className="font-medium text-gray-900">
                  ฿ {moneyFormat(periodSummary?.totalBaseSalary || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-700">+ Total Earnings</span>
                <span className="font-medium text-green-700">
                  ฿ {moneyFormat(periodSummary?.totalEarning || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-red-700">- Total Deductions</span>
                <span className="font-medium text-red-700">
                  ฿ {moneyFormat(periodSummary?.totalDeduction || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="tabler:currency-baht"
                    className="text-blue-700"
                    fontSize={20}
                  />
                  <span className="font-semibold text-blue-900">Net Total</span>
                </div>
                <span className="text-2xl font-bold text-blue-900">
                  ฿ {moneyFormat(periodSummary?.totalNet || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div
              hidden={problems.length !== 0}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <Icon
                  icon="lets-icons:check-fill"
                  className={`text-green-500`}
                  fontSize={20}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Payroll Verified
                  </h4>
                  <p className="text-sm text-green-700 mt-2">
                    This payroll has been verified, No issues were detected, but
                    please verify all details before finalizing.
                  </p>
                </div>
              </div>
            </div>

            <div
              hidden={
                problems.filter((p) => p.type === PAYROLL_PROBLEM.WARNNING)
                  .length <= 0
              }
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <Icon
                  icon="ion:warning-outline"
                  className="text-yellow-600 mt-0.5"
                  fontSize={20}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    {
                      problems.filter(
                        (p) => p.type === PAYROLL_PROBLEM.WARNNING,
                      ).length
                    }{" "}
                    Issue(s) Detected
                  </h4>
                  <ul className="space-y-2">
                    {problems
                      .filter((p) => p.type === PAYROLL_PROBLEM.WARNNING)
                      .map((p, _) => {
                        return (
                          <li key={_} className="text-sm text-yellow-800">
                            <span className="font-medium">
                              {p.employee.firstName} {p.employee.lastName} :
                            </span>{" "}
                            {p.message}
                          </li>
                        );
                      })}
                  </ul>
                  <p className="text-sm text-yellow-700 mt-2">
                    You can still finalize, but please verify these entries.
                  </p>
                </div>
              </div>
            </div>

            <div
              hidden={
                problems.filter((p) => p.type === PAYROLL_PROBLEM.CRITICAL)
                  .length <= 0
              }
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:forbid"
                  className="text-red-600 mt-0.5"
                  fontSize={20}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-2">
                    {
                      problems.filter(
                        (p) => p.type === PAYROLL_PROBLEM.CRITICAL,
                      ).length
                    }{" "}
                    Issue(s) Detected
                  </h4>
                  <ul className="space-y-2">
                    {problems
                      .filter((p) => p.type === PAYROLL_PROBLEM.CRITICAL)
                      .map((p, _) => {
                        return (
                          <li key={_} className="text-sm text-red-800">
                            <span className="font-medium">
                              {p.employee.firstName} {p.employee.lastName} :
                            </span>{" "}
                            {p.message}
                          </li>
                        );
                      })}
                  </ul>
                  <p className="text-sm text-red-700 mt-2">
                    You can not finalize when these issue occur, please fix
                    these before finalize
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon
                icon="material-symbols:info-outline-rounded"
                className="text-blue-600 mt-0.5"
                fontSize={24}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">
                  What happens after finalizing?
                </h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <Icon
                      icon="ic:outline-lock"
                      fontSize={18}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span>Payroll will be locked and cannot be edited</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      icon="simple-line-icons:check"
                      fontSize={18}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span>Status will change to &quot;Finalized&quot;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon
                      icon="material-symbols:mail-outline"
                      fontSize={18}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <span>
                      You can generate pay slips and send them to employees
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 rounded"
                value={confirmCheckbox}
                onChange={(e) => setConfirmCheckbox(!confirmCheckbox)}
              />
              <span className="text-sm text-gray-700">
                I confirm that I have reviewed all employee salary details and
                the information is accurate. I understand that the payroll
                cannot be edited after finalizing.
              </span>
            </label>
          </div>

          <div className="py-4 border-t border-gray-200 bg-gray-50 flex gap-4 items-center flex-row-reverse">
            <Button
              disabled={!confirmCheckbox || isCriticalPresence}
              startDecorator={
                <Icon
                  icon="simple-line-icons:check"
                  fontSize={20}
                  className="text-white"
                />
              }
              onClick={finalizeHandler}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition-colors"
            >
              Finalized
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
            >
              Cancel
            </Button>
          </div>
        </section>
      </ModalDialog>
    </Modal>
  );
}

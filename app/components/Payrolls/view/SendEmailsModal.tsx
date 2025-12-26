import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Loader2, Package, X } from "lucide-react";
import {
  Checkbox,
  CircularProgress,
  Input,
  LinearProgress,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { PayrollPeriodSummary } from "@/types/payrollPeriodSummary";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useCheckBox } from "@/hooks/useCheckBox";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedName } from "@/lib/getLocalizedName";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { EmailPayload } from "@/types/mailPayload";
import { useUser } from "@clerk/nextjs";
import { useJobStore } from "@/hooks/useJobStore";

interface ProgressItem {
  email: string;
  name?: string;
  status: "success" | "failed";
  error?: string;
}

interface ProgressState {
  current: number;
  total: number;
  message: string;
  items: ProgressItem[];
}

interface SendEmailsModalProps {
  summaryData: PayrollPeriodSummary;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SendEmailsModal({
  summaryData,
  open,
  setOpen,
}: SendEmailsModalProps) {
  const [batchId, setBatchId] = useState(-1);
  const [data, setData] = useState(summaryData);
  const { addJob, updateJob } = useJobStore();
  const [progress, setProgress] = useState({
    completed: 0,
    failed: 0,
    pending: 0,
    percent: 0,
    total: 0,
  });

  const [originalEmails, setOriginalEmails] = useState(() => {
    const emails: Record<number, string> = {};
    summaryData.records.forEach((record) => {
      emails[record.id] = record.employee.email;
    });
    return emails;
  });
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEmail, setEditingEmail] = useState(-1);
  const [tempEmail, setTempEmail] = useState("");
  const t = useTranslations("view_payroll.send_mail");
  const tPeriod = useTranslations("period");
  const tc = useTranslations("common");
  const locale = useLocale();

  const {
    checked,
    toggle,
    isAllChecked,
    isSomeChecked,
    isChecked,
    checkall,
    uncheckall,
  } = useCheckBox("sendEmailModal");

  const handleEditEmail = (recordId: number, currentEmail: string) => {
    setEditingEmail(recordId);
    setTempEmail(currentEmail);
  };

  const cancelEditEmail = () => {
    setEditingEmail(-1);
    setTempEmail("");
  };

  const handleSaveEmail = (recordId: number, email: string) => {
    if (!email || !email.includes("@")) {
      showError("Please enter a valid email address");
      return;
    }

    setEditingEmail(-1);
    setTempEmail("");
    setData((prev) => ({
      ...prev,
      records: prev.records.map((record) =>
        record.id === recordId
          ? {
              ...record,
              employee: {
                ...record.employee,
                email: email,
              },
            }
          : record,
      ),
    }));
  };

  const handleResetEmail = (recordId: number) => {
    const originalEmail = originalEmails[recordId];
    if (!originalEmail) return;

    setData((prev) => ({
      ...prev,
      records: prev.records.map((record) =>
        record.id === recordId
          ? {
              ...record,
              employee: {
                ...record.employee,
                email: originalEmail,
              },
            }
          : record,
      ),
    }));
  };

  const handleResetAllEmail = () => {
    setData((prev) => ({
      ...prev,
      records: prev.records.map((record) => {
        const originalEmail = originalEmails[record.id];
        return {
          ...record,
          employee: {
            ...record.employee,
            email: originalEmail ?? record.employee.email, // fallback
          },
        };
      }),
    }));
  };

  const handleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      checkall(data.records.map((r) => r.id));
    } else {
      uncheckall();
    }
  };
  const isEmailOverridden = (recordId: number) => {
    const record = data.records.find((r) => r.id === recordId);
    if (!record) return false;
    return record.employee.email !== originalEmails[recordId];
  };

  const getOverrideCount = () => {
    return data.records.filter(
      (record) => record.employee.email !== originalEmails[record.id],
    ).length;
  };

  const onSend = async () => {
    if (!user?.id) return;
    const payload: EmailPayload[] = data.records
      .filter((r) => checked.includes(r.id))
      .map((r) => {
        return {
          id: r.id,
          email: r.employee.email,
          metaData: {
            userId: user.id,
          },
        };
      });
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payroll/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const { data: batchId } = await response.json();
      setBatchId(batchId);
      addJob({
        batchId,
        title: t("modal.download.label"),
      });
      queryClient.invalidateQueries({
        queryKey: ["payrollPeriod", "summary", summaryData.id],
        exact: false,
      });
      // setOpen(false)
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const overrideCount = getOverrideCount();

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ padding: 0 }}>
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* {isSubmitting && (
            <Modal open={true}>
              <ModalDialog>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <CircularProgress
                    sx={{
                      "--CircularProgress-size": "90px",
                      "--CircularProgress-trackThickness": "10px",
                      "--CircularProgress-progressThickness": "10px",
                      "--CircularProgress-progressColor": "#9810fa",
                    }}
                    determinate
                    value={(progress.current / progress.total) * 100 || 0}
                  >
                    {Math.round((progress.current / progress.total) * 100)}%
                  </CircularProgress>
                  <p>{t("action.sending")}</p>
                  <p className="text-gray-600">{progress.message}</p>
                </div>
              </ModalDialog>
            </Modal>
          )} */}

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Icon icon="mynaui:send" className="text-white" fontSize={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("label")}
                </h2>
                <p className="text-sm text-gray-600">
                  {tPeriod("fields.period")}{" "}
                  {dateFormat(new Date(data.start_period))} -{" "}
                  {dateFormat(new Date(data.end_period))}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Info Banner */}
          <div className="px-6 py-3 bg-purple-50 border-b border-purple-100">
            <div className="flex items-start gap-2">
              <Icon
                icon="mdi:information-outline"
                className="text-purple-600 mt-0.5"
                fontSize={16}
              />
              <p className="text-sm text-purple-900">
                <strong>{t("tip")}: </strong> {t("tip_content")}
              </p>
            </div>
          </div>

          {/* Override Warning Banner */}
          {overrideCount > 0 && (
            <div className="px-6 py-3 bg-orange-50 border-b border-orange-100">
              <div className="flex items-start gap-2">
                <Icon
                  icon="mdi:alert-circle-outline"
                  className="text-orange-600 mt-0.5"
                  fontSize={16}
                />
                <p className="text-sm text-orange-900">
                  <strong>
                    {t("info.override_warn", { count: overrideCount })}
                  </strong>{" "}
                  {t("info.override_warn_content")}
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)] space-y-3">
            <div className="pb-3 border-b border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={isAllChecked(data.employeeCount)}
                  indeterminate={isSomeChecked(data.employeeCount)}
                  onChange={handleAll}
                />
                <p className="font-medium text-gray-700">
                  {tc("select_all", { count: data.employeeCount })}
                </p>
                {overrideCount > 0 && (
                  <button
                    onClick={() => handleResetAllEmail()}
                    className="px-2 py-1 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors font-medium"
                    title="Reset to original email"
                  >
                    {t("action.reset_all")}
                  </button>
                )}
              </label>
            </div>

            <div className="space-y-3">
              {data.records.map((record) => {
                const isEditing = editingEmail === record.id;
                const isOverridden = isEmailOverridden(record.id);
                const avatar = `${process.env.NEXT_PUBLIC_CDN_URL}/${record.employee.avatar}`;
                return (
                  <div
                    key={record.employee.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                      isChecked(record.id)
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Checkbox
                      checked={isChecked(record.id)}
                      onChange={() => toggle(record.id)}
                    />

                    {/* Employee Avatar */}
                    <div className="relative text-white">
                      <ChangableAvatar
                        src={avatar}
                        size={40}
                        fallbackTitle={record.employee.firstName.charAt(0)}
                        editable={false}
                      />
                      <div
                        className={`absolute -bottom-1 -right-1  ${record.sentMail ? "bg-green-700" : "bg-red-700"} rounded-full p-1`}
                      >
                        {record.sentMail ? (
                          <Icon icon="prime:send" fontSize={14} />
                        ) : (
                          <Icon icon="carbon:not-sent" fontSize={14} />
                        )}
                      </div>
                    </div>

                    {/* Employee Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {record.employee.firstName} {record.employee.lastName}
                      </p>
                      <div className="flex gap-2">
                        {/* Email Display/Edit */}
                        <div className="flex items-center gap-2 mt-1">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                sx={{
                                  height: 32,
                                  fontSize: 14,
                                  minWidth: 250,
                                  borderColor: "#e9d5ff",
                                }}
                                value={tempEmail}
                                onChange={(e) => setTempEmail(e.target.value)}
                                placeholder="Enter email address"
                                autoFocus
                              />
                              <button
                                className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                title="Save"
                                onClick={() =>
                                  handleSaveEmail(record.id, tempEmail)
                                }
                              >
                                <Icon
                                  icon="material-symbols:check-rounded"
                                  fontSize={16}
                                />
                              </button>
                              <button
                                className="p-1.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                title="Cancel"
                                onClick={cancelEditEmail}
                              >
                                <Icon
                                  icon="bitcoin-icons:cross-filled"
                                  fontSize={16}
                                />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-1">
                              <Icon
                                icon="mdi:email-outline"
                                fontSize={14}
                                className={
                                  isOverridden
                                    ? "text-orange-600"
                                    : "text-gray-400"
                                }
                              />
                              <span
                                className={`text-sm ${isOverridden ? "text-orange-900 font-medium" : "text-gray-600"}`}
                              >
                                {record.employee.email}
                              </span>
                              {isOverridden && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {t("info.override")}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Branch */}
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {getLocalizedName(record.employee.branch, locale)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 items-center">
                      {!isEditing && (
                        <>
                          {isOverridden && (
                            <button
                              onClick={() => handleResetEmail(record.id)}
                              className="px-2 py-1 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors font-medium"
                              title="Reset to original email"
                            >
                              {t("action.reset")}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleEditEmail(record.id, record.employee.email)
                            }
                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Edit email"
                          >
                            <Icon icon="mynaui:edit" fontSize={18} />
                          </button>
                        </>
                      )}
                      <p className="font-semibold text-gray-900 min-w-[100px] text-right">
                        ฿{moneyFormat(record.totals.net)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium"></span>{" "}
                {tc("selected", {
                  count: `${checked.length} of ${data.employeeCount}`,
                })}
                {overrideCount > 0 && (
                  <span className="ml-2 text-orange-600">
                    • {overrideCount} {t("info.override")}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {tPeriod("fields.grand_total")}: ฿{moneyFormat(data.totalNet)}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t("action.close")}
              </button>
              <button
                onClick={onSend}
                disabled={checked.length === 0 || isSubmitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex gap-2 items-center">
                    <Loader2 size={18} className="animate-spin" />
                    <p> {t("action.sending")}</p>
                  </span>
                ) : (
                  <span className="flex gap-2 items-center">
                    <Icon icon="mynaui:send" fontSize={18} />
                    {t("action.send")}{" "}
                    {checked.length > 0 && `(${checked.length})`}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </ModalDialog>
    </Modal>
  );
}

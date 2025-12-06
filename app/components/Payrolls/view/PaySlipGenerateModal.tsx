import React, { Dispatch, SetStateAction, useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Mail,
  X,
  CheckCircle,
  Loader2,
  Package,
} from "lucide-react";
import { Modal, ModalDialog } from "@mui/joy";
import { PayrollPeriodSummary } from "@/types/payrollPeriodSummary";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import { showError } from "@/utils/showSnackbar";
interface PaySlipGenerateModalProps {
  summaryData: PayrollPeriodSummary;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function PaySlipGenerateModal({
  summaryData,
  open,
  setOpen,
}: PaySlipGenerateModalProps) {
  const [showModal, setShowModal] = useState(true);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    {},
  );
  const [downloadingAll, setDownloadingAll] = useState(false);

  const getBlob = async (recordId: number) => {
    const response = await fetch(`/api/payroll/records/${recordId}/payslip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const blob = await response.blob();
    return blob;
  };

  const getAllBlob = async (periodId: number) => {
    const response = await fetch(`/api/payroll/periods/${periodId}/payslips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const blob = await response.blob();
    return blob;
  };

  const onPreview = async (recordId: number) => {
    const blob = await getBlob(recordId);
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
    window.URL.revokeObjectURL(url);
  };

  const onDownloadIndividule = async (recordId: number) => {
    setLoadingStates((prev) => ({ ...prev, [recordId]: true }));
    try {
      const blob = await getBlob(recordId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      showError("Download payslip failed");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [recordId]: false }));
    }
  };

  const handleDownloadAll = async (periodId: number) => {
    setDownloadingAll(true);
    try {
      const blob = await getAllBlob(periodId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const start = new Date(summaryData.start_period)
        .toISOString()
        .split("T")[0];

      const end = new Date(summaryData.end_period).toISOString().split("T")[0];

      a.download = `payslip_${start}_to_${end}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      showError("Download payslip failed");
    } finally {
      setDownloadingAll(false);
    }
  };

  if (!showModal) return null;

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ padding: 0 }}>
        <div className="bg-white rounded-lg  max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Generate Pay Slips
                </h2>
                <p className="text-sm text-gray-600">
                  Period: {dateFormat(new Date(summaryData.start_period))} -{" "}
                  {dateFormat(new Date(summaryData.end_period))}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Info Banner */}
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> You can preview, download individually, or
              download all at once.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
            <div className="space-y-3">
              {summaryData.records.map((record) => (
                <div
                  key={record.employee.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Employee Info */}
                  <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {record.employee.firstName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {record.employee.firstName} {record.employee.lastName}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">
                        {record.employee.nickName}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.employee.branch}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      ฿{moneyFormat(record.totals.net)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Preview */}
                    <button
                      onClick={() => onPreview(record.id)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Preview"
                    >
                      <Icon
                        icon="mdi:eye"
                        fontSize={18}
                        className="text-gray-600"
                      />
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => onDownloadIndividule(record.id)}
                      className="p-2 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Download"
                    >
                      {loadingStates[record.id] ? (
                        <Loader2 size={18} className="animate-spin text-blue-600" />
                      ) : (
                        <Download size={18} className="text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning for Zero Salary */}
            {summaryData.records.some((record) => record.totals.net === 0) && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>⚠️ Warning:</strong> Some employees have ฿0.00 salary.
                  Their pay slips will be generated but may need review.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {summaryData.employeeCount} employee(s) • Total: ฿
              {moneyFormat(summaryData.totalNet)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadAll(summaryData.id)}
                disabled={downloadingAll}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
              >
                {downloadingAll ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Package size={18} />
                    Download All as ZIP
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading Overlay for Download All */}
        {downloadingAll && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-xs  rounded-lg  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center gap-4">
              <Loader2 size={48} className="animate-spin text-blue-600" />
              <div className="text-center">
                <p className="font-semibold text-gray-900">
                  Generating Pay Slips...
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This may take a few moments
                </p>
              </div>
            </div>
          </div>
        )}
      </ModalDialog>
    </Modal>
  );
}

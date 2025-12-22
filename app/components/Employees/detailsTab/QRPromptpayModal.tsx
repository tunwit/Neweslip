import { isValidPromptPay } from "@/lib/isValidPromtpay";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import { QrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
interface QRModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  promptpay: string | null;
}
export default function QRPromptpayModal({
  open,
  setOpen,
  promptpay,
}: QRModalProps) {
  const te = useTranslations("employees");
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ width: "25%" }}>
        <ModalClose />
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">
              {te("fields.promtpay")}
            </h4>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-3 ">
            {promptpay && isValidPromptPay(promptpay) ? (
              <>
                <div className="flex justify-center py-4">
                  <div className="w-full h-full aspect-square  bg-purple-200  rounded-lg flex items-center justify-center p-2">
                    <div className="text-center w-full h-full">
                      <div className="relative w-full h-full">
                        <Image
                          alt="qr"
                          fill
                          className="rounded-md"
                          src={`https://promptpay.io/${promptpay.trim()}.png`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-600 uppercase tracking-wide">
                    {te("fields.promtpay")}
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className="font-mono font-medium text-gray-900">
                        {promptpay}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full flex justify-center items-center h-[252px]  ">
                <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center px-4">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">
                      {te("info.qr_not_available")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalDialog>
    </Modal>
  );
}

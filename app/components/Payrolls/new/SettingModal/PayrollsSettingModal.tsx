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
import BranchSelector from "@/widget/BranchSelector";
import { useCheckBox } from "@/hooks/useCheckBox";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
import { getRandomPastelColor } from "@/utils/generatePastelColor";
import { createPayrollRecords } from "@/app/action/payroll/record/createPayrollRecord";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useUser } from "@clerk/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedName } from "@/lib/getLocalizedName";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { useEmployees } from "@/hooks/hook.employee";
import { useEntry } from "@/hooks/payroll/entry/hook.entry";
import { InputForm } from "@/widget/InputForm";
import { useZodForm } from "@/lib/useZodForm";
import normalizeNull from "@/utils/normallizeNull";
import { payrollSettingForm } from "@/schemas/payroll/settingForm";
import { PeriodPublicDTO } from "@/types/type.period";
import { usePeriod } from "@/hooks/payroll/period/hook.period";
import { FormProvider } from "react-hook-form";
import z from "zod";
type SettingFormValues = z.infer<typeof payrollSettingForm>;

interface PayrollsAddEmployeeModal {
  period?: PeriodPublicDTO;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PayrollsSettingModal({
  period,
  open,
  setOpen,
}: PayrollsAddEmployeeModal) {
  const methods = useZodForm(payrollSettingForm, {
    defaultValues: normalizeNull({
      work_hour_per_day: Number(period?.work_hours_per_day),
      work_day_per_month: Number(period?.workdays_per_month),
    }),
  });
  const { control, handleSubmit } = methods;
  const t = useTranslations("period");

  const { mutateAsync: updatePeriodAsync } = usePeriod(period?.id).update;

  const onSubmit = async (data: SettingFormValues) => {
    try {
      await updatePeriodAsync({
        payload: {
          work_hours_per_day: String(data.work_hour_per_day),
          workdays_per_month: String(data.work_day_per_month),
        },
      });
      setOpen(false);
    } catch {}
  };
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        {/* <ModalOverflow> */}
        <ModalDialog sx={{ width: "50%" }}>
          <div className="flex flex-col justify-center w-full gap-1">
            <p className="font-bold text-lg">{t("setting.label")}</p>
            <p className="opacity-80 text-sm">{t("setting.description")}</p>
          </div>
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                handleSubmit(onSubmit)(e);
              }}
            >
              <div className="flex flex-col gap-3">
                <InputForm
                  control={control}
                  type="number"
                  name="work_hour_per_day"
                  label={t("fields.work_hour_per_day")}
                />
                <InputForm
                  control={control}
                  type="number"
                  name="work_day_per_month"
                  label={t("fields.work_day_per_month")}
                />
              </div>
              <div className="flex flex-row-reverse gap-2 mt-2 ">
                <Button type="submit" variant="solid">
                  {t("actions.save")}
                </Button>
                <Button variant="plain" onClick={() => setOpen(false)}>
                  {" "}
                  {t("actions.cancel")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  );
}

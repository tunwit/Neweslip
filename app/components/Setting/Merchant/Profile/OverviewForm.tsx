import { updateShop } from "@/app/action/updateShop";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useShopDetails } from "@/hooks/useShopDetails";
import { useZodForm } from "@/lib/useZodForm";
import { overviewSchema } from "@/schemas/setting/overviewForm";
import { NewShop, Shop } from "@/types/shop";
import normalizeNull from "@/utils/normallizeNull";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import { useUser } from "@clerk/nextjs";
import { Button } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import ChangePasswordModal from "./ChangePasswordModal";
import z from "zod";
import { useTranslations } from "next-intl";
type OverviewFormValues = z.infer<typeof overviewSchema>;
interface OverviewFormProps {
  shopData: Shop;
}
export default function OverviewForm({ shopData }: OverviewFormProps) {
  const { user } = useUser();
  const methods = useZodForm(overviewSchema, {
    defaultValues: normalizeNull({
      name: shopData?.name,
      taxId: shopData?.taxId,
      work_hours_per_day: Number(shopData?.work_hours_per_day),
      workdays_per_month: Number(shopData?.workdays_per_month),
    }),
  });
  const { control, handleSubmit } = methods;
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations("shops");

  const onSubmit = async (data: OverviewFormValues) => {
    if (!shopData.id || !user?.id) return;
    try {
      await updateShop(
        {
          ...data,
          work_hours_per_day: String(data.work_hours_per_day),
          workdays_per_month: String(data.workdays_per_month),
        },
        shopData.id,
        user?.id,
      );
      showSuccess(t("modal.save.success"));
      queryClient.invalidateQueries({ queryKey: ["shop"], exact: false });
    } catch (err: any) {
      showError(t("modal.save.fail", { err: err.message }));
    }
  };

  return (
    <FormProvider {...methods}>
      {openChangePasswordModal && (
        <ChangePasswordModal
          open={openChangePasswordModal}
          setOpen={setOpenChangePasswordModal}
        />
      )}
      <form
        className="space-y-3"
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
      >
        <InputForm control={control} name="name" label={t("fields.title")} />
        <InputForm control={control} name="taxId" label={t("fields.tax_id")} />
        <InputForm
          type="number"
          control={control}
          name="work_hours_per_day"
          label={t("fields.work_hour_per_day")}
        />
        <InputForm
          type="number"
          control={control}
          name="workdays_per_month"
          label={t("fields.work_day_per_month")}
        />
        <div className="flex gap-2 ">
          <Button type="submit" variant="outlined">
            {t("actions.save")}
          </Button>
          <Button
            variant="plain"
            onClick={() => setOpenChangePasswordModal(!openChangePasswordModal)}
          >
            {t("actions.change_password")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

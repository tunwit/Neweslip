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

  const onSubmit = async (data: NewShop) => {
    if (!shopData.id || !user?.id) return;
    try {
      await updateShop(data, shopData.id, user?.id);
      showSuccess("Update shop successfully");
      queryClient.invalidateQueries({ queryKey: ["shop"], exact: false });
    } catch (err) {
      showError(`Update shop failed ${err}`);
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
        <InputForm control={control} name="name" label="Title" />
        <InputForm control={control} name="taxId" label="Tax Id" />
        <InputForm
          type="number"
          control={control}
          name="work_hours_per_day"
          label="Work Hour / Day"
        />
        <InputForm
          type="number"
          control={control}
          name="workdays_per_month"
          label="Work Day / Month"
        />
        <div className="flex gap-2 ">
          <Button type="submit" variant="outlined">
            Save
          </Button>
          <Button
            variant="plain"
            onClick={() => setOpenChangePasswordModal(!openChangePasswordModal)}
          >
            Change Password
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

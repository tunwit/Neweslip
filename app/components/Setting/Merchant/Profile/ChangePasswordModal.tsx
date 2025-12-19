import { changeShopPassword } from "@/app/action/shop/changeShopPassword";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { hashPassword } from "@/lib/password";
import { useZodForm } from "@/lib/useZodForm";
import { changePasswordSchema } from "@/schemas/setting/changePasswordForm";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import { useUser } from "@clerk/nextjs";
import { Button, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FormProvider } from "react-hook-form";
import z from "zod";

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ChangePasswordModal({
  open,
  setOpen,
}: ChangePasswordModalProps) {
  const methods = useZodForm(changePasswordSchema);
  const { id } = useCurrentShop();
  const { user } = useUser();
  const t = useTranslations("shops");
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const [err, setError] = useState("");

  const onSubmit = async (data: ChangePasswordForm) => {
    if (!id || !user) return;
    setError("");
    if (data.newpassword !== data.confirmpassword) {
      setError("password not match");
      return;
    }
    try {
      const result = await changeShopPassword(
        data.oldpassword,
        data.confirmpassword,
        id,
        user.id,
      );
      if (result.code === 401) {
        setError(t("modal.change_password.incorrect"));
        return;
      }
      if (result.code === 404) {
        setError(t("modal.change_password.password_not_set"));
        return;
      }
      showSuccess(t("modal.change_password.success"));
      setOpen(false);
    } catch (err: any) {
      showError(t("modal.change_password.fail", { err: err.message }));
    }
  };
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <div>
            <h1>{t("change_password.label")}</h1>
            <p className="text-sm font-light text-gray-700">
              {t("change_password.description")}
            </p>

            <FormProvider {...methods}>
              <form
                onSubmit={(e) => {
                  handleSubmit(onSubmit)(e);
                }}
                className="space-y-3 mt-5"
              >
                <InputForm
                  control={control}
                  name="oldpassword"
                  label={t("change_password.fields.old_password")}
                />
                <InputForm
                  control={control}
                  name="newpassword"
                  label={t("change_password.fields.new_password")}
                />
                <InputForm
                  control={control}
                  name="confirmpassword"
                  label={t("change_password.fields.confirm_password")}
                />
                <p hidden={!err} className="text-red-800 text-xs -mt-2">
                  {err}
                </p>
                <Button
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  type="submit"
                  sx={{ width: "100%" }}
                >
                  {t("actions.change_password")}
                </Button>
              </form>
            </FormProvider>
          </div>
        </ModalDialog>
      </Modal>
    </>
  );
}

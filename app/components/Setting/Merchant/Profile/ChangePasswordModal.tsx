import { changeShopPassword } from "@/app/action/changeShopPassword";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { hashPassword } from "@/lib/password";
import { useZodForm } from "@/lib/useZodForm";
import { changePasswordSchema } from "@/schemas/setting/changePasswordForm";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import { useUser } from "@clerk/nextjs";
import { Button, Modal, ModalClose, ModalDialog } from "@mui/joy";
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
        setError("Password Incorrect");
        return;
      }
      if (result.code === 404) {
        setError("Password Not Set");
        return;
      }
      showSuccess("Password Changed");
      setOpen(false);
    } catch (err) {
      showError(`Cannot change password ${err}`);
    }
  };
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <div>
            <h1>Change password</h1>
            <p className="text-sm font-light text-gray-700">
              This password is used when unlock payroll
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
                  label="Old Password"
                />
                <InputForm
                  control={control}
                  name="newpassword"
                  label="New Password"
                />
                <InputForm
                  control={control}
                  name="confirmpassword"
                  label="Confirm Password"
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
                  Change
                </Button>
              </form>
            </FormProvider>
          </div>
        </ModalDialog>
      </Modal>
    </>
  );
}

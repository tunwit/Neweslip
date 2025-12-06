import { updateShop } from "@/app/action/updateShop";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { verify } from "@/lib/emailService";
import { useZodForm } from "@/lib/useZodForm";
import { emailConfigForm } from "@/schemas/email/emailConfigForm";
import { NewShop, Shop } from "@/types/shop";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
} from "@mui/joy";
import { useState } from "react";
import { Controller, FormProvider } from "react-hook-form";

interface EmailFormProps {
  shopData: Shop;
}
export default function EmailForm({ shopData }: EmailFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const [verified, setVerified] = useState(false);
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();

  const methods = useZodForm(emailConfigForm, {
    defaultValues: {
      SMTPHost: shopData.SMTPHost || "",
      SMTPPort: shopData.SMTPPort || undefined,
      SMTPSecure: shopData.SMTPSecure ?? true,
      emailName: shopData.emailName || "",
      emailAddress: shopData.emailAddress || "",
      emailPassword: shopData.emailPassword || "",
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const onSubmit = async (data: Omit<NewShop, "name">) => {
    if (!shopId || !user?.id) return;
    console.log(data);

    const emailVerify = await verify(
      data.SMTPHost || "",
      data.SMTPPort || 0,
      data.SMTPSecure || false,
      data.emailAddress || "",
      data.emailPassword || "",
    );
    setVerifyStatus(emailVerify.success);
    setVerifyError(emailVerify?.message);
    setVerified(true);
    if (emailVerify.success) {
      try {
        await updateShop({ ...data }, shopId, user?.id);
        showSuccess("Save email successfully");
      } catch (err) {
        showError(`Cannot save email ${err}`);
      }
    }
  };
  return (
    <div className="flex flex-col ">
      <FormProvider {...methods}>
        <form
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e);
          }}
          className="flex flex-col gap-2 w-[70%] lg:w-[50%]"
        >
          <div className="flex flex-row flex-wrap gap-4 mt-4">
            <InputForm control={control} name="SMTPHost" label="SMTP Host" />
            <InputForm
              type="number"
              control={control}
              name="SMTPPort"
              label="SMTP Port"
            />

            <FormControl required>
              <FormLabel>
                SMTP Secure
                {errors.SMTPSecure && (
                  <p className="text-xs ml-2 font-normal text-red-500 italic">
                    {errors.SMTPSecure.message}
                  </p>
                )}
              </FormLabel>
              <Controller
                control={control}
                name="SMTPSecure"
                render={({ field }) => (
                  <Select
                    defaultValue={true}
                    onChange={(_, value) => field.onChange(value)}
                  >
                    <Option value={true}>true</Option>
                    <Option value={false}>false</Option>
                  </Select>
                )}
              />
            </FormControl>
          </div>

          <InputForm control={control} name="emailName" label="Email Name" />
          <InputForm
            control={control}
            name="emailAddress"
            label="Email Address"
          />

          <FormControl required>
            <FormLabel>
              Email Password
              {errors.emailPassword && (
                <p className="text-xs ml-2 font-normal text-red-500 italic">
                  {errors.emailPassword.message}
                </p>
              )}
            </FormLabel>
            <Controller
              control={control}
              name="emailPassword"
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  endDecorator={
                    showPassword ? (
                      <Icon
                        icon="mdi:eye"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <Icon
                        icon="mdi:eye-off"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )
                  }
                />
              )}
            />
          </FormControl>
          <div className="w-fit">
            <Button
              loading={isSubmitting}
              disabled={isSubmitting}
              type="submit"
              color="primary"
              variant="outlined"
            >
              {isSubmitting ? "Verifying" : "Save"}
            </Button>
          </div>
        </form>
      </FormProvider>

      <div
        hidden={!verified}
        className="flex flex-col gap-2 justify-end w-full mt-3"
      >
        {verifyStatus ? (
          <section className="w-[50%] bg-green-100 border border-green-600 px-4 py-2 rounded-md">
            <span className="flex flex-row gap-1 items-center">
              <Icon
                className="text-green-700"
                icon="lets-icons:check-fill"
                fontSize={"20"}
              />
              <p className="text-green-700 opacity-70">
                This email config is valid and ready to use
              </p>
            </span>
          </section>
        ) : (
          <section className="w-[50%] bg-red-100 border border-red-600 px-4 py-2 rounded-md">
            <span className="flex flex-row gap-1 items-center">
              <Icon
                className="text-red-700"
                icon="mdi:cross-circle"
                fontSize={"20"}
              />
              <p className="text-red-700 opacity-70">
                Cannot verify this email config. {verifyError}
              </p>
            </span>
          </section>
        )}
      </div>
    </div>
  );
}

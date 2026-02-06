import { createOTField } from "@/app/action/payroll/OTField/createOTField";
import { createSalaryField } from "@/app/action/payroll/salaryField/createSalaryField";
import { updateOTField } from "@/app/action/payroll/OTField/updateOTFIeld";
import { updateSalaryFIeld } from "@/app/action/payroll/salaryField/updateSalaryField";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useZodForm } from "@/lib/useZodForm";
import { OTFieldSchema } from "@/schemas/setting/OTFieldForm";
import { salaryFieldSchema } from "@/schemas/setting/salaryFieldForm";
import {
  OT_METHOD,
  OT_TYPE,
  SALARY_FIELD_DEFINATION_TYPE,
} from "@/types/enum/enum";
import { NewOtField, OtField } from "@/types/otField";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Slider,
  ToggleButtonGroup,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { Decimal } from "decimal.js";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { NewOTFieldDTO, OTFieldPublicDTO } from "@/types/payroll/type.ot";
import {
  useCreateOTField,
  useUpdateOTField,
} from "@/hooks/payroll/fields/hook.ot";

interface AddOTModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  field: OTFieldPublicDTO | null;
}

export default function AddEditOTModal({
  open,
  setOpen,
  field,
}: AddOTModalProps) {
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const t = useTranslations("overtime");
  const { mutateAsync: createMutate } = useCreateOTField();
  const { mutateAsync: updateMutate } = useUpdateOTField();

  const methods = useZodForm(OTFieldSchema, {
    defaultValues: {
      name: field?.name || "",
      nameEng: field?.nameEng || "",
      type: field?.type || OT_TYPE.BASEDONSALARY,
      method: field?.method || OT_METHOD.DAILY,
      multiplier: field?.multiplier || "1.5",
      fixedAmount: field?.fixedAmount || "0",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const closeHandler = () => {
    methods.reset();
    setOpen(false);
  };

  const submitHandler = async (data: NewOTFieldDTO) => {
    if (!shopId || !user?.id) return;
    try {
      if (field) {
        // edit mode
        await updateMutate({
          shopId: shopId,
          fieldId: field.id,
          payload: data,
        });
        showSuccess("OT updated successfully");
      } else {
        // add mode
        console.log(data);

        await createMutate({ shopId: shopId, payload: data });
        showSuccess("OT added successfully");
      }
    } catch (err: any) {
      let msg = err;
      if (err.message == "ER_DUP_ENTRY") msg = "OT cannot have duplicate name";

      showError(`Add OT failed\n${msg}`);
    }
    closeHandler();
  };

  const typeValue = methods.watch("type");

  useEffect(() => {
    if (typeValue !== OT_TYPE.CONSTANT) {
      // clear the field when not constant
      setValue("fixedAmount", null);
    }
  }, [typeValue, setValue]);

  useEffect(() => {
    if (!open) return;
    methods.reset({
      name: field?.name || "",
      nameEng: field?.nameEng || "",
      type: field?.type || OT_TYPE.BASEDONSALARY,
      method: field?.method || OT_METHOD.DAILY,
      multiplier: field?.multiplier || "1.5",
      fixedAmount: field?.fixedAmount || "0",
    });
  }, [field, open]);

  return (
    <>
      <Modal open={open} onClose={() => closeHandler()}>
        <ModalDialog sx={{ background: "#fafafa" }}>
          <ModalClose></ModalClose>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="grid gap-3">
                <InputForm
                  control={control}
                  name="name"
                  label={t("fields.name")}
                />
                <InputForm
                  control={control}
                  name="nameEng"
                  label={t("fields.name_eng")}
                />

                <Controller
                  name="method"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl>
                      {fieldState.error?.message}
                      <FormLabel>
                        {t("fields.method")}
                        {fieldState.error && (
                          <p className="text-xs ml-2 font-normal text-red-500 italic">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormLabel>

                      <ToggleButtonGroup
                        value={field.value}
                        // size="sm"
                        onChange={(e, v) => {
                          field.onChange(
                            OT_METHOD[v as keyof typeof OT_METHOD],
                          );
                        }}
                      >
                        <Button value={OT_METHOD.HOURLY}>
                          {t("method.hourly")}
                        </Button>
                        <Button value={OT_METHOD.DAILY}>
                          {t("method.daily")}
                        </Button>
                      </ToggleButtonGroup>
                    </FormControl>
                  )}
                />

                <Controller
                  name="multiplier"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl>
                      <FormLabel>
                        {t("fields.rate")}
                        {fieldState.error && (
                          <p className="text-xs ml-2 font-normal text-red-500 italic">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormLabel>
                      <Slider
                        size="sm"
                        variant="soft"
                        aria-label="Small steps"
                        value={Number(field.value)}
                        step={0.5}
                        marks={[
                          { value: 1, label: "x1" },
                          { value: 2, label: "x2" },
                          { value: 3, label: "x3" },
                        ]}
                        min={1}
                        max={3}
                        valueLabelDisplay="auto"
                        onChange={(e, v) => {
                          field.onChange(v.toString());
                        }}
                      />
                    </FormControl>
                  )}
                />

                <Controller
                  name="type"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl>
                      {fieldState.error?.message}
                      <FormLabel>
                        {t("fields.type")}
                        {fieldState.error && (
                          <p className="text-xs ml-2 font-normal text-red-500 italic">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormLabel>
                      <Select
                        value={OT_TYPE[field.value as keyof typeof OT_TYPE]}
                        onChange={(e, v) => {
                          field.onChange(OT_TYPE[v as keyof typeof OT_TYPE]);
                        }}
                      >
                        <Option value={OT_TYPE.BASEDONSALARY}>
                          {t("type.basedonsalary")}
                        </Option>
                        <Option value={OT_TYPE.CONSTANT}>
                          {t("type.constant")}
                        </Option>
                      </Select>
                    </FormControl>
                  )}
                />

                {typeValue == OT_TYPE.CONSTANT && (
                  <InputForm
                    control={control}
                    name="fixedAmount"
                    required={true}
                    label={t("fields.rate_of_pay")}
                  />
                )}
              </div>
              <div className="mt-3">
                <Button
                  disabled={isSubmitting}
                  loadingPosition="start"
                  loading={isSubmitting}
                  type="submit"
                  sx={{ width: "100%" }}
                >
                  {field ? t("actions.update") : t("actions.create")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  );
}

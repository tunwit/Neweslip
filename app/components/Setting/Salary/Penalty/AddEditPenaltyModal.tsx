import { createOTField } from "@/app/action/createOTField";
import { createSalaryField } from "@/app/action/createSalaryField";
import { updateOTField } from "@/app/action/updateOTFIeld";
import { updateSalaryFIeld } from "@/app/action/updateSalaryFIeld";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useZodForm } from "@/lib/useZodForm";
import { OTFieldSchema } from "@/schemas/setting/OTFieldForm";
import { salaryFieldSchema } from "@/schemas/setting/salaryFieldForm";
import {
  OT_METHOD,
  OT_TYPE,
  PENALTY_METHOD,
  PENALTY_TYPE,
  SALARY_FIELD_DEFINATION_TYPE,
} from "@/types/enum/enum";
import { NewOtField, OtField } from "@/types/otField";
import { NewSalaryField, SalaryField } from "@/types/salaryFields";
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
import { NewPenaltyField, PenaltyField } from "@/types/penaltyField";
import { PenaltyFieldSchema } from "@/schemas/setting/PenaltyFieldForm";
import { createPenaltyField } from "@/app/action/createPenaltyField";
import { updatePenaltyField } from "@/app/action/updatePenaltyFIeld";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

interface AddEditPenaltyModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  field: PenaltyField | null;
}

export default function AddEditPenaltyModal({
  open,
  setOpen,
  field,
}: AddEditPenaltyModalProps) {
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const t = useTranslations("penalty");

  const methods = useZodForm(PenaltyFieldSchema, {
    defaultValues: {
      name: field?.name || "",
      nameEng: field?.nameEng || "",
      type: field?.type || PENALTY_TYPE.BASEDONSALARY,
      method: field?.method || PENALTY_METHOD.PERMINUTE,
      rateOfPay: field?.rateOfPay || "0",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitSuccessful, isSubmitting },
  } = methods;

  const closeHandler = () => {
    methods.reset();
    setOpen(false);
  };

  const submitHandler = async (data: Omit<NewPenaltyField, "shopId">) => {
    if (!shopId || !user?.id) return;
    try {
      if (field) {
        // edit mode
        await updatePenaltyField(field.id, data, user?.id);
        showSuccess("OT updated successfully");
      } else {
        // add mode
        await createPenaltyField(data, shopId, user?.id);
        showSuccess("OT added successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["penaltyFields"] });
    } catch (err: any) {
      let msg = err;
      if (err.message == "ER_DUP_ENTRY")
        msg = "Penalty cannot have duplicate name";

      showError(`Add OT failed\n${msg}`);
    }
    closeHandler();
  };

  const typeValue = methods.watch("type");

  useEffect(() => {
    if (typeValue !== PENALTY_TYPE.CONSTANT) {
      // clear the field when not constant
      setValue("rateOfPay", undefined);
    }
  }, [typeValue, setValue]);

  useEffect(() => {
    methods.reset({
      name: field?.name || "",
      nameEng: field?.nameEng || "",
      type: field?.type,
      method: field?.method,
      rateOfPay: field?.rateOfPay || "0",
    });
  }, [field, methods.reset]);

  return (
    <>
      <Modal open={open} onClose={() => closeHandler()}>
        <ModalDialog sx={{ background: "#fafafa" }}>
          <ModalClose></ModalClose>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="grid  gap-3">
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
                        value={
                          PENALTY_METHOD[
                            field.value as keyof typeof PENALTY_METHOD
                          ]
                        }
                        // size="sm"
                        onChange={(e, v) => {
                          field.onChange(
                            PENALTY_METHOD[v as keyof typeof PENALTY_METHOD],
                          );
                        }}
                      >
                        <Button value={PENALTY_METHOD.PERMINUTE}>
                          {t("method.perminute")}
                        </Button>
                        <Button value={PENALTY_METHOD.HOURLY}>
                          {t("method.hourly")}
                        </Button>
                        <Button value={PENALTY_METHOD.DAILY}>
                          {t("method.daily")}
                        </Button>
                      </ToggleButtonGroup>
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
                        value={
                          PENALTY_TYPE[field.value as keyof typeof PENALTY_TYPE]
                        }
                        onChange={(e, v) => {
                          field.onChange(
                            PENALTY_TYPE[v as keyof typeof PENALTY_TYPE],
                          );
                        }}
                      >
                        <Option value={PENALTY_TYPE.BASEDONSALARY}>
                          {t("type.basedonsalary")}
                        </Option>
                        <Option value={PENALTY_TYPE.CONSTANT}>
                          {t("type.constant")}
                        </Option>
                      </Select>
                    </FormControl>
                  )}
                />

                {typeValue == PENALTY_TYPE.CONSTANT && (
                  <InputForm
                    control={control}
                    name="rateOfPay"
                    required={true}
                    label="Rate of Pay"
                  />
                )}
              </div>
              <div className="mt-3">
                <Button
                  disabled={isSubmitting || isSubmitSuccessful}
                  loadingPosition="start"
                  loading={isSubmitting}
                  type="summit"
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

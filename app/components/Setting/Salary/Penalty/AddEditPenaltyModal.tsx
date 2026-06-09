import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useZodForm } from "@/lib/useZodForm";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  ToggleButtonGroup,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { PenaltyFieldSchema } from "@/schemas/setting/PenaltyFieldForm";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import {
  NewPenaltyFieldDTO,
  PenaltyFieldPublicDTO,
} from "@/types/payroll/type.penalty";
import { PENALTY_METHOD, PENALTY_TYPE } from "@/types/enum/enum.penalty";
import {
  useCreatePenaltyField,
  useUpdatePenaltyField,
} from "@/hooks/payroll/fields/hook.penalty";

interface AddEditPenaltyModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  field: PenaltyFieldPublicDTO | null;
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
  const { mutateAsync: createMutate } = useCreatePenaltyField();
  const { mutateAsync: updateMutate } = useUpdatePenaltyField();

  const methods = useZodForm(PenaltyFieldSchema, {
    defaultValues: {
      name: field?.name || "",
      nameEng: field?.nameEng || "",
      type: field?.type || PENALTY_TYPE.BASEDONSALARY,
      method: field?.method || PENALTY_METHOD.PER_MINUTE,
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

  const submitHandler = async (data: NewPenaltyFieldDTO) => {
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
        await createMutate({ shopId: shopId, payload: data });
        showSuccess("OT added successfully");
      }
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
      setValue("fixedAmount", null);
    }
  }, [typeValue, setValue]);

  useEffect(() => {
    methods.reset({
      name: field?.name || "",
      nameEng: field?.nameEng || "",
      type: field?.type || PENALTY_TYPE.BASEDONSALARY,
      method: field?.method || PENALTY_METHOD.PER_MINUTE,
      fixedAmount: field?.fixedAmount || "0",
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
                        <Button value={PENALTY_METHOD.PER_MINUTE}>
                          {t("method.per_minute")}
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
                    name="fixedAmount"
                    required={true}
                    label="Rate of Pay"
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

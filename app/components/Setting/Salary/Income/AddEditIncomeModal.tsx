import {
  useCreateCompensationField,
  useUpdateCompensationField,
} from "@/hooks/payroll/fields/hook.compensation";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useZodForm } from "@/lib/useZodForm";
import { salaryFieldSchema } from "@/schemas/setting/salaryFieldForm";


import { COMPEN_FIELD_DEFINATION_TYPE } from "@/types/enum/enum.compensation";
import {
  CompensationFieldPublicDTO,
  NewCompensationFieldDTO,
} from "@/types/payroll/type.compensation";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import { useUser } from "@clerk/nextjs";
import { Button, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { FormProvider } from "react-hook-form";

interface AddIncomeModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  field: CompensationFieldPublicDTO | null;
}

const defaultType = COMPEN_FIELD_DEFINATION_TYPE.INCOME;

export default function AddEditIncomeModal({
  open,
  setOpen,
  field,
}: AddIncomeModalProps) {
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const t = useTranslations("earning");
  const { mutateAsync: createMutate } = useCreateCompensationField();
  const { mutateAsync: updateMutate } = useUpdateCompensationField();

  const methods = useZodForm(salaryFieldSchema, {
    defaultValues: {
      name: field?.name || "",
      nameEng: field?.nameEng || "",
      type: defaultType,
      formular: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const closeHandler = () => {
    methods.reset();
    setOpen(false);
  };

  const submitHandler = async (data: NewCompensationFieldDTO) => {
    if (!shopId || !user?.id) return;
    try {
      if (field) {
        // edit mode
        await updateMutate({
          shopId: shopId,
          fieldId: field.id,
          payload: data,
        });
        showSuccess("Income updated successfully");
      } else {
        // add mode
        await createMutate({ shopId: shopId, payload: data });
        showSuccess("Income added successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["salaryFields"] });
    } catch (err: any) {
      let msg = err;
      if (err.message == "ER_DUP_ENTRY")
        msg = "Income cannot have duplicate name";

      showError(`Add Income failed\n${msg}`);
    }
    closeHandler();
  };

  useEffect(() => {
    methods.reset({
      name: field?.name || "",
      nameEng: field?.nameEng || "",
      type: defaultType,
      formular: undefined,
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
              </div>
              <div className="mt-3">
                <Button
                  disabled={isSubmitting}
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

import { createSalaryField } from "@/app/action/payroll/salaryField/createSalaryField";
import { updateSalaryFIeld } from "@/app/action/payroll/salaryField/updateSalaryField";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useZodForm } from "@/lib/useZodForm";
import { salaryFieldSchema } from "@/schemas/setting/salaryFieldForm";
import {
  SALARY_FIELD_DEFINATION_TYPE,
  SALARY_FIELD_STATUS,
} from "@/types/enum/enum";
import { NewSalaryField, SalaryField } from "@/types/salaryFields";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import { useUser } from "@clerk/nextjs";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { FormProvider } from "react-hook-form";

interface AddIncomeModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  field: SalaryField | null;
}

const defaultType = SALARY_FIELD_DEFINATION_TYPE.NON_CALCULATED;

export default function AddEditDisplayOnlyModal({
  open,
  setOpen,
  field,
}: AddIncomeModalProps) {
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const t = useTranslations("displayonly");

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
    formState: { isSubmitSuccessful, isSubmitting },
  } = methods;
  const closeHandler = () => {
    methods.reset();
    setOpen(false);
  };

  const submitHandler = async (data: Omit<NewSalaryField, "shopId">) => {
    if (!shopId || !user?.id) return;
    try {
      if (field) {
        // edit mode
        const payload: Omit<SalaryField, "id" | "shopId"> = {
          ...data,
          type: defaultType,
          formular: data.formular ?? null,
          isActive: SALARY_FIELD_STATUS.ACTIVE,
        };

        await updateSalaryFIeld(field.id, payload, user?.id);
        showSuccess("Income updated successfully");
      } else {
        // add mode
        await createSalaryField(data, shopId, user?.id);
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

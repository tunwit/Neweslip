import { useCreateBranch, useUpdateBranch } from "@/hooks/hook.branch";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useZodForm } from "@/lib/useZodForm";
import { branchSchema } from "@/schemas/setting/branchForm";
import { BranchPublicDTO, NewBranchDTO } from "@/types/type.branch";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import { useUser } from "@clerk/nextjs";
import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { FormProvider } from "react-hook-form";

interface AddAbsentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  branch: BranchPublicDTO | null;
}

export default function AddEditBranchModal({
  open,
  setOpen,
  branch,
}: AddAbsentModalProps) {
  const methods = useZodForm(branchSchema, {
    defaultValues: {
      name: branch?.name || "",
      nameEng: branch?.nameEng || "",
      address: branch?.address || "",
    },
  });
  const { control, handleSubmit } = methods;
  const { id } = useCurrentShop();
  const user = useUser();
  const queryClient = useQueryClient();
  const { mutateAsync: createMutateAsync } = useCreateBranch();
  const { mutateAsync: updateMutateAsync } = useUpdateBranch();

  const t = useTranslations("branches");

  const closeHandler = () => {
    setOpen(false);
  };

  useEffect(() => {
    methods.reset({
      name: branch?.name || "",
      nameEng: branch?.nameEng || "",
      address: branch?.address || "",
    });
  }, [branch, methods.reset]);

  const submitHandler = async (data: Omit<NewBranchDTO, "shopId">) => {
    if (!id) return;
    try {
      if (branch) {
        // edit mode
        await updateMutateAsync({
          shopId: id,
          branchId: branch.id,
          payload: {
            name: data.name,
            nameEng: data.nameEng,
            address: data.address,
          },
        });
        showSuccess("Branch updated successfully");
      } else {
        // add mode
        await createMutateAsync({
          shopId: id,
          payload: {
            name: data.name,
            nameEng: data.nameEng,
            address: data.address,
          },
        });
        showSuccess("Branch added successfully");
      }
    } catch (err: any) {
      let msg = err;
      if (err.message == "ER_DUP_ENTRY")
        msg = "Branch cannot have duplicate name";

      showError(`Add branch failed\n${msg}`);
    }
    closeHandler();
  };

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
                <InputForm
                  control={control}
                  name="address"
                  label={t("fields.address")}
                />
              </div>
              <div className="mt-3">
                <Button type="summit" sx={{ width: "100%" }}>
                  {branch ? t("actions.update") : t("actions.create")}
                </Button>
              </div>
            </form>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  );
}

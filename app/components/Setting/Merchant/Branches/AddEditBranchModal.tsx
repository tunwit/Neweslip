import { createBranch } from "@/app/action/createBranch";
import { updateBranch } from "@/app/action/updateBranch";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useSnackbar } from "@/hooks/useSnackBar";
import { useZodForm } from "@/lib/useZodForm";
import { branchSchema } from "@/schemas/setting/branchForm";
import { Branch, NewBranch } from "@/types/branch";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { InputForm } from "@/widget/InputForm";
import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
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
  ToggleButtonGroup,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";

interface AddAbsentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  branch:Branch | null
}

export default function AddEditBranchModal({ open, setOpen ,branch}: AddAbsentModalProps) {
  const methods = useZodForm(branchSchema, {
    defaultValues: {
      name: branch?.name || "",
      nameEng: branch?.nameEng || "",
    },
  })
  const {control, handleSubmit} = methods
  const {id} = useCurrentShop()
  const user = useUser()
  const queryClient = useQueryClient();

  const closeHandler = () => {
    setOpen(false);
  };

  useEffect(() => {
    methods.reset({
      name: branch?.name || "",
      nameEng: branch?.nameEng || "",
    });
    
  }, [branch, methods.reset]);

  const submitHandler = async(data:Omit<NewBranch,"shopId">) => {
    if(!id) return
    try{
      if (branch) {
        // edit mode
        await updateBranch(branch.id, data,user.user?.id || null);
        showSuccess("Branch updated successfully");
      } else {
        // add mode
        await createBranch(data, id,user.user?.id || null);
        showSuccess("Branch added successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["branch"] });
    }catch(err:any){
      let msg = err
      if(err.message== "ER_DUP_ENTRY") msg = "Branch cannot have duplicate name"

      showError(`Add branch failed\n${msg}`)
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
              <InputForm control={control} name="name" label="Name"/>
              <InputForm control={control} name="nameEng" label="Name English"/>
            </div>
            <div className="mt-3">
              <Button type="summit" sx={{ width: "100%" }}>
                {branch ? "Update" : "Add"}
              </Button>
            </div>
          </form>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  );
}

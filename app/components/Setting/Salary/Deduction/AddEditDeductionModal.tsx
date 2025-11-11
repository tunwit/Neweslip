import { createSalaryField } from "@/app/action/createSalaryField";
import { updateSalaryFIeld } from "@/app/action/updateSalaryFIeld";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useZodForm } from "@/lib/useZodForm";
import { salaryFieldSchema } from "@/schemas/setting/salaryFieldForm";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
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
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FormProvider } from "react-hook-form";

interface AddDeductionModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  field: SalaryField | null
}


const defaultType = SALARY_FIELD_DEFINATION_TYPE.DEDUCTION

export default function AddEditDeductionModal({ open, setOpen, field }: AddDeductionModalProps) {
  const {id:shopId} = useCurrentShop()
  const queryClient = useQueryClient()

  const methods = useZodForm(salaryFieldSchema, {
      defaultValues: {
        name: field?.name || "",
        nameEng: field?.nameEng || "",
        type: defaultType,
        formular: undefined
      },
    })

  const { control , handleSubmit, formState:{isSubmitSuccessful,isSubmitting}} = methods
  const closeHandler = () => {
    methods.reset();
    setOpen(false);
  };

    const submitHandler = async(data:Omit<NewSalaryField,"shopId">) => {
      if(!shopId) return
      try{
        if (field) {
          // edit mode
          const payload: Omit<SalaryField, "id" | "shopId"> = {
            ...data,
            type: defaultType,
            formular: data.formular ?? null,
          };

          await updateSalaryFIeld(field.id, payload);
          showSuccess("Deduction updated successfully");
        } else {
          // add mode
          await createSalaryField(data, shopId);
          showSuccess("Deduction added successfully");
        }
        queryClient.invalidateQueries({ queryKey: ["salaryFields"] });
      }catch(err:any){
        let msg = err
        if(err.message== "ER_DUP_ENTRY") msg = "Deduction cannot have duplicate name"
  
        showError(`Add Deduction failed\n${msg}`)
      }
      closeHandler();
    };
  
      useEffect(() => {
        methods.reset({
          name: field?.name || "",
          nameEng: field?.nameEng || "",
          type: defaultType,
          formular: undefined
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
              <InputForm control={control} name="name" label="Name"/>
              <InputForm control={control} name="nameEng" label="Name English"/>
            </div>
            <div className="mt-3">
              <Button disabled={isSubmitting || isSubmitSuccessful} loadingPosition="start" loading={isSubmitting} type="summit" sx={{ width: "100%" }} loadingPosition="start" loading={isSubmitting}>
                {field ? "Update" : "Add"}
              </Button>
            </div>
          </form>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  );
}

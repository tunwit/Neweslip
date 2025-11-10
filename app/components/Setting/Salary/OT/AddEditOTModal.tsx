import { createOTField } from "@/app/action/createOTField";
import { createSalaryField } from "@/app/action/createSalaryField";
import { updateOTField } from "@/app/action/updateOTFIeld";
import { updateSalaryFIeld } from "@/app/action/updateSalaryFIeld";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useZodForm } from "@/lib/useZodForm";
import { OTFieldSchema } from "@/schemas/setting/OTFieldForm";
import { salaryFieldSchema } from "@/schemas/setting/salaryFieldForm";
import { OT_METHOD, OT_TYPE, SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
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
import {Decimal} from 'decimal.js';

interface AddOTModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  field: OtField | null
}

export default function AddEditOTModal({ open, setOpen, field }: AddOTModalProps) {
  const {id:shopId} = useCurrentShop()
  const queryClient = useQueryClient()

  const methods = useZodForm(OTFieldSchema, {
      defaultValues: {
        name: field?.name || "",
        nameEng: field?.nameEng || "",
        type: field?.type,
        method: field?.method,
        rate: field?.rate || "1",
        rateOfPay: field?.rateOfPay || ""
      },
    })

  const { control , handleSubmit, setValue} = methods
  const closeHandler = () => {
    methods.reset();
    setOpen(false);
  };

    const submitHandler = async(data:Omit<NewOtField,"shopId">) => {
      if(!shopId) return
      try{
        if (field) {
          // edit mode
          await updateOTField(field.id, data);
          showSuccess("OT updated successfully");
        } else {
          // add mode
          await createOTField(data, shopId);
          showSuccess("OT added successfully");
        }
        queryClient.invalidateQueries({ queryKey: ["OTFields"] });
      }catch(err:any){
        let msg = err
        if(err.message== "ER_DUP_ENTRY") msg = "OT cannot have duplicate name"
  
        showError(`Add OT failed\n${msg}`)
      }
      closeHandler();
    };
    
    const typeValue = methods.watch("type");

    useEffect(() => {
      if (typeValue !== OT_TYPE.CONSTANT) {
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
      rate: field?.rate || "1",
      rateOfPay: field?.rateOfPay || ""
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
             
              <Controller
                name="method"
                control={control}
                render={({ field, fieldState }) => (
                
                  <FormControl>
                    {fieldState.error?.message}
                    <FormLabel>
                      Method
                      {fieldState.error && (
                        <p className="text-xs ml-2 font-normal text-red-500 italic">{fieldState.error.message}</p>
                      )}
                      </FormLabel>
                    <ToggleButtonGroup
                      value={OT_METHOD[field.value as keyof typeof OT_METHOD]}
                      // size="sm"
                      onChange={(e,v)=>{
                      field.onChange(OT_METHOD[v as keyof typeof OT_METHOD])}}
                    >
                      <Button value={OT_METHOD.HOURLY}>hourly</Button>
                      <Button value={OT_METHOD.DAILY}>daily</Button>
                    </ToggleButtonGroup>
                  </FormControl>
                )}
              />

              <Controller
                name="rate"
                control={control}
                render={({ field, fieldState }) => (
                 <FormControl>
                  <FormLabel>
                    OT Rate
                    {fieldState.error && (
                      <p className="text-xs ml-2 font-normal text-red-500 italic">{fieldState.error.message}</p>
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
                    onChange={(e,v)=>{field.onChange(v.toString())}}
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
                    Type
                    {fieldState.error && (
                    <p className="text-xs ml-2 font-normal text-red-500 italic">{fieldState.error.message}</p>
                  )}
                  </FormLabel>
                  <Select
                    value={OT_TYPE[field.value as keyof typeof OT_TYPE]}
                    onChange={(e,v)=>{
                      field.onChange(OT_TYPE[v as keyof typeof OT_TYPE])}}
                  >
                    <Option value={OT_TYPE.BASEDONSALARY}>base on salary</Option>
                    <Option value={OT_TYPE.CONSTANT}>constant</Option>
                  </Select>
                </FormControl>
                )}
              />
              
              {typeValue == OT_TYPE.CONSTANT && (
                <InputForm control={control} name="rateOfPay" required={true} label="Rate of Pay"/>
              )}
            </div>
            <div className="mt-3">
              <Button type="summit" sx={{ width: "100%" }}>
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

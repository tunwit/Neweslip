import React, { Dispatch, SetStateAction, useEffect } from "react";
import PersonalForm from "./PersonalForm";
import AddressForm from "./AddressForm";
import ContractForm from "./ContractForm";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { personalSchema } from "@/schemas/createEmployeeForm/personalForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "@/schemas/createEmployeeForm/addressForm";
import { contractSchema } from "@/schemas/createEmployeeForm/contractForm";
import { usePathname, useRouter } from "next/navigation";
import { fetchwithauth } from "@/utils/fetcher";
import { extractSlug } from "@/utils/extractSlug";
import { useSnackbar } from "@/hooks/useSnackBar";
import { createEmployee } from "@/app/action/createEmployee";
import { NewEmployee } from "@/types/employee";
import { useZodForm } from "@/lib/useZodForm";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";

interface FormSectionProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const formPages = [
  { title: "Personal Information", component: PersonalForm },
  { title: "Address", component: AddressForm },
  { title: "Contract", component: ContractForm },
];

const createEmployeeFormSchema = personalSchema
  .merge(addressSchema)
  .merge(contractSchema);
type FormField = z.infer<typeof createEmployeeFormSchema>; // This is the type RHF provides

export default function FormSection({
  currentPage,
  setCurrentPage,
}: FormSectionProps) {
  const methods = useZodForm(createEmployeeFormSchema);
  const pathname = usePathname().split("/");
  const rounter = useRouter();
  const { show, setMessage } = useSnackbar();
  const queryClient = useQueryClient();
  const user = useUser()

  const onCreatError = () => {
    setMessage({ message: "Something went wrong", type: "failed" });
    show();
  };

  const onCreateSuccess = () => {
    setMessage({ message: "Create employee successful", type: "success" });
    show();
    rounter.push(`/${pathname[1]}/employees`);
  };

  // FIX: Change the input type of onSubmit from NewEmployee to FormField
  const onSubmit = async (data: FormField) => {
    const valid = await methods.trigger();
    if (!valid) return;
    
    const slug = pathname[1];
    const { id } = extractSlug(slug);
    // Construct the final data object, merging the form data with the required shopId
    const employeePayload: NewEmployee = {
        ...data,
        shopId: id,
    };
    try {
      await createEmployee(employeePayload,user.user?.id || null);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onCreateSuccess();
    } catch {
      methods.setError("firstName", {
        type: "server",
        message: "Backend error",
      });
      onCreatError();
    }
  };
  
  return (
    <div className="">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          {formPages.map((value, index) => {
            const Component = value.component;
            return (
              <div key={index}>
                <p
                  hidden={currentPage !== index}
                  className="font-bold text-2xl mt-10"
                >
                  {value.title}
                </p>
                <div hidden={currentPage !== index}>
                  <Component setCurrentPage={setCurrentPage} />
                </div>
              </div>
            );
          })}
        </form>
      </FormProvider>
    </div>
  );
}
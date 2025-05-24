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
import { createEmployee } from "@/lib/api/createEmployee";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { fetchwithauth } from "@/utils/fetcher";
import { extractSlug } from "@/utils/extractSlug";
import { useSnackbar } from "@/hooks/useSnackBar";

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
type FormField = z.infer<typeof createEmployeeFormSchema>;

export default function FormSection({
  currentPage,
  setCurrentPage,
}: FormSectionProps) {
  const methods = useForm<FormField>({
    resolver: zodResolver(createEmployeeFormSchema),
  });
  const pathname = usePathname().split("/");
  const rounter = useRouter();
  const { show, setMessage } = useSnackbar();

  const onCreatError = (error: Error) => {
    setMessage({ message: "Something went wrong", type: "failed" });
    show();
  };

  const onCreateSuccess = () => {
    setMessage({ message: "Create employee successful", type: "success" });
    show();
    rounter.push(`/${pathname[1]}/employees`);
  };

  const mutation = createEmployee(onCreatError, onCreateSuccess);

  const onSubmit = async (data: Record<string, any>) => {
    console.log("summiting");
    const valid = await methods.trigger();
    if (!valid) return;
    const slug = pathname[1];
    const { id } = extractSlug(slug);
    data.shopId = id;
    await mutation.mutateAsync(data);
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

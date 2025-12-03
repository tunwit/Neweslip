import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, IconButton, Table } from "@mui/joy";
import React, { useState } from "react";
import { useCheckBox } from "@/hooks/useCheckBox";
import { useBranch } from "@/hooks/useBranch";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { deleteBranch } from "@/app/action/deleteBranch";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { Branch } from "@/types/branch";
import { useSalaryFields } from "@/hooks/useSalaryFields";
import { SalaryField } from "@/types/salaryFields";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
import { deleteSalaryField } from "@/app/action/deleteSalaryField";
import AddEditIncomeModal from "../Income/AddEditIncomeModal";
import { useOTFields } from "@/hooks/useOTFields";
import { OtField } from "@/types/otField";

import { PenaltyField } from "@/types/penaltyField";
import { usePenaltyFields } from "@/hooks/usePenaltyFields";
import {
  PENALTY_METHOD_LABELS,
  PENALTY_TYPE_LABELS,
  SALARY_FIELD_DEFINATION_TYPE_LABELS,
} from "@/types/enum/enumLabel";
import AddEditPenaltyModal from "./AddEditPenaltyModal";
import { deletePenaltyField } from "@/app/action/deletePenaltyField";
import { useUser } from "@clerk/nextjs";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import AddEditDisplayOnlyModal from "./AddEditDisplayOnlyModal";

export default function DisplayOnlyTab() {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<SalaryField | null>(null);
  const { id: shopId } = useCurrentShop();
  const checkboxMethods = useCheckBox<number>("allPenaltyTable");
  const { checked, checkall, uncheckall } = checkboxMethods;
  const { user } = useUser();

  const queryClient = useQueryClient();

  const addHandler = () => {
    setSelectedField(null);

    setOpen(true);
  };

  if (!shopId) return <p>loading</p>;
  const { data, isLoading, isSuccess } = useSalaryFields(shopId);

  const handleDelete = async () => {
    try {
      if (!shopId || !user?.id) return;
      uncheckall();
      await deleteSalaryField(checked, shopId, user?.id);
      showSuccess("Delete field success");
      queryClient.invalidateQueries({ queryKey: ["salaryFields"] });
    } catch {
      showError("Delete field failed");
    }
  };

  return (
    <>
      <div className="-mt-4">
        <AddEditDisplayOnlyModal
          open={open}
          setOpen={setOpen}
          field={selectedField}
        />
        <div className="flex flex-row items-center gap-3">
          <h1 className="font-medium text-3xl">Display only</h1>
        </div>
        <p className="opacity-70 font-normal text-xs mt-1">
          Configure employee Display only components here. The values entered
          will not be calculated in the payroll calculation.
        </p>

        <div className="-mt-6">
          <div className="flex flex-row-reverse">
            <Button
              disabled={checked ? checked.length === 0 : true}
              variant="plain"
              onClick={handleDelete}
            >
              <p className="underline font-medium">delete</p>
            </Button>
          </div>
          <TableWithCheckBox
            data={data?.data?.NON_CALCULATED}
            isLoading={isLoading}
            isSuccess={isSuccess}
            checkboxMethods={checkboxMethods}
            setSelectedItem={setSelectedField}
            setOpen={setOpen}
            columns={[
              { key: "name", label: "Thai Label" },
              { key: "nameEng", label: "English Label" },
              { key: "formular", label: "Formular" },
            ]}
          />
        </div>
        <div className="mt-2">
          <Button onClick={addHandler}>Add New Field</Button>
        </div>
      </div>
    </>
  );
}

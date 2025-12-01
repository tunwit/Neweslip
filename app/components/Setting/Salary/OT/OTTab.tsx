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
import AddEditOTModal from "./AddEditOTModal";
import { OT_METHOD_LABELS, OT_TYPE_LABELS } from "@/types/enum/enumLabel";
import { useUser } from "@clerk/nextjs";
import { deleteOTField } from "@/app/action/deleteOTField";

export default function OTTab() {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<OtField | null>(null);
  const { id: shopId } = useCurrentShop();
  const checkboxMethods = useCheckBox<number>("allOTTable");
  const { checked, checkall, uncheckall } = checkboxMethods;
  const { user } = useUser();
  const queryClient = useQueryClient();

  const addHandler = () => {
    setSelectedField(null);
    setOpen(true);
  };
  if (!shopId || !user?.id) return <p>loading</p>;
  const { data, isLoading, isSuccess } = useOTFields(shopId);

  const handleDelete = async () => {
    try {
      if (!shopId) return;
      uncheckall();
      await deleteOTField(checked, shopId, user?.id);
      showSuccess("Delete field success");
      queryClient.invalidateQueries({ queryKey: ["OTFields"], exact: false });
    } catch {
      showError("Delete field failed");
    }
  };

  return (
    <>
      <div className="-mt-4">
        <AddEditOTModal open={open} setOpen={setOpen} field={selectedField} />
        <h1 className="font-medium text-3xl">Overtimes</h1>
        <p className="opacity-70 font-normal text-xs mt-1">
          Configure employee OT components here. The values entered will be
          automatically summed up in the payroll calculation.
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
            data={data?.data}
            isLoading={isLoading}
            isSuccess={isSuccess}
            checkboxMethods={checkboxMethods}
            setSelectedItem={setSelectedField}
            setOpen={setOpen}
            columns={[
              { key: "name", label: "Thai Label" },
              { key: "nameEng", label: "English Label" },
              {
                key: "type",
                label: "Type",
                render: (row: OtField) => OT_TYPE_LABELS[row.type],
              },
              {
                key: "method",
                label: "Method",
                render: (row: OtField) => OT_METHOD_LABELS[row.method],
              },
              { key: "rate", label: "OT Rate" },
            ]}
          />
        </div>
        <div className="mt-2">
          <Button onClick={addHandler}>Add New Overtime</Button>
        </div>
      </div>
    </>
  );
}

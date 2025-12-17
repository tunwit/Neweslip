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
import AddEditDeductionModal from "./AddEditDeductionModal";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export default function DeductionTab() {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<SalaryField | null>(null);
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();
  const checkboxMethods = useCheckBox<number>("allIncomeTable");
  const { checked, checkall, uncheckall } = checkboxMethods;
  const t = useTranslations("deduction");

  const queryClient = useQueryClient();

  const addHandler = () => {
    setSelectedField(null);
    setOpen(true);
  };
  const { data, isLoading, isSuccess } = useSalaryFields(shopId || -1);

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
        <AddEditDeductionModal
          open={open}
          setOpen={setOpen}
          field={selectedField}
        />
        <h1 className="font-medium text-3xl">{t("label")}</h1>
        <p className="opacity-70 font-normal text-xs mt-1">
          {t("description")}
        </p>
        <div className="-mt-6">
          <div className="flex flex-row-reverse">
            <Button
              disabled={checked ? checked.length === 0 : true}
              variant="plain"
              onClick={handleDelete}
            >
              <p className="underline font-medium"> {t("actions.delete")}</p>
            </Button>
          </div>
          <TableWithCheckBox
            data={data?.data?.DEDUCTION}
            isLoading={isLoading}
            isSuccess={isSuccess}
            checkboxMethods={checkboxMethods}
            setSelectedItem={setSelectedField}
            setOpen={setOpen}
            columns={[
              { key: "name", label: t("fields.name") },
              { key: "nameEng", label: t("fields.name_eng") },
              { key: "formular", label: t("fields.formular") },
            ]}
          />
        </div>
        <div className="mt-2">
          <Button onClick={addHandler}>{t("actions.create")}</Button>
        </div>
      </div>
    </>
  );
}

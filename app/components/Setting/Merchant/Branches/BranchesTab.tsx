import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, IconButton, Table } from "@mui/joy";
import React, { useState } from "react";
import AddBranchModal from "./AddEditBranchModal";
import { useCheckBox } from "@/hooks/useCheckBox";
import { useBranch } from "@/hooks/useBranch";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { deleteBranch } from "@/app/action/deleteBranch";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { Branch } from "@/types/branch";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
import { useRouter } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import ConfirmModal from "@/widget/ConfirmModal";
import { useTranslations } from "next-intl";

export default function BranchesTab() {
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const { id: shopId } = useCurrentShop();
  const checkboxMethods = useCheckBox<number>("allBranchTable");
  const { checked, checkall, uncheckall } = checkboxMethods;
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useUser();
  const addHandler = () => {
    setSelectedBranch(null);
    setOpen(true);
  };

  const { data, isLoading, isSuccess } = useBranch();
  const t = useTranslations("branches")
  const handleDelete = async () => {
    try {
      if (!shopId) return;
      uncheckall();
      await deleteBranch(checked, shopId, user.user?.id || null);
      showSuccess("Delete branch success");
      queryClient.invalidateQueries({ queryKey: ["branch"] });

      router.refresh();
    } catch {
      showError("Delete branch failed");
    }
  };

  return (
    <>
      <div className="-mt-4">
        <ConfirmModal
          title={t("delete.label")}
          description={t("delete.description")}
          open={openConfirm}
          setOpen={() => setOpenConfirm(!openConfirm)}
          onConfirm={handleDelete}
          onCancel={() => setOpenConfirm(false)}
        />

        <AddBranchModal open={open} setOpen={setOpen} branch={selectedBranch} />
        <h1 className="font-medium text-3xl">{t("label")}</h1>
        <div className="-mt-6">
          <div className="flex flex-row-reverse">
            <Button
              disabled={checked ? checked.length === 0 : true}
              variant="plain"
              onClick={() => setOpenConfirm(true)}
            >
              <p className="underline font-medium">{t("actions.delete")}</p>
            </Button>
          </div>
          <TableWithCheckBox
            data={data?.data}
            isLoading={isLoading}
            isSuccess={isSuccess}
            checkboxMethods={checkboxMethods}
            setSelectedItem={setSelectedBranch}
            setOpen={setOpen}
            columns={[
              { key: "name", label: t("fields.name"), width: "30%" },
              { key: "nameEng", label: t("fields.name_eng"), width: "30%" },
              { key: "address", label: t("fields.address") },
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

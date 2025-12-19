"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon, loadIcon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import EmployeesTable from "@/app/components/Employees/EmployeesTable";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import SnackBar from "@/widget/SnackBar";
import { Suspense, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";
import BranchSelector from "@/widget/BranchSelector";
import StatusSelector from "@/widget/StatusSelector";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { Pagination } from "@mui/material";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useEmployeeStats } from "@/hooks/employee/useEmployeeStats";
import { EmployeeTableWrapper } from "@/app/components/Employees/EmployeeTableWrapper";
import Head from "next/head";
import DocumentTable from "@/widget/Documents/DocumentTable";
import { useShopDocuments } from "@/hooks/shop/useShopDocuments";
import { ShopDocumentWithUploader } from "@/types/shopDocument";
import { useUser } from "@clerk/nextjs";
import { renameEmployeeDocument } from "@/app/action/employee/renameEmployeeDocument";
import { uploadShopDocument } from "@/app/action/shop/uploadShopDocument";
import deleteShopDocument from "@/app/action/shop/deleteShopDocument";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { renameShopDocument } from "@/app/action/shop/renameShopDocument";
import { Modal, ModalDialog } from "@mui/joy";
import { useTranslations } from "next-intl";

export default function Document() {
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 500);
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();
  const { data, isLoading } = useShopDocuments({
    shopId: shopId || -1,
    search_query: debounced,
  });
  const { name } = useCurrentShop();
  const queryClient = useQueryClient();
  const tb = useTranslations("breadcrumb");
  const t = useTranslations("documents");

  const onRename = async (doc: ShopDocumentWithUploader, newName: string) => {
    if (!shopId || !user?.id) return;
    const prefix = doc.key.substring(0, doc.key.lastIndexOf("/"));

    try {
      await renameShopDocument(
        doc.id,
        newName,
        doc.key,
        `${prefix}/${newName}`,
        shopId,
        user?.id,
      );
      showSuccess(t("modal.rename.success"));
    } catch (err: any) {
      showError(t("modal.rename.fail", { err: err.message }));
    }

    queryClient.invalidateQueries({
      queryKey: ["shop", "document"],
      exact: false,
    });
  };

  const onUpload = async (files: File[], tag: string, targetId: number) => {
    if (!shopId || !user?.id) return [];

    const result = await uploadShopDocument(files, tag, targetId, user?.id);

    return result;
  };

  const onDelete = async (doc: ShopDocumentWithUploader) => {
    if (!shopId || !user) return;
    try {
      await deleteShopDocument(doc.id, doc.key, shopId, user.id);
      queryClient.invalidateQueries({
        queryKey: ["shop", "document"],
        exact: false,
      });
      showSuccess(t("modal.delete.success"));
    } catch (err: any) {
      showError(t("modal.delete.fail", { err: err?.message }));
    }
  };
  return (
    <>
      <title>Documents - Mitr</title>
      <Modal open={isLoading}>
        <ModalDialog>
          <div className="flex flex-col items-center justify-center">
            <Icon
              icon={"mynaui:spinner"}
              className="animate-spin"
              fontSize={50}
            />

            <p>{t("load.loading_doc")}...</p>
          </div>
        </ModalDialog>
      </Modal>
      <main className="min-h-screen w-full bg-white font-medium">
        <div className="mx-10">
          <div className="flex flex-row text-[#424242] text-xs mt-10">
            <p>
              {name} {">"} {tb("dashboard")} {">"}&nbsp;
            </p>
            <p className="text-blue-800">{tb("documents")}</p>
          </div>
          <div className=" mt-5 flex flex-row justify-between">
            <p className="text-black text-4xl font-bold">{t("label")}</p>
          </div>

          <div className="mt-8 flex flex-row gap-2">
            <div className="w-full">
              <p className="text-black text-xs mb-1">{t("search.label")}</p>
              <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
                <Icon
                  className="text-[#424242]"
                  icon={"material-symbols:search-rounded"}
                />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <DocumentTable
              title=""
              tag="files"
              data={data?.data || []}
              targetId={shopId || -1}
              onRename={async (doc, newName) => onRename(doc, newName)}
              onUpload={async (files: File[], tag: string, targetId: number) =>
                onUpload(files, tag, targetId)
              }
              onDelete={async (doc) => onDelete(doc)}
            />
          </div>
        </div>
      </main>
    </>
  );
}

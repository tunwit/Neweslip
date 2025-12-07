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
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useEmployeeStats } from "@/hooks/useEmployeeStats";
import { EmployeeTableWrapper } from "@/app/components/Employees/EmployeeTableWrapper";
import Head from "next/head";
import DocumentTable from "@/widget/Documents/DocumentTable";
import { useShopDocuments } from "@/hooks/useShopDocuments";
import { ShopDocumentWithUploader } from "@/types/shopDocument";
import { useUser } from "@clerk/nextjs";
import { renameEmployeeDocument } from "@/app/action/renameEmployeeDocument";
import { uploadShopDocument } from "@/app/action/uploadShopDocument";
import deleteShopDocument from "@/app/action/deleteShopDocument";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { renameShopDocument } from "@/app/action/renameShopDocument";
import { Modal, ModalDialog } from "@mui/joy";

export default function page() {
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
    } catch (err) {
      showError(`cannot rename ${err}`);
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
    await deleteShopDocument(doc.id, doc.key, shopId, user.id);
    queryClient.invalidateQueries({
      queryKey: ["shop", "document"],
      exact: false,
    });
    showSuccess("Deleted");
  };
  return (
    <>
      <title>Documents - E Slip</title>
      <Modal open={isLoading}>
        <ModalDialog>
          <div className="flex flex-col items-center justify-center">
            <Icon
              icon={"mynaui:spinner"}
              className="animate-spin"
              fontSize={50}
            />

            <p>Loading Document...</p>
          </div>
        </ModalDialog>
      </Modal>
      <main className="min-h-screen w-full bg-white font-medium">
        <div className="mx-10">
          <div className="flex flex-row text-[#424242] text-xs mt-10">
            <p>
              {name} {">"} Dashboard {">"}&nbsp;
            </p>
            <p className="text-blue-800">Documents</p>
          </div>
          <div className=" mt-5 flex flex-row justify-between">
            <p className="text-black text-4xl font-bold">Documents</p>
          </div>

          <div className="mt-8 flex flex-row gap-2">
            <div className="w-full">
              <p className="text-black text-xs mb-1">Search Documents</p>
              <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
                <Icon
                  className="text-[#424242]"
                  icon={"material-symbols:search-rounded"}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <DocumentTable
              title="Files"
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

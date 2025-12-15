import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Table } from "@mui/joy";
import React from "react";
import { useEmployeeDocuments } from "@/hooks/useEmployeeDocuments";
import DocumentTable from "@/widget/Documents/DocumentTable";
import { renameEmployeeDocument } from "@/app/action/renameEmployeeDocument";
import { EmployeeDocumentWithUploader } from "@/types/employeeDocument";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { uploadEmployeeDocuments } from "@/app/action/uploadEmployeeDocument";
import deleteEmployeeDocument from "@/app/action/deleteEmployeeDocument";
import { useTranslations } from "next-intl";
interface EmployeeDetailsDocumentsProps {
  title: string;
  tag: string;
  employeeId: number;
}
export default function EmployeeDetailsDocuments({
  title,
  tag,
  employeeId,
}: EmployeeDetailsDocumentsProps) {
  const { data } = useEmployeeDocuments({ employeeId: employeeId });
  const t = useTranslations("documents")
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();
  const personalDocs = data?.data?.filter((doc) => doc.tag === "personal");
  const contractDocs = data?.data?.filter((doc) => doc.tag === "contract");
  const otherDocs = data?.data?.filter(
    (doc) => doc.tag !== "personal" && doc.tag !== "contract",
  );
  const queryClient = useQueryClient();

  const onRename = async (
    doc: EmployeeDocumentWithUploader,
    newName: string,
  ) => {
    if (!shopId || !user?.id) return;
    const prefix = doc.key.substring(0, doc.key.lastIndexOf("/"));
    
    try {
      await renameEmployeeDocument(
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
      queryKey: ["employees", "document"],
      exact: false,
    });
  };

  const onUpload = async (files: File[], tag: string, targetId: number) => {
    if (!shopId || !user?.id) return [];

    const result = await uploadEmployeeDocuments(
      files,
      tag,
      targetId,
      shopId,
      user?.id,
    );

    return result;
  };

  const onDelete = async (doc: EmployeeDocumentWithUploader) => {
    if (!shopId || !user) return;
    await deleteEmployeeDocument(doc.id, doc.key, shopId, user.id);
    queryClient.invalidateQueries({
      queryKey: ["employees", "document", doc.employeeId],
    });
    showSuccess("Deleted");
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <DocumentTable
          title={t("type.personal_doc")}
          tag="personal"
          data={personalDocs || []}
          targetId={employeeId}
          onRename={async (doc, newName) => onRename(doc, newName)}
          onUpload={async (files: File[], tag: string, targetId: number) =>
            onUpload(files, tag, targetId)
          }
          onDelete={async (doc) => onDelete(doc)}
        />
        <DocumentTable
          title={t("type.contract_doc")}
          tag="contract"
          data={contractDocs || []}
          targetId={employeeId}
          onRename={async (doc, newName) => onRename(doc, newName)}
          onUpload={async (files: File[], tag: string, targetId: number) =>
            onUpload(files, tag, targetId)
          }
          onDelete={async (doc) => onDelete(doc)}
        />
        <DocumentTable
          title={t("type.others_doc")}
          tag="Others"
          data={otherDocs || []}
          targetId={employeeId}
          onRename={async (doc, newName) => onRename(doc, newName)}
          onUpload={async (files: File[], tag: string, targetId: number) =>
            onUpload(files, tag, targetId)
          }
          onDelete={async (doc) => onDelete(doc)}
        />
      </div>
    </>
  );
}

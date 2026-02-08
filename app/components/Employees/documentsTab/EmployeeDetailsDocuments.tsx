import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Table } from "@mui/joy";
import React from "react";
import DocumentTable from "@/widget/Documents/DocumentTable";
import { renameEmployeeDocument } from "@/app/action/employee/renameEmployeeDocument";
import { EmployeeDocumentWithUploader } from "@/types/employeeDocument";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { uploadEmployeeDocuments } from "@/app/action/employee/uploadEmployeeDocument";
import deleteEmployeeDocument from "@/app/action/employee/deleteEmployeeDocument";
import { useTranslations } from "next-intl";
import {
  useCreateEmployeeDocument,
  useDeleteEmployeeDocument,
  useEmployeeDocument,
  useEmployeeDocuments,
  useRenameEmployeeDocument,
} from "@/hooks/hook.employee.document";
import { EmployeeDocumentPublicDTO } from "@/types/type.employee.document";
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
  const { data, isLoading } = useEmployeeDocuments(employeeId);
  const t = useTranslations("documents");
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();
  const { mutateAsync: createMutate } = useCreateEmployeeDocument();
  const { mutateAsync: getPresignMutate } = useEmployeeDocument();
  const { mutateAsync: renameMutate } = useRenameEmployeeDocument();
  const { mutateAsync: deleteMutate } = useDeleteEmployeeDocument();

  const personalDocs = data?.data?.filter((doc) => doc.tag === "personal");
  const contractDocs = data?.data?.filter((doc) => doc.tag === "contract");
  const otherDocs = data?.data?.filter(
    (doc) => doc.tag !== "personal" && doc.tag !== "contract",
  );
  const onRename = async (doc: EmployeeDocumentPublicDTO, newName: string) => {
    if (!shopId || !user?.id) return;
    try {
      await renameMutate({
        employeeId: employeeId,
        documentId: doc.id,
        payload: { newName: newName },
      });
    } catch (err) {
      showError(`cannot rename ${err}`);
    }
  };

  const onUpload = async (files: File[], tag: string, targetId: number) => {
    if (!shopId || !user?.id) return [];

    const result = await createMutate({
      employeeId: employeeId,
      payload: { files: files, tag: tag },
    });

    return result;
  };

  const onDelete = async (doc: EmployeeDocumentPublicDTO) => {
    if (!shopId || !user) return;
    await deleteMutate({ employeeId: employeeId, documentId: doc.id });
    showSuccess("Deleted");
  };

  const onClickUrl = async (doc: EmployeeDocumentPublicDTO) => {
    const result = await getPresignMutate({
      employeeId: employeeId,
      payload: { id: doc.id },
    });
    if (!result.data?.url) return;

    window.open(result.data?.url, "_blank", "noopener,noreferrer");
  };

  const onCopy = async (doc: EmployeeDocumentPublicDTO) => {
    const result = await getPresignMutate({
      employeeId: employeeId,
      payload: { id: doc.id },
    });
    if (!result.data?.url) return;
    navigator.clipboard.writeText(result.data?.url);
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <DocumentTable
          title={t("type.personal_doc")}
          tag="personal"
          isLoading={isLoading}
          onClickUrl={onClickUrl}
          data={personalDocs || []}
          targetId={employeeId}
          onCopy={onCopy}
          onRename={async (doc, newName) => onRename(doc, newName)}
          onUpload={async (files: File[], tag: string, targetId: number) =>
            onUpload(files, tag, targetId)
          }
          onDelete={async (doc) => onDelete(doc)}
        />
        <DocumentTable
          title={t("type.contract_doc")}
          tag="contract"
          isLoading={isLoading}
          data={contractDocs || []}
          targetId={employeeId}
          onCopy={onCopy}
          onClickUrl={onClickUrl}
          onRename={async (doc, newName) => onRename(doc, newName)}
          onUpload={async (files: File[], tag: string, targetId: number) =>
            onUpload(files, tag, targetId)
          }
          onDelete={async (doc) => onDelete(doc)}
        />
        <DocumentTable
          title={t("type.others_doc")}
          tag="Others"
          isLoading={isLoading}
          data={otherDocs || []}
          targetId={employeeId}
          onCopy={onCopy}
          onClickUrl={onClickUrl}
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

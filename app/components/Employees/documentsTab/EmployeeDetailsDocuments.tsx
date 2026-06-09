import React from "react";
import DocumentTable from "@/widget/Documents/DocumentTable";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useUser } from "@clerk/nextjs";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useTranslations } from "next-intl";
import { useDocuments } from "@/hooks/hook.document";
import { DocumentPublicDTO } from "@/types/type.document";

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
  const { data, isLoading } = useDocuments("employee", employeeId).list;
  const t = useTranslations("documents");
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();
  const employeeDocs = useDocuments("employee", employeeId);

  const personalDocs = data?.data?.filter((doc) => doc.tag === "personal");
  const contractDocs = data?.data?.filter((doc) => doc.tag === "contract");
  const otherDocs = data?.data?.filter(
    (doc) => doc.tag !== "personal" && doc.tag !== "contract",
  );
  const onRename = async (doc: DocumentPublicDTO, newName: string) => {
    if (!shopId || !user?.id) return;
    try {
      await employeeDocs.rename.mutateAsync({
        documentId: doc.id,
        payload: { newName: newName },
      });
    } catch (err) {
      showError(`cannot rename ${err}`);
    }
  };

  const onUpload = async (files: File[], tag: string, targetId: number) => {
    if (!shopId || !user?.id) return [];

    const result = await employeeDocs.create.mutateAsync({
      payload: { files: files, tag: tag },
    });

    return result;
  };

  const onDelete = async (doc: DocumentPublicDTO) => {
    if (!shopId || !user) return;
    await employeeDocs.remove.mutateAsync({ documentId: doc.id });
    showSuccess("Deleted");
  };

  const onClickUrl = async (doc: DocumentPublicDTO) => {
    const result = await employeeDocs.getPresign.mutateAsync({
      payload: { id: doc.id },
    });
    if (!result.data?.url) return;

    window.open(result.data?.url, "_blank", "noopener,noreferrer");
  };

  const onCopy = async (doc: DocumentPublicDTO) => {
    const result = await employeeDocs.getPresign.mutateAsync({
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

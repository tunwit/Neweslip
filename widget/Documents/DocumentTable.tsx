import RenameModal from "@/widget/Documents/RenameModal";
import DocumentTableElement from "./DocumentTableElement";
import { useState } from "react";
import UploadDocumentModal from "@/widget/Documents/UploadDocumentModal";
import { Button, Table } from "@mui/joy";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { DocumentPublicDTO } from "@/types/type.document";

interface DocumentTableProps<T> {
  title: string;
  tag: string;
  data: T[];
  targetId: number;
  isLoading: boolean;
  onClickUrl: (doc: T) => void;
  onUpload?: (files: File[], tag: string, targetId: number) => void;
  onDelete?: (doc: T) => void;
  onCopy: (doc: T) => void;
  onRename?: (doc: T, newName: string) => void;
}

export default function DocumentTable<T extends DocumentPublicDTO>({
  title,
  tag,
  data,
  targetId,
  isLoading,
  onClickUrl,
  onCopy,
  onUpload,
  onDelete,
  onRename,
}: DocumentTableProps<T>) {
  const [open, setOpen] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<T | null>(null);
  const t = useTranslations("documents");
  return (
    <div className="w-full">
      {openRename && selectedDoc && (
        <RenameModal
          doc={selectedDoc}
          open={openRename}
          setOpen={setOpenRename}
          onRename={(doc, newName) => onRename?.(doc, newName)!}
        />
      )}
      {open && (
        <UploadDocumentModal
          open={open}
          setOpen={setOpen}
          tag={tag}
          targetId={targetId}
          onUpload={(files, tag, targetId) => onUpload?.(files, tag, targetId)!}
        />
      )}

      <div className="">
        <section className="flex justify-between items-center mb-2">
          <p className="font-semibold">{title}</p>
          <Button
            variant="outlined"
            size="sm"
            startDecorator={
              <Icon icon="material-symbols:add-rounded" fontSize={"15px"} />
            }
            onClick={() => setOpen(true)}
          >
            <p className="text-xs">{t("actions.create")}</p>
          </Button>
        </section>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="bg-gray-50 border border-gray-200 w-full">
            <thead className=" bg-gray-50 border border-gray-200">
              <tr className="bg-gray-100 h-12 rounded-t-md text-left">
                <th className="w-[45%] font-light text-sm whitespace-nowrap pl-6">
                  {t("fields.name")}
                </th>
                <th className="w-[20%] font-light text-sm whitespace-nowrap">
                  {t("fields.modify_at")}
                </th>
                <th className="w-[20%] font-light text-sm whitespace-nowrap">
                  {t("fields.upload_by")}
                </th>
                <th className="w-[15%] font-light text-sm whitespace-nowrap">
                  {t("fields.size")}
                </th>
                <th className="w-[10%] font-light text-sm whitespace-nowrap pr-6"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="w-full h-16 text-center">
                    <p>{t("load.loading_doc")}</p>
                  </td>
                </tr>
              )}
              {!isLoading && data.length === 0 && (
                <tr>
                  <td colSpan={5} className=" h-16 text-center">
                    <p>{t("table.no_document")}</p>
                  </td>
                </tr>
              )}
              {!isLoading &&
                data.map((doc) => (
                  <DocumentTableElement
                    key={doc.id}
                    doc={doc}
                    onClickUrl={onClickUrl}
                    onCopy={onCopy}
                    setSelectedDoc={setSelectedDoc}
                    setOpenRename={setOpenRename}
                    onDelete={() => onDelete?.(doc)}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

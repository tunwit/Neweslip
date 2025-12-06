import RenameModal from "@/widget/Documents/RenameModal";
import DocumentTableElement from "./DocumentTableElement";
import { useState } from "react";
import UploadDocumentModal from "@/widget/Documents/UploadDocumentModal";
import { Button, Table } from "@mui/joy";
import { Icon } from "@iconify/react/dist/iconify.js";

interface DocumentTableProps<T> {
  title: string;
  tag: string;
  data: T[];
  targetId: number;
  onUpload?: (files: File[], tag: string, targetId: number) => void;
  onDelete?: (doc: T) => void;
  onRename?: (doc: T, newName: string) => void;
}

export default function DocumentTable<
  T extends { id: number; key: string; fileName: string },
>({
  title,
  tag,
  data,
  targetId,
  onUpload,
  onDelete,
  onRename,
}: DocumentTableProps<T>) {
  const [open, setOpen] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<T | null>(null);

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
            <p className="text-xs">Add Document</p>
          </Button>
        </section>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="bg-gray-50 border border-gray-200 w-full">
            <thead className=" bg-gray-50 border border-gray-200">
              <tr className="bg-gray-100 h-15 rounded-t-md text-left">
                <th className="w-[45%] font-light text-sm whitespace-nowrap pl-6">
                  Name
                </th>
                <th className="w-[20%] font-light text-sm whitespace-nowrap">
                  Modified
                </th>
                <th className="w-[20%] font-light text-sm whitespace-nowrap">
                  Uploaded by
                </th>
                <th className="w-[15%] font-light text-sm whitespace-nowrap">
                  Size
                </th>
                <th className="w-[10%] font-light text-sm whitespace-nowrap pr-6"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className=" h-16 text-center">
                    <p>No document found</p>
                  </td>
                </tr>
              )}
              {data.map((doc) => (
                <DocumentTableElement
                  key={doc.id}
                  doc={doc}
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

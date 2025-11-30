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
    <div>
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

      <div className="bg-white rounded-md border border-gray-300 py-4 px-4 mb-3">
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

        <Table stickyHeader stickyFooter noWrap>
          <thead>
            <tr>
              <th className="w-[50%]">Name</th>
              <th className="w-[15%]">Modified</th>
              <th className="w-[20%]">Uploaded by</th>
              <th className="w-[15%]">Size</th>
              <th className="w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
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
        </Table>
      </div>
    </div>
  );
}

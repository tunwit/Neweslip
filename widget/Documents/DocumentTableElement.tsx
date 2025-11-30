import { Icon } from "@iconify/react/dist/iconify.js";
import { MoreVert } from "@mui/icons-material";
import { Avatar, Dropdown, IconButton, ListItemDecorator, Menu, MenuButton, MenuItem } from "@mui/joy";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { getPresignedUrl } from "@/app/action/getPresignedUrl";
import getFileIcon from "@/lib/getFileIcon";
import { formatBytes } from "@/lib/unitConverter";
import { formatModifiedTime } from "@/utils/formmatter";

interface DocumentTableElementProps<T extends { id: number; key: string; fileName: string; size?: number; uploadedAt?: string | Date; createdAt?: string | Date; uploadedByInfo?: { fullName?: string; imageUrl?: string } }> {
  doc: T;
  setSelectedDoc: Dispatch<SetStateAction<T | null>>;
  setOpenRename: Dispatch<SetStateAction<boolean>>;
  onDelete: (doc: T) => void;
}

export default function DocumentTableElement<T extends { id: number; key: string; fileName: string; size?: number; uploadedAt?: string | Date; createdAt?: string | Date; uploadedByInfo?: { fullName?: string; imageUrl?: string } }>({
  doc,
  setSelectedDoc,
  setOpenRename,
  onDelete,
}: DocumentTableElementProps<T>) {

  const onCopy = async () => {
    const url = await getPresignedUrl(doc.key, 3600,false);
    navigator.clipboard.writeText(url);
  };

  return (
    <tr key={doc.id}>
      <td>
        <div className="flex items-center gap-2 fill-red-200">
          <img src={getFileIcon(doc.fileName)} alt="Icon" width={20} height={20} />
          <Link href="#" onClick={async () => window.open(await getPresignedUrl(doc.key, 3600,false), "_blank")} className="text-blue-600 underline">
            {doc.fileName}
          </Link>
        </div>
      </td>
      <td>{formatModifiedTime(new Date(doc.uploadedAt || doc.createdAt!))}</td>
      <td>
        <div className="flex flex-row items-center gap-2">
          <Avatar sx={{ width: 20, height: 20 }} src={doc.uploadedByInfo?.imageUrl} size="sm" />
          {doc.uploadedByInfo?.fullName}
        </div>
      </td>
      <td>{formatBytes(doc.size || 0)}</td>
      <td>
        <Dropdown>
          <MenuButton size="sm" slots={{ root: IconButton }} slotProps={{ root: { variant: "plain", color: "neutral" } }}>
            <MoreVert />
          </MenuButton>
          <Menu>
            <MenuItem onClick={() => { setSelectedDoc(doc); setOpenRename(true); }}>
              <ListItemDecorator>
                <Icon icon="icon-park-outline:edit" />
              </ListItemDecorator>
              rename
            </MenuItem>
            <MenuItem onClick={async () => window.open(await getPresignedUrl(doc.key, 3600, true))} download={doc.fileName} target="_blank">
              <ListItemDecorator>
                <Icon icon="material-symbols:download-rounded" />
              </ListItemDecorator>
              download
            </MenuItem>
            <MenuItem onClick={onCopy}>
              <ListItemDecorator>
                <Icon icon="solar:share-outline" />
              </ListItemDecorator>
              copy url
            </MenuItem>
            <MenuItem color="danger" onClick={() => onDelete(doc)}>
              <ListItemDecorator>
                <Icon icon="fluent:delete-24-regular" />
              </ListItemDecorator>
              delete
            </MenuItem>
          </Menu>
        </Dropdown>
      </td>
    </tr>
  );
}

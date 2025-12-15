import { Icon } from "@iconify/react/dist/iconify.js";
import { MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Dropdown,
  IconButton,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
} from "@mui/joy";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { getPresignedUrl } from "@/app/action/getPresignedUrl";
import getFileIcon from "@/lib/getFileIcon";
import { formatBytes } from "@/lib/unitConverter";
import { formatModifiedTime } from "@/utils/formmatter";
import { useTranslations } from "next-intl";

interface DocumentTableElementProps<
  T extends {
    id: number;
    key: string;
    fileName: string;
    size?: number;
    uploadedAt?: string | Date;
    createdAt?: string | Date;
    uploadedByInfo?: { fullName?: string; imageUrl?: string };
  },
> {
  doc: T;
  setSelectedDoc: Dispatch<SetStateAction<T | null>>;
  setOpenRename: Dispatch<SetStateAction<boolean>>;
  onDelete: (doc: T) => void;
}

export default function DocumentTableElement<
  T extends {
    id: number;
    key: string;
    fileName: string;
    size?: number;
    uploadedAt?: string | Date;
    createdAt?: string | Date;
    uploadedByInfo?: { fullName?: string; imageUrl?: string };
  },
>({
  doc,
  setSelectedDoc,
  setOpenRename,
  onDelete,
}: DocumentTableElementProps<T>) {
  const t = useTranslations("documents");
  const td = useTranslations("date_format");

  const onCopy = async () => {
    const url = await getPresignedUrl(doc.key, 3600, false);
    navigator.clipboard.writeText(url);
  };

  return (
    <tr
      key={doc.id}
      className="h-14 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <td className="pl-6">
        <div className="flex items-center gap-2 fill-red-200">
          <img
            src={getFileIcon(doc.fileName)}
            alt="Icon"
            width={20}
            height={20}
          />
          <Link
            href="#"
            onClick={async () =>
              window.open(await getPresignedUrl(doc.key, 3600, false), "_blank")
            }
            className="text-blue-600 underline"
          >
            {doc.fileName}
          </Link>
        </div>
      </td>
      <td>{formatModifiedTime(new Date(doc.uploadedAt || doc.createdAt!),td)}</td>
      <td>
        <div className="flex flex-row items-center gap-2">
          <Avatar
            sx={{ width: 20, height: 20 }}
            src={doc.uploadedByInfo?.imageUrl}
            size="sm"
          />
          {doc.uploadedByInfo?.fullName}
        </div>
      </td>
      <td>{formatBytes(doc.size || 0)}</td>
      <td className="pr-6">
        <Dropdown>
          <MenuButton
            size="sm"
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: "plain", color: "neutral" } }}
          >
            <MoreVert />
          </MenuButton>
          <Menu>
            <MenuItem
              onClick={() => {
                setSelectedDoc(doc);
                setOpenRename(true);
              }}
            >
              <ListItemDecorator>
                <Icon icon="icon-park-outline:edit" />
              </ListItemDecorator>
              {t("actions.rename")}
            </MenuItem>
            <MenuItem
              onClick={async () =>
                window.open(await getPresignedUrl(doc.key, 3600, true))
              }
              download={doc.fileName}
              target="_blank"
            >
              <ListItemDecorator>
                <Icon icon="material-symbols:download-rounded" />
              </ListItemDecorator>
              {t("actions.download")}
            </MenuItem>
            <MenuItem onClick={onCopy}>
              <ListItemDecorator>
                <Icon icon="solar:share-outline" />
              </ListItemDecorator>
              {t("actions.copy_url")}
            </MenuItem>
            <MenuItem color="danger" onClick={() => onDelete(doc)}>
              <ListItemDecorator>
                <Icon icon="fluent:delete-24-regular" />
              </ListItemDecorator>
              {t("actions.delete")}
            </MenuItem>
          </Menu>
        </Dropdown>
      </td>
    </tr>
  );
}

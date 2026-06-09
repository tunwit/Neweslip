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
import { Dispatch, SetStateAction } from "react";
import getFileIcon from "@/lib/getFileIcon";
import { formatBytes } from "@/lib/unitConverter";
import { formatModifiedTime } from "@/utils/formmatter";
import { useTranslations } from "next-intl";
import { DocumentPublicDTO } from "@/types/type.document";
import { Link } from "@/i18n/navigation";

interface DocumentTableElementProps<T extends DocumentPublicDTO> {
  doc: T;
  setSelectedDoc: Dispatch<SetStateAction<T | null>>;
  setOpenRename: Dispatch<SetStateAction<boolean>>;
  onClickUrl: (doc: T) => void;
  onCopy: (doc: T) => void;
  onDelete: (doc: T) => void;
}

export default function DocumentTableElement<T extends DocumentPublicDTO>({
  doc,
  setSelectedDoc,
  setOpenRename,
  onClickUrl,
  onCopy,
  onDelete,
}: DocumentTableElementProps<T>) {
  const t = useTranslations("documents");
  const td = useTranslations("date_format");

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
            onClick={() => {
              onClickUrl(doc);
            }}
            className="text-blue-600 underline text-sm"
          >
            {doc.fileName}
          </Link>
        </div>
      </td>
      <td>
        {formatModifiedTime(new Date(doc.editedAt || doc.createdAt!), td)}
      </td>
      <td>
        <div className="flex flex-row items-center gap-2">
          <Avatar
            sx={{ width: 20, height: 20 }}
            src={doc.uploadedBy?.imageUrl}
            size="sm"
          />
          {doc.uploadedBy?.fullName}
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
              onClick={() => {
                onClickUrl(doc);
              }}
              download={doc.fileName}
              target="_blank"
            >
              <ListItemDecorator>
                <Icon icon="material-symbols:download-rounded" />
              </ListItemDecorator>
              {t("actions.download")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                onCopy(doc);
              }}
            >
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

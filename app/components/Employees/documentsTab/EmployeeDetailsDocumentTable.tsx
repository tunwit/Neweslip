"use client";
import {
  EmployeeDocument,
  EmployeeDocumentWithUploader,
} from "@/types/employeeDocument";
import { dateFormat } from "@/utils/formmatter";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Edit, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dropdown,
  IconButton,
  Input,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Table,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Link from "next/link";
import UploadDocumentModal from "./UploadDocumentModal";
import RenameModal from "./RenameModal";

interface EmployeeDetailsDocumentTableProps {
  title: string;
  tag: string;
  data: EmployeeDocumentWithUploader[];
  employeeId: number;
}
export default function EmployeeDetailsDocumentTable({
  title,
  tag,
  data,
  employeeId,
}: EmployeeDetailsDocumentTableProps) {
  const [open, setOpen] = useState(false);
  const [openRename, setOpenRename] = useState(false);
  const [selectedDoc, setSelectedDoc] =
    useState<EmployeeDocumentWithUploader>();

  const onCopy = (key: string) => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
    );
  };
  return (
    <div>
      <RenameModal
        docId={selectedDoc?.id || -1}
        docKey={selectedDoc?.key || ""}
        oldName={selectedDoc?.fileName || ""}
        open={openRename}
        setOpen={setOpenRename}
      />
      <UploadDocumentModal
        open={open}
        setOpen={setOpen}
        tag={tag}
        employeeId={employeeId}
      />
      <div className="bg-white rounded-md border border-gray-300 py-4 px-4 mb-3">
        <p className="font-semibold mb-2">{title}</p>
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
        <Table stickyHeader stickyFooter noWrap>
          <thead>
            <tr>
              <th className="w-[50%]">Name</th>
              <th className="w-[20%]">Modified</th>
              <th className="w-[20%]">Uploaded by</th>
              <th className="w-[10%]">Size</th>
              <th className="w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((doc) => {
              return (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-2 fill-red-200">
                      <img
                        src="/fileIcons/pdf.svg"
                        alt="My Icon"
                        width={20}
                        height={20}
                      />
                      <Link
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${doc.key}`}
                        className="text-blue-600 underline"
                      >
                        {doc.fileName}
                      </Link>
                    </div>
                  </td>
                  <td>
                    {dateFormat(new Date(doc.uploadedAt || doc.createdAt!))}
                  </td>
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
                  <td>{doc.size}</td>
                  <td>
                    <Dropdown>
                      <MenuButton
                        size="sm"
                        slots={{ root: IconButton }}
                        slotProps={{
                          root: { variant: "plain", color: "neutral" },
                        }}
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
                          rename
                        </MenuItem>
                        <MenuItem
                          target="_blank"
                          component={"a"}
                          href={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${doc.key}`}
                          download
                        >
                          <ListItemDecorator>
                            <Icon icon="material-symbols:download-rounded" />
                          </ListItemDecorator>
                          download
                        </MenuItem>
                        <MenuItem onClick={() => onCopy(doc.key)}>
                          <ListItemDecorator>
                            <Icon icon="solar:share-outline" />
                          </ListItemDecorator>
                          copy url
                        </MenuItem>
                        <MenuItem color="danger">
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
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

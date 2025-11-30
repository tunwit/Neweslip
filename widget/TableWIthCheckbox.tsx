"use client";

import { Checkbox, Table } from "@mui/joy";
import { Icon } from "@iconify/react";
import React, { Dispatch, SetStateAction } from "react";
import { useCheckBox, UseCheckBoxResult } from "@/hooks/useCheckBox";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode; // custom render for a column
  width?: string;
}

interface GenericTableProps
<
  T extends { id: string | number },
  ID extends string | number = T["id"]
> {
  data: T[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  checkboxMethods: UseCheckBoxResult<ID>;
  columns: Column<T>[];
  editColumn?:boolean
  setSelectedItem?: Dispatch<SetStateAction<T | null>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TableWithCheckBox<T extends { id: number | string }>({
  data,
  isLoading,
  isSuccess,
  checkboxMethods,
  columns,
  editColumn = true,
  setSelectedItem,
  setOpen,
}: GenericTableProps<T>) {
  const { toggle, isChecked, checkall, uncheckall, isAllChecked, isSomeChecked } = checkboxMethods

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    if (e.currentTarget.checked) {
      checkall(data.map((v) => v.id));
    } else {
      uncheckall();
    }
  };

  return (
    <div className="border border-[#d8d8d8] w-auto rounded-md px-1 max-h-[calc(100vh-350px)] overflow-auto">
      <Table stickyHeader hoverRow variant="plain">
        <thead>
          <tr>
            <th className="w-[6%]">
              <Checkbox
                checked={isAllChecked(data?.length ?? 0)}
                indeterminate={isSomeChecked(data?.length ?? 0)}
                onChange={handleAllCheckbox}
              />
            </th>
            {columns.map((col) => (
              <th key={col.key.toString()} className={`font-medium ${col.width ?? ""}`}  style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
            {editColumn && <th className="font-medium w-[5%]"></th>}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr className="text-center">
              <td colSpan={columns.length + 2}>Loading...</td>
            </tr>
          )}

          {isSuccess && !data?.length && (
            <tr className="text-center">
              <td colSpan={columns.length + 2}>No Data</td>
            </tr>
          )}

          {isSuccess &&
            data?.map((row) => (
              <tr key={row.id}>
                <td>
                  <Checkbox
                    checked={isChecked(row.id)}
                    onChange={() => toggle(row.id)}
                  />
                </td>

                {columns.map((col) => (
                  <td key={col.key.toString()}>
                    {col.render ? col.render(row) : (row[col.key as keyof T] as any)}
                  </td>
                ))}

                {editColumn && setSelectedItem && <td
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedItem(row);
                    setOpen(true);
                  }}
                >
                  <Icon icon="ic:baseline-edit" className="text-xl" />
                </td>}
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

"use client";

import { Checkbox, Table } from "@mui/joy";
import { Icon } from "@iconify/react";
import React, { Dispatch, SetStateAction } from "react";
import { useCheckBox, UseCheckBoxResult } from "@/hooks/useCheckBox";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode; // custom render for a column
  width?: string;
}

interface GenericTableProps<
  T extends { id: string | number },
  ID extends string | number = T["id"],
> {
  data: T[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  checkboxMethods: UseCheckBoxResult<ID>;
  columns: Column<T>[];
  editColumn?: boolean;
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
  const {
    toggle,
    isChecked,
    checkall,
    uncheckall,
    isAllChecked,
    isSomeChecked,
  } = checkboxMethods;

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    if (e.currentTarget.checked) {
      checkall(data.map((v) => v.id));
    } else {
      uncheckall();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full">
          <thead className=" bg-gray-50 border border-gray-200">
            <tr className="bg-gray-100 h-15 rounded-t-md text-left ">
              <th className="font-light text-sm pl-6 w-[4%] whitespace-nowrap min-w-15">
                <Checkbox
                  checked={isAllChecked(data?.length ?? 0)}
                  indeterminate={isSomeChecked(data?.length ?? 0)}
                  onChange={(e) => handleAllCheckbox(e)}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key.toString()}
                  className={`font-light text-sm whitespace-nowrap ${col.width ?? ""}`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              {editColumn && <th className="font-medium w-[5%]"></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr className="h-20 hover:bg-gray-50 transition-colors cursor-pointer ">
                <td
                  colSpan={columns.length + (editColumn ? 2 : 1)}
                  className="text-center"
                >
                  <span className="flex items-center gap-2 w-full justify-center">
                    <Icon
                      icon={"mynaui:spinner"}
                      className="animate-spin"
                      fontSize={25}
                    />
                    <p>Loading...</p>
                  </span>
                </td>
              </tr>
            )}

            {isSuccess && !data?.length && (
              <tr className="h-20 hover:bg-gray-50 transition-colors cursor-pointer">
                <td colSpan={columns.length + (editColumn ? 2 : 1)} className="text-center">No Data</td>
              </tr>
            )}

            {isSuccess &&
              data?.map((row, i) => (
                <tr
                  key={row.id}
                  className="h-15 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="pl-6">
                    <Checkbox
                      checked={isChecked(row.id)}
                      onChange={() => toggle(row.id)}
                    />
                  </td>

                  {columns.map((col) => (
                    <td key={col.key.toString()}>
                      {col.render
                        ? col.render(row, i)
                        : (row[col.key as keyof T] as any)}
                    </td>
                  ))}

                  {editColumn && setSelectedItem && (
                    <td
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedItem(row);
                        setOpen(true);
                      }}
                    >
                      <Icon icon="ic:baseline-edit" className="text-xl" />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

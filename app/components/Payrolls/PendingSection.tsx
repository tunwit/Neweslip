"use client";
import { Button, Checkbox } from "@mui/joy";
import React, { useState } from "react";
import PendingElement from "./PendingElement";
import dayjs from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePayrollPeriods } from "@/hooks/usePayrollPeriods";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useCheckBox } from "@/hooks/useCheckBox";

export default function PendingSection() {
  const {id} = useCurrentShop();
  const {isAllChecked, isSomeChecked,checkall,uncheckall} = useCheckBox("payrollPeriods")
  if(!id) return;

  const {data,isLoading} = usePayrollPeriods(id);

    const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!data?.data) return;
      if (e.currentTarget.checked) {
        checkall(data.data.map((v) => v.id));
      } else {
        uncheckall();
      }
    };

  return (
    <div className="flex flex-col h-full">
      {!isLoading ? (
        <>
          <div className="pl-5 mt-2">
            <Checkbox
              label="All"
              checked={isAllChecked(data?.data?.length || 0)}
              indeterminate={isSomeChecked(data?.data?.length || 0)}
              onChange={handleAllCheckbox}
            />
          </div>

          <div className="flex-1 overflow-y-scroll my-2">
            <div className="flex flex-col gap-2 max-h-[calc(100vh-352px)] min-h-40">
              {data?.data?.map((pen, i) => (
                <PendingElement
                  key={i}
                  id={pen.id}
                  title={`${pen.name} ${i}`}
                  people={1}
                  amount={1}
                  modifyAt={dayjs(pen.updatedAt)}
                  status={pen.status}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="opacity-60 my-2">No Pending is active</p>
      )}

      {data?.data?.length !== 0 && (
        // <Button disabled={!checkboxs.some((v) => v === true)} color="danger" sx={{fontSize:"13px","--Button-gap": "5px",padding:1.2}}>Delete</Button>
      <div>
        <Button disabled color="danger" sx={{fontSize:"13px","--Button-gap": "5px",padding:1.2}}>Delete</Button>
      </div>
      )}
    </div>
  );
}

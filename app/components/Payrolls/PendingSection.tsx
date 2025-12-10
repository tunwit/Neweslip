"use client";
import { Button, Checkbox } from "@mui/joy";
import React, { useState } from "react";
import PendingElement from "./PendingElement";
import dayjs from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePayrollPeriods } from "@/hooks/usePayrollPeriods";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useCheckBox } from "@/hooks/useCheckBox";
import { deletePayrollPeriod } from "@/app/action/deletePayrollPeriod";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

export default function PendingSection() {
  const { id: shopId } = useCurrentShop();
  const { checked, isAllChecked, isSomeChecked, checkall, uncheckall } =
    useCheckBox<number>("payrollPeriods");
  const queryClient = useQueryClient();
  const { user } = useUser();

  if (!shopId) return;

  const { data, isLoading } = usePayrollPeriods(shopId);

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data?.data) return;
    if (e.currentTarget.checked) {
      checkall(data.data.map((v) => v.id));
    } else {
      uncheckall();
    }
  };

  const handleDelete = async () => {
    try {
      if (!shopId || !user?.id) return;
      await deletePayrollPeriod(checked, shopId, user?.id);
      showSuccess("Delete period success");
      queryClient.invalidateQueries({ queryKey: ["payrollPeriods"] });
    } catch (err) {
      showError(`Delete period failed\n${err}`);
    } finally {
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
            <div className="flex flex-col gap-2 max-h-[calc(100vh-352px)]">
              {data?.data?.map((pen, i) => {
                return (
                  <PendingElement
                    key={i}
                    id={pen.id}
                    title={`${pen.name}`}
                    people={pen.employeeCount}
                    amount={pen.totalNet}
                    modifyAt={dayjs(pen.updatedAt)}
                    status={pen.status}
                  />
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <p className="opacity-60 my-2">No Pending is active</p>
      )}

      {data?.data?.length !== 0 && (
        // <Button disabled={!checkboxs.some((v) => v === true)} color="danger" sx={{fontSize:"13px","--Button-gap": "5px",padding:1.2}}>Delete</Button>
        <div>
          <Button
            onClick={handleDelete}
            disabled={checked ? checked.length === 0 : true}
            color="danger"
            sx={{ fontSize: "13px", "--Button-gap": "5px", padding: 1.2 }}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

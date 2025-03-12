"use client";
import { Button, Checkbox } from "@mui/joy";
import React, { useState } from "react";
import PendingElement from "./PendingElement";
import dayjs from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";

const test = [
  {
    title: "Payroll - 01",
    people: 50,
    amount: 15425,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },

  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
  {
    title: "Payroll - 02",
    people: 49,
    amount: 6451,
    status: 2,
  },
];

export default function PendingSection() {
  const [checkboxs, setCheckboxs] = useState<boolean[]>(
    Array(test.length).fill(false),
  );

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxs(checkboxs.map(() => e.currentTarget.checked));
  };

  return (
    <div className="flex flex-col h-full">
      {test.length !== 0 ? (
        <>
          <div className="pl-5 mt-2">
            <Checkbox
              label="All"
              checked={checkboxs.every((v) => v === true)}
              indeterminate={
                !checkboxs.every((checkbox) => checkbox === checkboxs[0])
              }
              onChange={(e) => handleAllCheckbox(e)}
            />
          </div>

          <div className="flex-1 overflow-y-scroll my-2">
            <div className="flex flex-col gap-2 max-h-[calc(100vh-352px)] min-h-40">
              {test.map((pen, i) => (
                <PendingElement
                  key={i}
                  id={i}
                  title={`${pen.title} ${i}`}
                  people={pen.people}
                  amount={pen.amount}
                  modifyAt={dayjs()}
                  status={pen.status}
                  checkboxs={checkboxs}
                  setCheckboxs={setCheckboxs}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="opacity-60 my-2">No Pending is active</p>
      )}

      {test.length !== 0 && (
        // <Button disabled={!checkboxs.some((v) => v === true)} color="danger" sx={{fontSize:"13px","--Button-gap": "5px",padding:1.2}}>Delete</Button>
      <div>
        <Button disabled={!checkboxs.some((v) => v === true)} color="danger" sx={{fontSize:"13px","--Button-gap": "5px",padding:1.2}}>Delete</Button>
      </div>
      )}
    </div>
  );
}

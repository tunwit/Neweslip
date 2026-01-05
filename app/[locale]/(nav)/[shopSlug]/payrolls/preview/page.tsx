"use client";
import { usePreview } from "@/hooks/payroll/record/usePreview";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function page() {
  const jobId = useSearchParams().get("jid");

  const { data } = usePreview(jobId);

  return (
    <>
      {data?.data === null ? (
        <div className="bg-white w-screen h-screen flex items-center justify-center">
          <p>Preview Not found</p>
        </div>
      ) : (
        <iframe className="w-screen" srcDoc={data?.data}></iframe>
      )}
    </>
  );
}

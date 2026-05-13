"use client";
import { useEntrySlip } from "@/hooks/payroll/entry/hook.entry";
import { useSearchParams } from "next/navigation";

export default function page() {
  const periodId = useSearchParams().get("pid");
  const eid = useSearchParams().get("eid");

  const { data } = useEntrySlip(Number(periodId)).preview(Number(eid));

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

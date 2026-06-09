"use client";
import { usePreviewSlip } from "@/hooks/payroll/entry/hook.entry";
import { useParams } from "next/navigation";

export default function PreviewPage() {
  const { periodId, entryId } = useParams();

  const { data } = usePreviewSlip(Number(periodId), Number(entryId));
  console.log(data?.success);

  return (
    <>
      <title>Preview</title>
      {data?.data === null ? (
        <div className="bg-white w-screen h-screen flex items-center justify-center text-black">
          <p>Preview Not found</p>
        </div>
      ) : (
        <iframe className="w-screen" srcDoc={data?.data}></iframe>
      )}
    </>
  );
}

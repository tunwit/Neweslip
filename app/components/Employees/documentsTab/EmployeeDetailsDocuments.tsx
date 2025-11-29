import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Table } from "@mui/joy";
import React from "react";
import EmployeeDetailsDocumentTable from "./EmployeeDetailsDocumentTable";
import { useEmployeeDocuments } from "@/hooks/useEmployeeDocuments";
interface EmployeeDetailsDocumentsProps {
  title: string;
  tag: string;
}
export default function EmployeeDetailsDocuments({
  title,
  tag,
}: EmployeeDetailsDocumentsProps) {
  const employeeId = 1
  const { data } = useEmployeeDocuments({employeeId:employeeId})
  const personalDocs = data?.data?.filter((doc) => doc.tag === "personal");
  const contractDocs = data?.data?.filter((doc) => doc.tag === "contract");
  const otherDocs = data?.data?.filter((doc) => doc.tag !== "personal" && doc.tag !== "contract");
  
  return (
    <>
      <div className="flex flex-col gap-4">
        <EmployeeDetailsDocumentTable
          title="Personal Document"
          tag="personal"
          data={personalDocs || []}
          employeeId={employeeId}
        />
        <EmployeeDetailsDocumentTable
          title="Contract Document"
          tag="contract"
          data={contractDocs || []}
          employeeId={employeeId}
        />
        <EmployeeDetailsDocumentTable 
          title="Others Document" 
          tag="Others"
          data={otherDocs || []} 
          employeeId={employeeId}/>
          
      </div>
    </>
  );
}

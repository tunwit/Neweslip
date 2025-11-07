"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon, loadIcon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import EmployeesTable from "@/app/components/Employees/EmployeesTable";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import SnackBar from "@/app/components/UI/SnackBar";
import { Suspense, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Pagination from "@/app/components/UI/Pagination";
import { useQueryClient } from "@tanstack/react-query";
import BranchSelector from "@/widget/BranchSelector";
import StatusSelector from "@/widget/StatusSelector";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";

export default function Home() {
  const rounter = useRouter();
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [branchId, setBranchId] = useState(-1);
  const [status, setStatus] = useState<EMPLOYEE_STATUS|null>(null);

  const [limit, setLimit] = useState(15);
  const [totalPage, setTotalPage] = useState(1);

  const onPagechange = (p: number) => {
    setPage(p);
  };
  return (
    <main className="min-h-screen w-full bg-white font-medium">
      <div className="mx-10">
        <div className="flex flex-row text-[#424242] text-xs mt-10">
          <p>
            Haris {">"} Dashboard {">"}&nbsp;
          </p>
          <p className="text-blue-800">Employees</p>
        </div>
        <div className=" mt-5 flex flex-row justify-between">
          <p className="text-black text-4xl font-bold">Employees</p>
          <Button
            onClick={() => rounter.push("employees/new")}
            startDecorator={<Add sx={{ fontSize: "20px" }} />}
            sx={{
              fontSize: "13px",
              "--Button-gap": "5px",
              padding: 1.2,
            }}
          >
            New Employee
          </Button>
        </div>

        <div className="mt-8 flex flex-row gap-2">
          <div className="w-[60%]">
            <p className="text-black text-xs mb-1">Search Employee</p>
            <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
              <Icon
                className="text-[#424242]"
                icon={"material-symbols:search-rounded"}
              />
              <input
                type="text"
                placeholder="Search"
                className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[20%]">
            <p className="text-black text-xs mb-1">Status</p>
            <StatusSelector isEnableAll={true} status={status} onChange={(value) => setStatus(value!)}/>
          </div>

          <div className="w-[20%]">
            <p className="text-black text-xs mb-1">Brach</p>
            {/* <Select
              defaultValue="All"
              sx={{ borderRadius: "4px", fontSize: "14px" }}
            >
              <Option value="All">All</Option>
              <Option value="Pakkret">Pakkret</Option>
              <Option value="Ramintra">Ramintra</Option>
              <Option value="Kallapapruk">Kallapapruk</Option>
            </Select> */}
            <BranchSelector
              branchId={branchId}
              onChange={(n) => {
                setBranchId(n);
              }}
              isEnableAll={true}
            />
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <div className="w-full border border-[#d4d4d4] rounded-sm max-h-[calc(100vh-400px)] overflow-x-auto overflow-y-auto shadow-sm">
            <EmployeesTable
              search_query={debounced}
              branchId={branchId}
              status={status}
              page={page}
              setPage={setPage}
              setTotalPage={setTotalPage}
            />
          </div>
        </div>
        <Pagination
          page={page}
          totalPages={totalPage}
          onPageChange={(p) => onPagechange(p)}
        ></Pagination>
      </div>
      <SnackBar />
    </main>
  );
}

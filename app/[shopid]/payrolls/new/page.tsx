"use client";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Add } from "@mui/icons-material";
import PayrollsEmployeesTable from "@/app/components/Payrolls/new/PayrollsEmployeeTable";
import { useState } from "react";
import PayrollsAddEmployeeModal from "@/app/components/Payrolls/new/AddModal/PayrollsAddEmployeeModal";
import { Employee } from "@/types/employee";

export default function Home() {
  const [checkboxs, setCheckboxs] = useState<boolean[]>(Array(15).fill(false));
  const [open, setOpen] = useState(false);
  const [employees, setEmployee] = useState<Employee[]>([]);
  const [selectedEm, setSelectedEm] = useState<Employee[]>([]);

  const handlerDelete = () => {
    setEmployee((prevEmployees) =>
      prevEmployees.filter(
        (emp) => !selectedEm.some((selected) => selected.id === emp.id),
      ),
    );
  };

  return (
    <main className="min-h-screen w-full bg-white font-medium">
      <PayrollsAddEmployeeModal
        open={open}
        setOpen={setOpen}
        employees={employees}
        setEmployee={setEmployee}
      />
      <div className="mx-10 flex flex-col min-h-screen ">
        <div className="flex flex-row text-[#424242] text-xs mt-10">
          <p>
            {" "}
            Haris {">"} Dashboard {">"} Payrolls {">"}&nbsp;
          </p>
          <p className="text-blue-800">New Payrolls</p>
        </div>
        <div className="mt-5 flex flex-row justify-between">
          <p className="text-black text-4xl font-bold">Payroll - 015</p>
          <Button
            onClick={() => setOpen(true)}
            startDecorator={<Add sx={{ fontSize: "20px" }} />}
            sx={{ fontSize: "13px", "--Button-gap": "5px", padding: 1.2 }}
          >
            Add Employee
          </Button>
        </div>

        <div className="mt-8 flex flex-row gap-2">
          <div className="w-[60%]">
            <p className="text-black text-xs mb-1">Search Payrolls</p>
            <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
              <Icon
                className="text-[#424242]"
                icon={"material-symbols:search-rounded"}
              />
              <input
                type="text"
                placeholder="Search"
                className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
              />
            </div>
          </div>

          <div className="w-[20%]">
            <p className="text-black text-xs mb-1">Status</p>
            <Select
              defaultValue="All"
              sx={{ borderRadius: "4px", fontSize: "14px" }}
            >
              <Option value="All">All</Option>
              <Option value="Active">Active</Option>
              <Option value="Part time">Part time</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </div>

          <div className="w-[20%]">
            <p className="text-black text-xs mb-1">Brach</p>
            <Select
              defaultValue="All"
              sx={{ borderRadius: "4px", fontSize: "14px" }}
            >
              <Option value="All">All</Option>
              <Option value="Pakkret">Pakkret</Option>
              <Option value="Ramintra">Ramintra</Option>
              <Option value="Kallapapruk">Kallapapruk</Option>
            </Select>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <div className="w-full border border-[#d4d4d4] rounded-sm max-h-[calc(100vh-300px)] overflow-x-auto overflow-y-auto shadow-sm">
            <PayrollsEmployeesTable
              checkboxs={checkboxs}
              setCheckboxs={setCheckboxs}
              employees={employees}
              setSelectedEm={setSelectedEm}
            />
          </div>
        </div>

        <div className="mt-2 flex justify-between">
          <Button
            onClick={() => handlerDelete()}
            disabled={!checkboxs.some((v) => v === true)}
            color="danger"
            sx={{ fontSize: "13px", "--Button-gap": "5px", padding: 1.2 }}
          >
            Delete
          </Button>

          <Button
            color="primary"
            sx={{ fontSize: "13px", "--Button-gap": "5px", padding: 1.2 }}
          >
            Save draft
          </Button>
        </div>
      </div>
    </main>
  );
}

"use client";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Add } from "@mui/icons-material";
import { useMemo, useState } from "react";
import PayrollsAddEmployeeModal from "@/app/components/Payrolls/new/AddModal/PayrollsAddEmployeeModal";
import { useSelectedEmployees } from "@/app/components/Payrolls/new/hooks/useSelectedEmployee";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
import { usePayrollRecords } from "@/hooks/usePayrollRecords";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCheckBox } from "@/hooks/useCheckBox";
import { getRandomPastelColor } from "@/utils/generatePastelColor";
import BranchSelector from "@/widget/BranchSelector";
import PayrollEditEmployeeModal from "@/app/components/Payrolls/new/EditModal/PayrollEditEmployeeModal";
import { Employee } from "@/types/employee";
import { PayrollRecord } from "@/types/payrollRecord";
import { deletePayrollRecords } from "@/app/action/deletePayrollRecord";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { useRecordDetails } from "@/hooks/useRecordDetails";
import { usePayrollPeriodStats } from "@/hooks/usePayrollPeriodStat";
import { useUser } from "@clerk/nextjs";
import { moneyFormat } from "@/utils/formmatter";
import { usePayrollPeriod } from "@/hooks/usePayrollPeriod";

export default function Home() {
  // const { checkboxs, checkedItem, uncheckall } = usePayrollSelectKit();
  const methods = useCheckBox<number>("payrollRecordTable");
  const { checked, isSomeChecked } = methods;
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [query, setQuery] = useState("");
  const [branchId, setBranchId] = useState(-1);
  const router = useRouter();
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(
    null,
  );
  const periodId = useSearchParams().get("id");

  const { data: periodData } = usePayrollPeriod(Number(periodId));

  const { data, isLoading, isSuccess } = usePayrollRecords(Number(periodId));
  const queryClient = useQueryClient();
  const { user } = useUser();

  const avatarColors = useMemo(() => {
    return data?.data?.map(() => getRandomPastelColor()) || [];
  }, [data]);

  const deleteHandler = async () => {
    if (!user?.id) return;
    try {
      await deletePayrollRecords(checked, Number(periodId), user?.id);
      queryClient.invalidateQueries({ queryKey: ["payrollRecord"] });
      showSuccess(`Delete employee success`);
    } catch (err: any) {
      showError(`Delete employee failed \n ${err}`);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white font-medium">
      <PayrollsAddEmployeeModal
        open={openAdd}
        setOpen={setOpenAdd}
        periodId={Number(periodId)}
      />
      {openEdit && (
        <PayrollEditEmployeeModal
          periodData={periodData?.data}
          selectedRecord={selectedRecord}
          open={openEdit}
          setOpen={setOpenEdit}
        />
      )}
      <title>{periodData?.data?.name}</title>
      <div className="mx-10 flex flex-col min-h-screen ">
        <div className="flex flex-row text-[#424242] text-xs mt-10">
          <p>
            {" "}
            Haris {">"} Dashboard {">"} Payrolls {">"}&nbsp;
          </p>
          <p className="text-blue-800">New Payrolls</p>
        </div>
        <div className="mt-5 flex flex-row justify-between">
          <p className="text-black text-4xl font-bold">
            {periodData?.data?.name}
          </p>
          <Button
            onClick={() => setOpenAdd(true)}
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
                onChange={(e) => setQuery(e.target.value)}
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
            <BranchSelector
              branchId={branchId}
              onChange={setBranchId}
              isEnableAll={true}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center ">
          <div className="flex flex-row-reverse">
            <Button
              disabled={checked ? checked.length === 0 : true}
              variant="plain"
              onClick={deleteHandler}
            >
              <p className="underline font-medium">delete</p>
            </Button>
          </div>
          <div className="w-full border border-[#d4d4d4] rounded-sm max-h-[calc(100vh-300px)] overflow-x-auto overflow-y-auto shadow-sm">
            <TableWithCheckBox
              data={data?.data}
              isLoading={isLoading}
              isSuccess={isSuccess}
              checkboxMethods={methods}
              setSelectedItem={(v) => setSelectedRecord(v)}
              setOpen={setOpenEdit}
              columns={[
                {
                  key: "avatar",
                  label: "",
                  width: "6%",
                  render: (row, i) => (
                    <div
                      className="w-9 aspect-square min-w-8 text-center rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: avatarColors[i],
                      }}
                    >
                      {row.employee.firstName.charAt(0)}
                    </div>
                  ),
                },
                {
                  key: "name",
                  label: "Name",
                  render: (row) =>
                    `${row.employee.firstName} ${row.employee.lastName}`,
                },
                {
                  key: "nickName",
                  label: "Nick Name",
                  render: (row) => `${row.employee.nickName}`,
                },
                {
                  key: "branch",
                  label: "Branch",
                  render: (row) => `${row.employee.branch}`,
                },
                {
                  key: "total",
                  label: "Total",
                  render: (row) => `${moneyFormat(row.net)}`,
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-2 flex justify-between">
          <Button
            color="primary"
            sx={{ fontSize: "13px", "--Button-gap": "5px", padding: 1.2 }}
          >
            Finalize
          </Button>
        </div>
      </div>
    </main>
  );
}

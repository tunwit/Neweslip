"use client";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Add } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import PayrollsAddEmployeeModal from "@/app/components/Payrolls/new/AddModal/PayrollsAddEmployeeModal";
import { usePayrollRecords } from "@/hooks/usePayrollRecords";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
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
import { useUser } from "@clerk/nextjs";
import { moneyFormat } from "@/utils/formmatter";
import { usePayrollPeriod } from "@/hooks/usePayrollPeriod";
import UsersIcon from "@/assets/icons/UsersIcon";
import PeriodEmployeeTable from "@/app/components/Payrolls/new/PeriodEmployeeTable";
import { useDebounce } from "use-debounce";
import { Modal, ModalDialog } from "@mui/joy";
import { PAY_PERIOD_STATUS_LABELS } from "@/types/enum/enumLabel";

export default function Home() {
  const methods = useCheckBox<number>("payrollRecordTable");
  const { checked } = methods;
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [query, setQuery] = useState("");
  const [debouced] = useDebounce(query, 500);
  const [branchId, setBranchId] = useState(-1);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(
    null,
  );
  const periodId = useSearchParams().get("id");

  const { data: periodData, isLoading: loadingPeriod } = usePayrollPeriod(
    Number(periodId),
  );

  const { data, isLoading: loadingRecord } = usePayrollRecords(
    Number(periodId),
  );

  const queryClient = useQueryClient();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

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

  const summaryHandler = () => {
    const newPath = pathname.replace("/edit", "/summary");
    router.push(`${newPath}?id=${periodId}`);
  };

  const isLoading = loadingPeriod || loadingRecord;

  let loadingMessage = "";
  if (loadingRecord) loadingMessage = "Getting Records...";
  else if (loadingPeriod) loadingMessage = "Loading Period...";

  return (
    <main className="w-full bg-gray-100 font-medium ">
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
      <Modal open={isLoading}>
        <ModalDialog>
          <div className="flex flex-col items-center justify-center">
            <Icon
              icon={"mynaui:spinner"}
              className="animate-spin"
              fontSize={50}
            />

            <p> {loadingMessage}</p>
          </div>
        </ModalDialog>
      </Modal>
      <title>{periodData?.data?.name}</title>
      <div className="flex flex-col h-full">
        <section className="px-10 pb-5 bg-white w-full border-b border-gray-200 sticky top-0">
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
            <div className="flex gap-3">
              <Button
                startDecorator={
                  <Icon icon="fluent:list-bar-24-regular" fontSize={20} />
                }
                color="neutral"
                variant="outlined"
                onClick={summaryHandler}
              >
                Summary
              </Button>
              
            </div>
          </div>

          <section className="grid grid-cols-4 gap-4 mt-5">
            <div className="bg-blue-50 from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Status</p>
                  <p className="text-xl font-bold text-blue-900 mt-1">
                    {PAY_PERIOD_STATUS_LABELS[periodData?.data?.status!] }
                  </p>
                </div>
                <div className="bg-blue-200 p-2 rounded-lg">
                  <Icon
                    icon={"mdi:clock-outline"}
                    className="text-blue-700"
                    fontSize={20}
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">
                    Employee
                  </p>
                  <p className="text-xl font-bold text-purple-900 mt-1">
                    {periodData?.data?.employeeCount}
                  </p>
                </div>
                <div className="bg-purple-200 p-2 rounded-lg">
                  <UsersIcon className="text-purple-700 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">
                    Total Amount
                  </p>
                  <p className="text-xl font-bold text-green-900 mt-1">
                    {moneyFormat(periodData?.data?.totalNet || 0)}
                  </p>
                </div>
                <div className="bg-green-200 p-2 rounded-lg">
                  <Icon
                    icon="tabler:currency-baht"
                    className="text-green-700 text-xl"
                    fontSize={20}
                  />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-medium">Period</p>
                  <p className="text-xl font-bold text-orange-900 mt-1">
                    {new Date(periodData?.data?.start_date!).toDateString()}
                  </p>
                </div>
                <div className="bg-orange-200 p-2 rounded-lg">
                  <Icon
                    icon="solar:calendar-outline"
                    className="text-orange-700 text-xl"
                    fontSize={20}
                  />
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className="px-10 overflow-y-auto flex-1">
          <div className="mt-8 flex flex-row justify-between bg-white p-4 rounded-md shadow">
            <div className="flex flex-row gap-3">
              <div className="w-96 ">
                <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
                  <Icon
                    className="text-[#424242]"
                    icon={"material-symbols:search-rounded"}
                  />
                  <input
                    type="text"
                    placeholder="Search name, branch"
                    className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="h-5">
              <Button
                onClick={() => setOpenAdd(true)}
                startDecorator={<Add sx={{ fontSize: "20px" }} />}
                sx={{ fontSize: "13px", "--Button-gap": "5px" }}
              >
                Add Employee
              </Button>
            </div>
          </div>
          <div className="flex flex-col justify-center pb-10">
            <div className="flex flex-row-reverse">
              <Button
                disabled={checked ? checked.length === 0 : true}
                variant="plain"
                onClick={deleteHandler}
              >
                <p className="underline font-medium">delete</p>
              </Button>
            </div>

            <PeriodEmployeeTable
              searchQuery={debouced}
              checkBoxMethod={methods}
              periodData={periodData?.data}
              records={data?.data || []}
              setSelected={setSelectedRecord}
              setOpenEdit={setOpenEdit}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

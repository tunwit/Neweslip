import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Tab,
  tabClasses,
  Table,
  TabList,
  TabPanel,
  Tabs,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { PayrollRecord } from "@/types/payrollRecord";
import { useRecordDetails } from "@/hooks/useRecordDetails";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import PayrollTable from "./PayrollTable";
import { calculateOT } from "@/lib/otCalculater";
import { calculatePenalty } from "@/lib/penaltyCalculater";
import { it } from "node:test";
import { updatePayrollRecord } from "@/app/action/updatePayrollRecord";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useRouter } from "next/navigation";
import { showError } from "@/utils/showSnackbar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUser } from "@clerk/nextjs";
import Decimal from "decimal.js";
import PayrollSummaryTab from "./PayrollSummaryTab";
import { height } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";

interface PayrollEditEmployeeModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: PayrollRecord | null;
}

const stateIcon = {
  0: (
    <span className="flex flex-row gap-1 item-center justify-center">
      <Icon
        className="text-gray-500"
        width={20}
        icon={"material-symbols-light:save-outline"}
      />
      <p className="text-sm">Changed</p>
    </span>
  ),

  1: (
    <span className="flex flex-row gap-1 item-center justify-center">
      <Icon className="text-gray-500" width={20} icon={"line-md:upload-loop"} />
      <p className="text-sm">Uploading</p>
    </span>
  ),

  2: (
    <span className="flex flex-row gap-1 item-center justify-center">
      <Icon
        className="text-gray-500"
        width={20}
        icon={"material-symbols:check-rounded"}
      />
      <p className="text-sm">Saved</p>
    </span>
  ),
};

export default function PayrollEditEmployeeModal({
  open,
  setOpen,
  selectedRecord,
}: PayrollEditEmployeeModalProps) {
  const queryClient = useQueryClient();
  const doneHandler = async () => {
    await saveDataHandler();
    queryClient.invalidateQueries({
      queryKey: ["payrollRecord", selectedRecord?.periodId],
      exact: false,
    });
    setOpen(false);
  };
  const [incomeAmount, setIncomeAmount] = useState<
    Record<number, { amount: number }>
  >({});
  const [deductionAmount, setDeductionAmount] = useState<
    Record<number, { amount: number }>
  >({});
  const [otAmount, setOtAmount] = useState<
    Record<number, { value: number; amount: number }>
  >({});
  const [penaltyAmount, setPenaltyAmount] = useState<
    Record<number, { value: number; amount: number }>
  >({});
  const [baseSalary, setBaseSalary] = useState<Decimal>(new Decimal(0));

  const [isDirty, setIsDirty] = useState(false);
  const [state, setState] = useState<0 | 1 | 2>(2);
  //0 : changed
  //1 : saving
  //2 : saved

  const { id } = useCurrentShop();
  const { user } = useUser();
  const router = useRouter();
  const { data, isLoading } = useRecordDetails(
    Number(selectedRecord?.id ?? undefined),
  );
  // reset Datafrom previous employee
  useEffect(() => {
    setIncomeAmount({});
    setDeductionAmount({});
    setOtAmount({});
    setPenaltyAmount({});
    setBaseSalary(new Decimal(data?.data?.salary || 0));
  }, [data]);

  useEffect(() => {
    console.log(baseSalary);
    
    if (!isDirty) return;
    setState(0);
    const handler = setTimeout(async () => {
      setState(1);
      await saveDataHandler();
      setState(2);
    }, 1200);

    return () => clearTimeout(handler);
  }, [incomeAmount, deductionAmount, otAmount, penaltyAmount, baseSalary]);

  if (!id || data === null) router.back();

  const saveDataHandler = async () => {
    if (!selectedRecord || !user?.id) return;
    const result = {
      salary: baseSalary.toNumber(),
      salaryValues: [
        ...Object.entries(incomeAmount).map(([id, data]) => ({
          id: Number(id),
          amount: data.amount,
        })),
        ...Object.entries(deductionAmount).map(([id, data]) => ({
          id: Number(id),
          amount: data.amount,
        })),
      ],
      otValues: Object.entries(otAmount).map(([id, data]) => ({
        id: Number(id),
        amount: data.amount,
        value: data.value ?? 0,
      })),
      penaltyValues: Object.entries(penaltyAmount).map(([id, data]) => ({
        id: Number(id),
        amount: data.amount,
        value: data.value ?? 0,
      })),
    };
    try {
      await updatePayrollRecord(result, selectedRecord.id, id!, user?.id);
    } catch (err) {
      showError(`Cannot save data \n ${err}`);
    }
  };
  return (
    <>
      <Modal open={open}>
        <ModalDialog sx={{ background: "#fafafa", maxHeight: "70%" }}>
          <div className="flex flex-row justify-between items-center">
            <p>Salary Details</p>

            {stateIcon[state]}
          </div>
          <p className="text-3xl font-bold">
            {selectedRecord?.employee.firstName}{" "}
            {selectedRecord?.employee.lastName}
          </p>
          <div
            hidden={!isLoading}
            className="flex flex-col justify-center items-center gap-2"
          >
            <Icon icon="ph:spinner" className="animate-spin" fontSize={40} />
            <p>Loading ...</p>
          </div>
          <div
            hidden={isLoading}
            className="gap-5 bg-white p-4 rounded-sm shadow-sm w-full overflow-y-scroll"
          >
            <Tabs aria-label="Basic tabs" defaultValue={0}>
              <TabList
                disableUnderline
                sx={{
                  [`& .${tabClasses.root}`]: {
                    fontSize: "sm",
                    fontWeight: "lg",
                    [`&[aria-selected="true"]`]: {
                      bgcolor: "background.surface",
                    },
                    [`&.${tabClasses.focusVisible}`]: {
                      outlineOffset: "-4px",
                    },
                  },
                }}
              >
                <Tab color="success">Income</Tab>
                <Tab color="danger">Deduction</Tab>
                <Tab color="neutral">Overtime</Tab>
                <Tab color="neutral">Absent</Tab>
                <Tab color="warning">Summary</Tab>
              </TabList>
              <TabPanel value={0}>
                <PayrollTable
                  showIncomeRow={true}
                  salary={data?.data?.salary}
                  data={
                    data?.data?.salaryValues.filter(
                      (v) => v.type === SALARY_FIELD_DEFINATION_TYPE.INCOME,
                    ) ?? []
                  }
                  renderName={(item) => item.name}
                  renderAmount={(item) => Number(item.amount)}
                  amountValues={incomeAmount}
                  setInputValues={setIncomeAmount}
                  setIsDirty={setIsDirty}
                  baseSalary={baseSalary}
                  setBaseSalary={setBaseSalary}
                />
              </TabPanel>
              <TabPanel value={1}>
                <PayrollTable
                  data={
                    data?.data?.salaryValues.filter(
                      (v) => v.type === SALARY_FIELD_DEFINATION_TYPE.DEDUCTION,
                    ) ?? []
                  }
                  renderName={(item) => item.name}
                  renderAmount={(item) => Number(item.amount)}
                  amountValues={deductionAmount}
                  setInputValues={setDeductionAmount}
                  setIsDirty={setIsDirty}
                />
              </TabPanel>
              <TabPanel value={2}>
                <PayrollTable
                  data={data?.data?.otValues ?? []}
                  renderName={(item) => item.name}
                  renderAmount={(item) => Number(item.amount)}
                  showValueColumn={true}
                  autoCalculate={true}
                  calculateAmount={(item, v) =>
                    calculateOT(
                      v,
                      item.type,
                      item.method,
                      item.rate,
                      item.rateOfPay,
                    )
                  }
                  amountValues={otAmount}
                  setInputValues={setOtAmount}
                  setIsDirty={setIsDirty}
                />
              </TabPanel>
              <TabPanel value={3}>
                <PayrollTable
                  data={data?.data?.penaltyValues ?? []}
                  renderName={(item) => item.name}
                  renderAmount={(item) => Number(item.amount)}
                  showValueColumn={true}
                  autoCalculate={true}
                  calculateAmount={(item, v) =>
                    calculatePenalty(v, item.type, item.method, item.rateOfPay)
                  }
                  amountValues={penaltyAmount}
                  setInputValues={setPenaltyAmount}
                  setIsDirty={setIsDirty}
                />
              </TabPanel>
              <TabPanel value={4}>
                <PayrollSummaryTab recordId={selectedRecord?.id || -1} />
              </TabPanel>
            </Tabs>
          </div>

          <Button
            disabled={isLoading}
            onClick={() => {
              doneHandler();
            }}
          >
            Done
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
}

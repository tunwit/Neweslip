"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import EmployeesTable from "@/app/components/Employees/EmployeesTable";
import PendingElement from "@/app/components/Payrolls/PendingElement";
import dayjs from "dayjs";
import { Checkbox, Modal, ModalDialog } from "@mui/joy";
import PendingSection from "@/app/components/Payrolls/PendingSection";
import { Add, ChevronRight } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShop } from "@/hooks/useShop";
import { createPayrollPeriod } from "@/app/action/createPayrollPeriod";
import { NewPayrollPeriod } from "@/types/payrollPeriod";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { number } from "zod";
import { useUser } from "@clerk/nextjs";
import { usePayrollPeriods } from "@/hooks/usePayrollPeriods";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { useCheckBox } from "@/hooks/useCheckBox";
import UsersIcon from "@/assets/icons/UsersIcon";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import PeriodsTable from "@/app/components/Payrolls/PeriodsTable";

export default function Home() {
  const rounter = useRouter();
  const queryClient = useQueryClient();

  const { id } = useCurrentShop();
  const { user } = useUser();
  const [creatingPeriod, setCreatingPeriod] = useState(false);

  const pathname = usePathname();
  const { data,isLoading } = usePayrollPeriods(id || -1);

  const newHandler = async () => {
    setCreatingPeriod(true);
    try {
      if (!id || !user?.id) return;
      const payload: Omit<NewPayrollPeriod, "shopId"> = {
        name: `New payroll ${new Date().toLocaleDateString()}`,
        start_period: new Date(),
        end_period: new Date(),
      };

      const periodId = await createPayrollPeriod(payload, id, user?.id);
      queryClient.invalidateQueries({
        queryKey: ["payrollPeriods"],
        exact: false,
      });
      if (periodId[0].id) {
        rounter.push(`payrolls/edit?id=${periodId[0].id}`);
      }
    } finally {
      setCreatingPeriod(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 font-medium">
      <Modal open={isLoading}>
        <ModalDialog>
          <div className="flex flex-col items-center justify-center">
            <Icon
              icon={"mynaui:spinner"}
              className="animate-spin"
              fontSize={50}
            />

            <p>Loading payrolls</p>
          </div>
        </ModalDialog>
      </Modal>
      <section className="px-10 pb-5 bg-white w-full border-b border-gray-200">
        <div className=" flex flex-row text-[#424242] text-xs pt-10 ">
          <p>
            {" "}
            Haris {">"} Dashboard {">"} &nbsp;
          </p>
          <p className="text-blue-800">Payrolls</p>
        </div>
        <div className="mt-5 flex flex-row justify-between">
          <span>
            <p className="text-black text-4xl font-bold">Payrolls</p>
            <p className=" text-gray-700 mt-2"></p>
          </span>

          <Button
            onClick={newHandler}
            sx={{ height: 40 }}
            startDecorator={<Add sx={{ fontSize: "20px" }} />}
          >
            New Payroll
          </Button>
        </div>
      </section>

      <div className="mx-10 flex flex-col min-h-screen ">
        <section className="mt-8 flex flex-row justify-between bg-white p-4 rounded-md shadow">
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
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 space-y-5">
          {data?.data &&
            data?.data?.filter(
              (period) => period.status === PAY_PERIOD_STATUS.DRAFT,
            ).length > 0 && (
              <PeriodsTable
                title="Pending"
                color="gray"
                periods={
                  data?.data?.filter(
                    (period) => period.status === PAY_PERIOD_STATUS.DRAFT,
                  ) || []
                }
              />
            )}
          {data?.data &&
            data?.data?.filter(
              (period) => period.status === PAY_PERIOD_STATUS.FINALIZED,
            ).length > 0 && (
              <PeriodsTable
                title="Finalized"
                color="green"
                editable={false}
                periods={
                  data?.data?.filter(
                    (period) => period.status === PAY_PERIOD_STATUS.FINALIZED,
                  ) || []
                }
              />
            )}
          {data?.data &&
            data?.data?.filter(
              (period) => period.status === PAY_PERIOD_STATUS.PAID,
            ).length > 0 && (
              <PeriodsTable
                title="Paid"
                color="grey"
                editable={false}
                periods={
                  data?.data?.filter(
                    (period) => period.status === PAY_PERIOD_STATUS.PAID,
                  ) || []
                }
              />
            )}
        </section>
      </div>
    </main>
  );
}

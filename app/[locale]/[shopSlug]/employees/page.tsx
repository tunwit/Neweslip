"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon, loadIcon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import EmployeesTable from "@/app/components/Employees/EmployeesTable";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import SnackBar from "@/widget/SnackBar";
import { Suspense, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQueryClient } from "@tanstack/react-query";
import BranchSelector from "@/widget/BranchSelector";
import StatusSelector from "@/widget/StatusSelector";
import {
  EMPLOYEE_ORDERBY,
  EMPLOYEE_SORTBY,
  EMPLOYEE_STATUS,
} from "@/types/enum/enum";
import { Pagination } from "@mui/material";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useEmployeeStats } from "@/hooks/employee/useEmployeeStats";
import { EmployeeTableWrapper } from "@/app/components/Employees/EmployeeTableWrapper";
import Head from "next/head";
import { useTranslations } from "next-intl";
import OrderByFilter from "@/widget/OrderByFilter";

export default function Home() {
  const rounter = useRouter();
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 500);
  const [branchId, setBranchId] = useState(-1);
  const [status, setStatus] = useState<EMPLOYEE_STATUS | null>(null);
  const [sortBy, setSortBy] = useState<EMPLOYEE_SORTBY>(EMPLOYEE_SORTBY.NAME);
  const [orderBy, setOrderBy] = useState<EMPLOYEE_ORDERBY>(
    EMPLOYEE_ORDERBY.ASC,
  );
  const { name } = useCurrentShop();
  const tb = useTranslations("breadcrumb");
  const t = useTranslations("employees");

  return (
    <>
      <title>Employee - E Slip</title>
      <main className="min-h-screen w-full bg-white font-medium">
        <div className="mx-10">
          <div className="flex flex-row text-[#424242] text-xs mt-10">
            <p>
              {name} {">"} {tb("dashboard")} {">"}&nbsp;
            </p>
            <p className="text-blue-800">{tb("employees")}</p>
          </div>
          <div className=" mt-5 flex flex-row justify-between">
            <p className="text-black text-4xl font-bold">{t("label")}</p>
            <Button
              onClick={() => rounter.push("employees/new")}
              startDecorator={<Add sx={{ fontSize: "20px" }} />}
              sx={{
                fontSize: "13px",
                "--Button-gap": "5px",
                padding: 1.2,
              }}
            >
              {t("actions.create")}
            </Button>
          </div>

          <div className="mt-8 flex flex-row gap-2">
            <div className="w-[60%]">
              <p className="text-black text-xs mb-1"> {t("search.label")}</p>
              <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
                <Icon
                  className="text-[#424242]"
                  icon={"material-symbols:search-rounded"}
                />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="w-[20%]">
              <p className="text-black text-xs mb-1">
                {t("filters.status.label")}
              </p>
              <StatusSelector
                isEnableAll={true}
                status={status}
                onChange={(value) => setStatus(value!)}
              />
            </div>

            <div className="w-[20%]">
              <p className="text-black text-xs mb-1">
                {t("filters.branch.label")}
              </p>
              <BranchSelector
                branchId={branchId}
                onChange={(n) => {
                  setBranchId(n);
                }}
                isEnableAll={true}
              />
            </div>
            <div className="w-[15%]">
              <p className="text-black text-xs mb-1">
                {t("filters.sort_by.label")}
              </p>
              <OrderByFilter
                onChange={(n) => {
                  setSortBy(n);
                }}
                choices={EMPLOYEE_SORTBY}
                tPrefix="sort_by"
              />
            </div>
            <div className="w-[15%]">
              <p className="text-black text-xs mb-1">
                {t("filters.order_by.label")}
              </p>
              <OrderByFilter
                onChange={(n) => {
                  setOrderBy(n);
                }}
                choices={EMPLOYEE_ORDERBY}
                tPrefix="order_by"
              />
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <EmployeeTableWrapper
              sortBy={sortBy}
              orderBy={orderBy}
              search_query={debounced}
              branchId={branchId}
              status={status}
            />
          </div>
        </div>
      </main>
    </>
  );
}

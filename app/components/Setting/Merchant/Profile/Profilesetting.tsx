import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useShopDetails } from "@/hooks/shop/useShopDetails";
import { useZodForm } from "@/lib/useZodForm";
import { overviewSchema } from "@/schemas/setting/overviewForm";
import normalizeNull from "@/utils/normallizeNull";
import { InputForm } from "@/widget/InputForm";
import { Avatar, Input } from "@mui/joy";
import React from "react";
import { FormProvider } from "react-hook-form";
import OverviewForm from "./OverviewForm";

export default function Profilesetting() {
  const { id, name } = useCurrentShop();
  const { data, isLoading } = useShopDetails(id);
  if (isLoading || !data?.data) return <p>Loading...</p>;
  return (
    <>
      <div className="flex flex-col max-w-[50%] justify-center items-center gap-3">
        <div className="w-40 h-40">
          <Avatar variant="outlined" sx={{ width: "100%", height: "100%" }}>
            H
          </Avatar>
        </div>
        <p className="font-semibold">{name}</p>
        <div className="w-full">
          <OverviewForm shopData={data?.data} />
        </div>
      </div>
    </>
  );
}

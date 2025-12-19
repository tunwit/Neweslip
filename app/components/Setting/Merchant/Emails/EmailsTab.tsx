import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Option,
  Select,
  Table,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { useCheckBox } from "@/hooks/useCheckBox";
import { useBranch } from "@/hooks/branch/useBranch";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { deleteBranch } from "@/app/action/branch/deleteBranch";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";
import { Branch } from "@/types/branch";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
import { useRouter } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import ConfirmModal from "@/widget/ConfirmModal";
import { useZodForm } from "@/lib/useZodForm";
import { emailConfigForm } from "@/schemas/email/emailConfigForm";
import { Controller, FormProvider } from "react-hook-form";
import { InputForm } from "@/widget/InputForm";
import { useShopDetails } from "@/hooks/shop/useShopDetails";
import { verify } from "@/lib/emailService";
import { NewShop } from "@/types/shop";
import EmailForm from "./EmailForm";
import { useTranslations } from "next-intl";

export default function EmailsTab() {
  const { id } = useCurrentShop();
  const { data, isLoading } = useShopDetails(id);
  const t = useTranslations("shops");
  if (isLoading || !data?.data) return;

  return (
    <>
      <div className="-mt-4">
        <h1 className="font-medium text-3xl">{t("tabs.email_config")}</h1>
        <EmailForm shopData={data?.data} />
      </div>
    </>
  );
}

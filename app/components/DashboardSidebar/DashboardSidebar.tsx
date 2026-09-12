"use client";
import DashboardButton from "./DashboardButton";
import { usePathname, useRouter } from "next/navigation";
import useHamburger from "@/hooks/useHamburger";
import UsersIcon from "@/assets/icons/UsersIcon";
import MoneyIcon from "@/assets/icons/MoneyIcon";
import DocumentIcon from "@/assets/icons/DocumentIcon";
import SettingIcon from "@/assets/icons/SettingIcon";
import { useTranslations } from "next-intl";
import { useOwnShop } from "@/hooks/hook.shop";
import { ShopPublicDTO } from "@/types/type.shop";
import DocumentSmallIcon from "@/assets/icons/DocumentSmallIcon";
import { getDocumentPath } from "@/lib/downloadSystemDoc";
import Select from "@mui/joy/Select/Select";
import { Option } from "@mui/joy";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { createSlug } from "@/utils/createSlug";

const DashboardRails = [
  {
    titleKey: "employees",
    icon: UsersIcon,
    id: "employees",
    href: "/employees",
  },
  {
    titleKey: "documents",
    icon: DocumentIcon,
    id: "documents",
    href: "/documents",
    items: [
      {
        titleKey: "pnd1",
        id: "pnd1",
        icon: DocumentSmallIcon,
        onclick: () => getDocumentPath("pnd1"),
      },
      {
        titleKey: "pnd1G",
        id: "pnd1G",
        icon: DocumentSmallIcon,
        onclick: () => getDocumentPath("pnd1G"),
      },
      {
        titleKey: "50Tw",
        id: "50Tw",
        icon: DocumentSmallIcon,
        onclick: () => getDocumentPath("50Tw"),
      },
    ],
  },
  {
    titleKey: "payrolls",
    icon: MoneyIcon,
    id: "periods",
    href: "/periods",
  },
  // {
  //   titleKey: "Records",
  //   icon: HistoryIcon,
  //   id: "records",
  //   href: "/records",
  // },
];

const ConfigureRails = [
  // {
  //   titleKey: "Template",
  //   icon: TemplateIcon,
  //   id: "template",
  //   href: "/template",
  // },
  {
    titleKey: "settings",
    icon: SettingIcon,
    id: "settings",
    href: "/settings",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname().split("/");
  const shopSlug = pathname[2];
  const page = pathname[3];
  const sidebarState = useHamburger((state) => state.open);
  const { data } = useOwnShop();
  const t = useTranslations("navigation");
  const currentShop = useCurrentShop();
  const router = useRouter();
  const fullCurrentShopObject = data?.data?.find((shop: ShopPublicDTO) => {
    return shop.id === currentShop.id;
  });
  if (!fullCurrentShopObject) {
    return (
      <div
        style={{ width: sidebarState ? "100%" : "0%" }}
        className="transition-all duration-300 flex flex-col bg-[#1f1f1f] text-black max-h-[calc(100vh-80px)]  max-w-60 w-56 sticky top-0 left-0 shadow-2xl overflow-clip"
      >
        <div className="px-3 flex flex-col text-sm gap-1">
          <p className="text-white text-center mt-5">noShopAvailable</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div
        style={{ width: sidebarState ? "100%" : "0%" }}
        className="transition-all duration-300 flex flex-col bg-[#1f1f1f] text-black max-h-[calc(100vh-80px)]  max-w-60 w-56 sticky top-0 left-0 shadow-2xl overflow-clip"
      >
        <div className="px-3 flex flex-col text-sm gap-1">
          {/* {Array.isArray(data?.data) &&
            data?.data.map((shop: ShopPublicDTO, i: number) => {
              const slug = createSlug(shop.name, String(shop.id));
              return (
                <ShopSidebarElement
                  key={shop.id}
                  id={shop.id}
                  title={shop.name}
                  avatar={shop.avatarUrl || ""}
                  selected={shopSlug == slug}
                />
              );
            })} */}

          <Select<ShopPublicDTO, false>
            onChange={(_, selectedShop) => {
              if (!selectedShop) return;

              const { id, name } = selectedShop;
              router.push(`/${createSlug(name, String(id))}/employees`);
            }}
            variant="solid"
            value={fullCurrentShopObject}
            startDecorator={
              <ChangableAvatar
                size={30}
                src={fullCurrentShopObject.avatarUrl ?? ""}
              />
            }
            className="w-full"
            sx={{
              backgroundColor: "#292929",
              color: "#dedede",
              "&:hover": { backgroundColor: "#2B2B2B" },
            }}
            slotProps={{
              listbox: {
                sx: {
                  backgroundColor: "#292929",
                  borderColor: "#474747",
                  '& .MuiOption-root:not([aria-selected="true"])': {
                    backgroundColor: "#292929",
                    "&:hover, &.MuiOption-highlighted": {
                      backgroundColor: "#333333",
                    },
                  },
                  '& .MuiOption-root[aria-selected="true"]': {
                    backgroundColor: "#333333",
                    color: "#ffffff",
                  },
                },
              },
            }}
          >
            {Array.isArray(data?.data) &&
              data?.data.map((shop: ShopPublicDTO) => {
                return (
                  <Option value={shop} key={shop.id}>
                    <ChangableAvatar
                      size={25}
                      fallbackTitle={shop.name}
                      allowRemove={false}
                      editable={false}
                      src={shop.avatarUrl ?? ""}
                    />{" "}
                    {shop.name}
                  </Option>
                );
              })}
          </Select>
        </div>
        <div className="my-5 px-3">
          <hr className="border-t border-[#747474] h-[2px]" />
        </div>
        <p className="pl-4 text-xs text-[#797979] font-bold mb-4">
          {t("dashboard")}
        </p>
        <div className="pl-3 flex flex-col text-sm gap-1">
          {DashboardRails.map((v, i) => {
            return (
              <DashboardButton
                key={i}
                title={t(v.titleKey)}
                icon={v.icon}
                id={v.id}
                selected={page == v.id}
                href={`/${shopSlug}${v.href}`}
                items={v.items}
              />
            );
          })}
        </div>

        <p className="pl-4 text-xs text-[#797979] font-bold mt-10 mb-4">
          {t("configure")}
        </p>
        <div className="pl-3 flex flex-col text-sm gap-1">
          {ConfigureRails.map((v, i) => {
            return (
              <DashboardButton
                key={i}
                title={t(v.titleKey)}
                icon={v.icon}
                id={v.id}
                selected={page == v.id}
                href={`/${shopSlug}${v.href}`}
              />
            );
          })}
        </div>
        <span className="absolute bottom-5 text-center w-full text-[#797979] text-xs">
          V 1.3.0 @beta
        </span>
      </div>
    </>
  );
}

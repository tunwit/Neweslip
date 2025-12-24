import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { useShopDetails } from "@/hooks/shop/useShopDetails";
import { Avatar } from "@mui/joy";
import { ChangeEvent, useRef } from "react";
import OverviewForm from "./OverviewForm";
import { Icon } from "@iconify/react/dist/iconify.js";
import { changeShopAvatar } from "@/app/action/shop/changeShopAvatar";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/showSnackbar";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { deleteShopAvatar } from "@/app/action/shop/deleteShopAvatar";

export default function Profilesetting() {
  const { id, name } = useCurrentShop();
  const { data, isLoading } = useShopDetails(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const queryClient = useQueryClient();

  if (isLoading || !data?.data) return <p>Loading...</p>;

  const handleSelectFile = async (file?: File) => {
    if (!file || !id || !user) return;
    console.log(file);
    
    try {
      await changeShopAvatar(file, id, user.id, data.data?.avatar);
      queryClient.invalidateQueries({
        queryKey: ["shop", "details"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["shop"],
        exact: false,
      });
      showSuccess("Change avatar sucessful");
    } catch (err) {
      showError(`Change avatar failed ${err}`);
    }
  };

  const handleRemove = async () => {
    if (!data?.data?.avatar || !id || !user) return;
    try {
      await deleteShopAvatar(data?.data?.avatar, id, user.id);
      queryClient.invalidateQueries({
        queryKey: ["shop", "details"],
        exact: false,
      });
      showSuccess("Change avatar sucessful");
    } catch (err) {
      showError(`Change avatar failed ${err}`);
    }
  };

  const avatar = `${process.env.NEXT_PUBLIC_CDN_URL}/${data.data.avatar}`;

  return (
    <>
      <div className="flex flex-col max-w-[50%] justify-center items-center gap-3">
        <ChangableAvatar
          src={avatar}
          size={160}
          fallbackTitle={data.data.name.charAt(0)}
          onChange={handleSelectFile}
          onRemove={handleRemove}
          editable={true}
        />
        <p className="font-semibold">{name}</p>
        <div className="w-full">
          <OverviewForm shopData={data?.data} />
        </div>
      </div>
    </>
  );
}

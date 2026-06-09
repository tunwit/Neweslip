import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import OverviewForm from "./OverviewForm";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/showSnackbar";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { useChangeShopAvatar, useShopConfigs } from "@/hooks/hook.shop";

export default function Profilesetting() {
  const { id } = useCurrentShop();
  const { data, isLoading } = useShopConfigs();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { mutateAsync: changeAvatarMutate } = useChangeShopAvatar();

  if (isLoading || !data?.data) return <p>Loading...</p>;

  const handleSelectFile = async (file?: File) => {
    if (!file || !id || !user) return;
    console.log(file);

    try {
      await changeAvatarMutate({ file: file });
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
      await changeAvatarMutate({ file: null });
      queryClient.invalidateQueries({
        queryKey: ["shop", "details"],
        exact: false,
      });
      showSuccess("Change avatar sucessful");
    } catch (err) {
      showError(`Change avatar failed ${err}`);
    }
  };

  return (
    <>
      <div className="flex flex-col max-w-[50%] justify-center items-center gap-3">
        <ChangableAvatar
          src={data.data.avatarUrl || ""}
          size={160}
          fallbackTitle={data.data.name.charAt(0)}
          onChange={handleSelectFile}
          onRemove={handleRemove}
          editable={true}
        />
        <p className="font-semibold">{data.data.name}</p>
        <div className="w-full">
          <OverviewForm shopData={data?.data} />
        </div>
      </div>
    </>
  );
}

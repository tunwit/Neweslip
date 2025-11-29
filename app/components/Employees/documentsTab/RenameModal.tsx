import { renameEmployeeDocument } from "@/app/action/renameEmployeeDocument";
import { uploadEmployeeDocuments } from "@/app/action/uploadEmployeeDocument";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  CircularProgress,
  Input,
  LinearProgress,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  Dispatch,
  DragEventHandler,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface RenameModalProps {
  docId: number;
  docKey: string;
  oldName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function RenameModal({
  docId,
  docKey,
  oldName,
  open,
  setOpen,
}: RenameModalProps) {
  const [newname, setNewname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id: shopid } = useCurrentShop();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const onConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsSubmitting(true)
    if (newname === oldName) return;
    if (!user?.id || !shopid) return;
    const prefix = docKey.split("/", 1)[0];
    try{
        await renameEmployeeDocument(
        docId,
        newname,
        docKey,
        `${prefix}/${newname}`,
        shopid,
        user?.id,
        );
        setOpen(false);
        queryClient.invalidateQueries({
        queryKey: ["employees", "document"],
        exact: false,
        });
    }catch (err){
        console.log(err);
        
    }finally{
        setIsSubmitting(false)
    }
  };

  useEffect(() => {
    setNewname(oldName);
  }, [oldName]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <ModalClose />
        <h1 className="font-bold text-xl">Rename</h1>
        <form onSubmit={onConfirm}>
          <section>
            <Input
              sx={{ fontSize: 14 }}
              onChange={(e) => {
                setNewname(e.target.value);
              }}
              defaultValue={oldName}
              placeholder="rename"
            />
          </section>
          <section className="flex flex-row-reverse gap-3 mt-2">
            <Button type="submit" disabled={!newname || isSubmitting} loading={isSubmitting} size="sm" >
              Confirm
            </Button>
            <Button size="sm" variant="outlined" onClick={()=>setOpen(false)}>
              Cancel
            </Button>
          </section>
        </form>
      </ModalDialog>
    </Modal>
  );
}

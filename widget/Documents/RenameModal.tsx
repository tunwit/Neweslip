
import { useUser } from "@clerk/nextjs";
import { Button, Input, Modal, ModalClose, ModalDialog } from "@mui/joy";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface RenameModalProps<T extends { id: number; key: string; fileName: string }> {
  doc: T;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onRename: (doc: T, newName: string) => Promise<void>;
}

export default function RenameModal<T extends { id: number; key: string; fileName: string }>({
  doc,
  open,
  setOpen,
  onRename,
}: RenameModalProps<T>) {
  const [newName, setNewName] = useState(doc?.fileName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNewName(doc?.fileName);
  }, [doc?.fileName]);

  const onConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newName === doc.fileName) return;
    setIsSubmitting(true);
    try {
      await onRename(doc, newName);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <ModalClose />
        <h1 className="font-bold text-xl">Rename</h1>
        <form onSubmit={onConfirm}>
          <section>
            <Input onChange={(e) => setNewName(e.target.value)} value={newName} placeholder="rename" />
          </section>
          <section className="flex flex-row-reverse gap-3 mt-2">
            <Button type="submit" disabled={!newName || isSubmitting} loading={isSubmitting}>
              Confirm
            </Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </section>
        </form>
      </ModalDialog>
    </Modal>
  );
}

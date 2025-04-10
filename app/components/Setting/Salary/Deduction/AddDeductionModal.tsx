import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import React from "react";

interface AddDeductionModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function AddDeductionModal({
  open,
  setOpen,
}: AddDeductionModalProps) {
  const doneHandler = () => {
    setOpen(false);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doneHandler();
  };
  return (
    <>
      <Modal open={open} onClose={() => doneHandler()}>
        <ModalDialog sx={{ background: "#fafafa" }}>
          <ModalClose></ModalClose>
          <form onSubmit={(e) => submitHandler(e)}>
            <div className="flex flex-col gap-3">
              <div className="col-span-2">
                <FormControl required>
                  <FormLabel>Thai Label</FormLabel>
                  <Input
                    type="text"
                    sx={{ "--Input-focusedThickness": 0 }}
                    size="md"
                    placeholder="Label"
                  />
                </FormControl>
              </div>
              <div className="col-span-2">
                <FormControl>
                  <FormLabel>English Label</FormLabel>
                  <Input
                    type="text"
                    sx={{ "--Input-focusedThickness": 0 }}
                    size="md"
                    placeholder="Label"
                  />
                </FormControl>
              </div>
            </div>
            <div className="mt-3">
              <Button type="summit" sx={{ width: "100%" }}>
                Add
              </Button>
            </div>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}

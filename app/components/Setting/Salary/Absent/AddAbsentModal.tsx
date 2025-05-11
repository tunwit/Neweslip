import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  ToggleButtonGroup,
} from "@mui/joy";
import React, { useState } from "react";

interface AddAbsentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddAbsentModal({ open, setOpen }: AddAbsentModalProps) {
  const [method, setMethod] = useState<string | null>("hourly");
  const [type, setType] = useState<string | null>("base on salary");
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
            <div className="grid grid-cols-2 gap-3">
              <div className="">
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
              <div>
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

              <div>
                <FormControl>
                  <FormLabel>Method</FormLabel>
                  <ToggleButtonGroup
                    value={method}
                    // size="sm"
                    onChange={(event, newValue) => {
                      setMethod(newValue);
                    }}
                  >
                    <Button value="per minute">per minute</Button>
                    <Button value="hourly">hourly</Button>
                    <Button value="daily">daily</Button>
                  </ToggleButtonGroup>
                </FormControl>
              </div>

              <div>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={type}
                    onChange={(event, newValue) => {
                      setType(newValue);
                    }}
                  >
                    <Option value="base on salary">base on salary</Option>
                    <Option value="constant">constant</Option>
                  </Select>
                </FormControl>
              </div>

              {type === "constant" && (
                <div>
                  <FormControl required>
                    <FormLabel>Rate of Deduction</FormLabel>
                    <Input
                      type="number"
                      sx={{ "--Input-focusedThickness": 0 }}
                      size="md"
                      placeholder="0.00"
                    />
                  </FormControl>
                </div>
              )}
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

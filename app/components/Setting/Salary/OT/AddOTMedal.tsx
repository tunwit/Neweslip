import React, { useState } from "react";
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
  Slider,
  ToggleButtonGroup,
} from "@mui/joy";

interface AddOTModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddOTMedal({ open, setOpen }: AddOTModalProps) {
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
                    <Button value="hourly">hourly</Button>
                    <Button value="daily">daily</Button>
                  </ToggleButtonGroup>
                </FormControl>
              </div>

              <div>
                <FormControl>
                  <FormLabel>OT Rate</FormLabel>
                  <Slider
                    size="sm"
                    variant="soft"
                    aria-label="Small steps"
                    defaultValue={1.5}
                    step={0.5}
                    marks={[
                      { value: 1, label: "x1" },
                      { value: 3, label: "x3" },
                    ]}
                    min={1}
                    max={3}
                    valueLabelDisplay="auto"
                  />
                </FormControl>
              </div>

              <div>
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select
                    defaultValue="base on salary"
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
                    <FormLabel>Rate of Pay</FormLabel>
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

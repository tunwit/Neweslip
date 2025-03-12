import { Step, StepIndicator, Stepper } from "@mui/joy";
import React from "react";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import HomeIcon from "@mui/icons-material/Home";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";

const steps = [
  { title: "Personal Infomation", icon: <PersonIcon /> },
  { title: "Address", icon: <HomeIcon /> },
  { title: "Contract", icon: <StickyNote2Icon /> },
];

interface CreateStepperProps {
  current: number;
}

export default function CreateStepper({ current }: CreateStepperProps) {
  return (
    <>
      <Stepper sx={{ width: "100%" }}>
        {steps.map((v, i) => {
          return (
            <Step
              key={i}
              orientation="vertical"
              indicator={
                <StepIndicator
                  variant="solid"
                  color={
                    current === i
                      ? "primary"
                      : i < current
                        ? "success"
                        : "neutral"
                  }
                >
                  {i < current ? <CheckRoundedIcon /> : v.icon}
                </StepIndicator>
              }
            >
              {v.title}
            </Step>
          );
        })}
      </Stepper>
    </>
  );
}

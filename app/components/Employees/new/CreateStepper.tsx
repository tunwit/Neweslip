import { Step, StepIndicator, Stepper } from "@mui/joy";
import React, { useTransition } from "react";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import HomeIcon from "@mui/icons-material/Home";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslations } from "next-intl";

const steps = [
  { titleKey: "personal_info", icon: <PersonIcon /> },
  { titleKey: "address", icon: <HomeIcon /> },
  { titleKey: "contract", icon: <StickyNote2Icon /> },
];

interface CreateStepperProps {
  current: number;
}

export default function CreateStepper({ current }: CreateStepperProps) {
  const t = useTranslations("new_employees.steps");
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
              {t(v.titleKey)}
            </Step>
          );
        })}
      </Stepper>
    </>
  );
}

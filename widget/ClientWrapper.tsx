"use client";

import React from "react";
import SnackBar from "./SnackBar";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SnackBar />
    </>
  );
}

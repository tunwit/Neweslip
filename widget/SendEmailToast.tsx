import { LinearProgress } from "@mui/joy";
import React from "react";
interface LoadingToastProps {
  title: string;
  value: number;
  current: number;
  completed: number;
  failed: number;
  total: number;
}
export default function SendEmailToast({
  title,
  value,
  current,
  completed,
  failed,
  total,
}: LoadingToastProps) {
  return (
    <div className="w-full space-y-3">
      <span className="flex items-center gap-2">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-gray-500">
          {current} / {total}
        </p>
      </span>
      <LinearProgress determinate value={value} />
      <div className="flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1">
          completed: <p className="text-green-700">{completed || 0}</p>
        </span>
        <span className="flex items-center gap-1">
          failed: <p className="text-red-700">{failed || 0}</p>
        </span>
      </div>
    </div>
  );
}

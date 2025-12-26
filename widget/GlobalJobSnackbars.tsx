// GlobalJobSnackbars.tsx
"use client";

import { useJobStore } from "@/hooks/useJobStore";
import { Snackbar, LinearProgress, Box, Typography } from "@mui/joy";
import { useEffect } from "react";

export default function GlobalJobSnackbars() {
  const { jobs, updateJob, removeJob } = useJobStore();

  useEffect(() => {
    const timers = jobs.map((job) =>
      setInterval(async () => {
        const res = await fetch(
          `/api/payroll/emails/get-progress?batchId=${job.batchId}`,
        );
        const { data } = await res.json();
        console.log(data);
        
        updateJob(job.batchId, {
          completed: data.completed,
          failed: data.failed,
          total: data.total,
          progress: data.percent,
        });

        if (data.completed + data.failed === data.total) {
          setTimeout(() => removeJob(job.batchId), 2000);
        }
      }, 1000),
    );

    return () => timers.forEach(clearInterval);
  }, [jobs]);

  return (
    <>
      {jobs.map((job, index) => (
        <Snackbar
          key={job.batchId}
          open
          autoHideDuration={null}
          sx={{ bottom: 16 + index * 72, right: 16, width: 320 }}
        >
          <div className="w-full space-y-3">
            <span className="flex items-center gap-2">
              <p className="text-sm font-semibold">{job.title}</p>
              <p className="text-xs text-gray-500">
                {job.completed + job.failed} / {job.total}
              </p>
            </span>
            <LinearProgress determinate value={job.progress} />
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                completed: <p className="text-green-700">{job.completed || 0}</p>
              </span>
              <span className="flex items-center gap-1">
                failed: <p className="text-red-700">{job.failed || 0}</p>
              </span>
            </div>
          </div>
        </Snackbar>
      ))}
    </>
  );
}

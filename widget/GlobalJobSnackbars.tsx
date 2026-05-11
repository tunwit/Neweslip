// GlobalJobSnackbars.tsx
"use client";

import { JOB_BATCH_STATUS, useJobStore } from "@/hooks/useJobStore";
import { fetchwithauth } from "@/utils/fetcher";
import { Snackbar, LinearProgress, Box, Typography } from "@mui/joy";
import { useEffect } from "react";

export default function GlobalJobSnackbars() {
  const { jobs, updateJob, removeJob } = useJobStore();

  useEffect(() => {
    const timers = jobs.map((job) => {
      const interval = setInterval(async () => {
        const res = await fetchwithauth({
          endpoint: `${job.progressUrl}`,
          method: "GET",
        });

        const data = res.data;

        updateJob(job.batchId, {
          status: data.status,
          success: data.success,
          failed: data.failed,
          total: data.total,
          progress: data.progress,
        });

        if (
          data.success + data.failed >= data.total ||
          data.status === JOB_BATCH_STATUS.COMPLETED
        ) {
          clearInterval(interval);

          setTimeout(() => removeJob(job.batchId), 3000);
        }
      }, 1500);

      return interval;
    });
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
          <div className="w-full ">
            <span className="flex items-center gap-2">
              <p className="text-sm font-semibold">{job.title}</p>
              <p className="text-xs text-gray-500">
                {job.success + job.failed} / {job.total}
              </p>
            </span>
            <p className="text-xs my-1">{job.status}</p>
            <LinearProgress determinate value={job.progress} />
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                success: <p className="text-green-700">{job.success || 0}</p>
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

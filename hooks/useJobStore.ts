import { create } from "zustand";

export enum JOB_BATCH_STATUS {
  WAITING = "WAITING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}

type Job = {
  batchId: string;
  progressUrl: string;
  title: string;

  success: number;
  failed: number;
  total: number;
  status: JOB_BATCH_STATUS;
  progress: number;
};

type JobStore = {
  jobs: Job[];
  addJob: (
    job: Omit<
      Job,
      "progress" | "completed" | "failed" | "total" | "success" | "status"
    >,
  ) => void;
  updateJob: (batchId: string, data: Partial<Job>) => void;
  removeJob: (batchId: string) => void;
};

export const useJobStore = create<JobStore>((set) => ({
  jobs: [],
  addJob: (job) =>
    set((s) => ({
      jobs: [
        ...s.jobs,
        {
          ...job,
          progress: 0,
          success: 0,
          failed: 0,
          total: 0,
          status: JOB_BATCH_STATUS.WAITING,
        },
      ],
    })),
  updateJob: (batchId, data) =>
    set((s) => ({
      jobs: s.jobs.map((j) => (j.batchId === batchId ? { ...j, ...data } : j)),
    })),
  removeJob: (batchId) =>
    set((s) => ({
      jobs: s.jobs.filter((j) => j.batchId !== batchId),
    })),
}));

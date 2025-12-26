import { create } from "zustand";

type Job = {
  batchId: number;
  title: string;
  progress: number;
  completed: number;
  failed: number;
  total: number;
};

type JobStore = {
  jobs: Job[];
  addJob: (
    job: Omit<Job, "progress" | "completed" | "failed" | "total">,
  ) => void;
  updateJob: (batchId: number, data: Partial<Job>) => void;
  removeJob: (batchId: number) => void;
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
          completed: 0,
          failed: 0,
          total: 0,
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

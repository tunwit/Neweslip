"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useZodForm } from "@/lib/useZodForm";
import { branchSchema } from "@/schemas/setting/branchForm";
import { InputForm } from "@/widget/InputForm";
import { FormProvider } from "react-hook-form";
import { createBranch } from "../action/createBranch";
import { NewBranch } from "@/types/branch";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { Button, CircularProgress } from "@mui/joy";
import { auth } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";

export default function SetupBranchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const returnBackUrl = searchParams.get("returnBack");
  const user = useUser()
  const method = useZodForm(branchSchema)
  const { control, handleSubmit, formState:{isSubmitting, isSubmitSuccessful} } = method

  const onSubmit = async (data:Omit<NewBranch,"shopId">) => {
    if(!shopId) return
    
    try {
      await createBranch(data,Number(shopId),user.user?.id || null);
      // Redirect back to shop page after successful creation
      showSuccess("Create branch successful")
      router.push(returnBackUrl || "/");
      router.refresh(); // Refresh to trigger middleware check again
    } catch (err) {
      showError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 ">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Setup Your First Branch
          </h1>
          <p className="text-gray-600 mt-2">
            Your shop needs at least one branch to get started
          </p>
        </div>
        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputForm control={control} name="name" label="Branch Name" placeHolder="e.g., Main Branch, สาขาหลัก"/>

            <InputForm control={control} name="nameEng" label="Branch Name (English)" placeHolder="e.g., Main Branch"/>

            <Button
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful}
              loadingPosition="start"
              loading={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                  "Creating Branch..."
              ) : (
                "Create Branch"
              )}
            </Button>
          </form>
        </FormProvider>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Need help?{" "}
            <a href="/support" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
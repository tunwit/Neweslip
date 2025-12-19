"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  return (
    <main className="min-h-screen bg-gray-100 flex w-full justify-center items-center">
      {/* <title>{t("label")}</title> */}
      <div className="bg-white px-10 w-[50%] h-[50%] rounded-2xl flex items-center">
        <Image alt="not-found" src="/not-found.png" height={500} width={500} />
        <div>
          <p className="font-bold text-4xl ">{t("label")} !</p>
          <div className="mt-3 bg-red-200 border border-red-400 rounded-xl p-2">
            <p className="text-red-700 ">{error.message}</p>
          </div>

          <button
            onClick={() => reset()}
            className="w-fit flex items-center  gap-3 bg-black text-white py-2 px-4 mt-3 rounded-full"
          >
            {t("actions.try_again")}
          </button>
        </div>
      </div>
    </main>
  );
}

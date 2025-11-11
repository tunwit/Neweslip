import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@mui/joy";

export default function SetupShopPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 ">
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
            You are not the owner of any shop
          </h1>
          <p className="text-gray-600 mt-2">
            you need to be one of the owner 
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <p className="opacity-50">Please contact supervisor or admin to add you to shop owner</p>
          <SignOutButton/>
        </div>
        
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
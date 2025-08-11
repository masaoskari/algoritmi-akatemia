"use client";

import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background flex flex-col gap-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Jotain meni pieleen
        </h1>

        <button
          onClick={() => router.back()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-900"
        >
          Palaa takaisin
        </button>
      </div>
    </div>
  );
}

'use client';

import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-black hover:bg-gray-800 text-sm normal-case',
          },
        }}
        afterSignUpUrl="/"
        redirectUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  );
}

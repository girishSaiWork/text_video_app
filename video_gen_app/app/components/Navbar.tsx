'use client';

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            PromptVision
          </Link>
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          PromptVision
        </Link>
        
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </div>
      </nav>
    </header>
  );
}

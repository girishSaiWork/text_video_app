import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

// Define public routes that should be accessible without authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in',
  '/sign-in/(.*)',
  '/sign-up',
  '/sign-up/(.*)',
  '/api/webhooks/(.*)'
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/',
  '/dashboard',
  '/dashboard/(.*)',
  '/api/(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next(); // Allow public routes
  }

  if (isProtectedRoute(req)) {
    await auth.protect(); // This will automatically handle redirects
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

import { clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([ //  routes that require authentication
  "/dashboard(.*)",
  "/expenses(.*)",
  "/contacts(.*)",
  "/groups(.*)",
  "/person(.*)",
  "/settlements(.*)",
]);

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth,req : NextRequest) : Promise<NextResponse | void>=> {
  // if user is not authenticated and trying to access a protected route, redirect to sign-in
  const {userId} = await auth();
  if (!userId && isProtectedRoute(req)) {
    const {redirectToSignIn} = await auth();
    return NextResponse.redirect(redirectToSignIn().url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

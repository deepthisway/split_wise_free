"use client";

import { useAuth } from "@clerk/nextjs";
import {ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
      {children}{" "}
    </ConvexProviderWithClerk>
  );
}

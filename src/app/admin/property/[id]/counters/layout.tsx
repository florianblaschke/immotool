import React from "react";
import CounterInsights from "./CounterInsights";

export default async function CounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-0">
      {children}
      <div className="h-full w-full">
        <CounterInsights />
      </div>
    </div>
  );
}

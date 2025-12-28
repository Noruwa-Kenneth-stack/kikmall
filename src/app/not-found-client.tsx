"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      {from && <p className="text-muted-foreground">From: {from}</p>}
    </div>
  );
}

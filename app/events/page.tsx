"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/updates?tab=events");
  }, [router]);
  return null;
}

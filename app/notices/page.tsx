"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NoticesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/house-rules#notices");
  }, [router]);
  return null;
}

"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BodyWrapper() {
  const pathname = usePathname();
  const isContentPage = pathname.startsWith("/materiaali/");

  useEffect(() => {
    if (isContentPage) {
      document.body.className = "overflow-hidden";
    } else {
      document.body.className = "overflow-y-auto overflow-x-hidden";
    }
  }, [isContentPage]);

  return null;
}

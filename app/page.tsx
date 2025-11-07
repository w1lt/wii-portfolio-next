"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileFallback from "@/components/MobileFallback";

// Simple mobile device check
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone/i.test(navigator.userAgent);
};

export default function Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isMobile = mounted && isMobileDevice();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Redirect to home on mount (non-mobile)
  useEffect(() => {
    if (mounted && !isMobile) {
      router.replace("/home");
    }
  }, [mounted, isMobile, router]);

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return <MobileFallback />;
  }

  return null; // Will redirect to /home
}

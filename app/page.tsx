"use client";

import { useState } from "react";
import StartScreen from "@/components/StartScreen";
import MobileFallback from "@/components/MobileFallback";
import { useEffect } from "react";

// Simple mobile device check
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone/i.test(navigator.userAgent);
};

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const isMobile = mounted && isMobileDevice();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  if (isMobile) {
    return <MobileFallback />;
  }

  return <StartScreen />;
}

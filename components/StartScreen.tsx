"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { useRouter } from "next/navigation";

export default function StartScreen() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [showFade, setShowFade] = useState(false);
  const { playClick } = useSound();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleAcknowledge = () => {
    playClick();
    // Trigger fade to black
    setShowFade(true);

    // Delay actual page switch
    setTimeout(() => {
      setAcknowledged(true);
      router.push("/home");
    }, 500); // Adjust fade duration here (500ms)
  };

  if (acknowledged) {
    return null;
  }

  return (
    <div
      ref={ref}
      onClick={handleAcknowledge}
      onKeyDown={handleAcknowledge}
      tabIndex={0}
      className="w-full h-screen bg-black dark:bg-gray-950 text-white flex flex-col items-center justify-center text-center px-4 cursor-pointer focus:outline-none relative"
    >
      <div className="text-yellow-400 dark:text-yellow-500 text-4xl font-bold mb-6 flex items-center gap-3">
        <span className="hidden md:inline">⚠️</span>
        <span>WARNING - HEALTH AND SAFETY</span>
      </div>
      <p className="text-2xl max-w-2xl mb-10 leading-relaxed">
        BEFORE PLAYING, READ YOUR OPERATIONS MANUAL FOR IMPORTANT INFORMATION
        ABOUT YOUR HEALTH AND SAFETY.
      </p>
      <p className="text-lg text-gray-400 dark:text-gray-500 mb-16">
        Also online at <br />
        <span className="text-blue-400 dark:text-blue-500 underline text-xl">
          www.willwhitehead.com
        </span>
      </p>
      <p className="text-xl animate-pulse">
        Click or Press Any Key to continue
      </p>

      {/* Fade to black overlay */}
      {showFade && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-black z-50"
        />
      )}
    </div>
  );
}


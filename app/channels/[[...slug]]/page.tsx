"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import links from "@/data/links";
import { useSound } from "@/contexts/SoundContext";
import Image from "next/image";
import ExperiencePage from "@/components/pages/ExperiencePage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import SpotifyPage from "@/components/pages/SpotifyPage";
import ResumePage from "@/components/pages/ResumePage";

export default function ChannelsPage() {
  const router = useRouter();
  const params = useParams();
  const { playClick, playNextPage } = useSound();
  const [direction, setDirection] = useState(0);
  const isNavigating = useRef(false);
  const [zoomOut, setZoomOut] = useState(false);
  
  // Get initial channel from URL slug
  const slug = params.slug as string[] | undefined;
  const initialChannel = slug?.[0] || "experience";
  
  // Use client-side state for current channel to avoid remounting
  const [currentChannel, setCurrentChannel] = useState(initialChannel);
  
  const pages = links.map((link) => link.route.substring(1)); // Remove leading slash
  
  // Update state when URL changes on initial load or browser back/forward
  useEffect(() => {
    setCurrentChannel(initialChannel);
  }, [initialChannel]);

  // Get content based on current channel
  const getCurrentContent = () => {
    switch (currentChannel) {
      case "experience":
        return <ExperiencePage />;
      case "projects":
        return <ProjectsPage />;
      case "spotify":
        return <SpotifyPage />;
      case "resume":
        return <ResumePage />;
      default:
        return <ExperiencePage />;
    }
  };

  // Navigate to a channel (client-side only, updates URL without remounting)
  const navigateToChannel = (channel: string, dir: number) => {
    setDirection(dir);
    setCurrentChannel(channel);
    // Update URL without triggering Next.js navigation
    window.history.pushState({}, "", `/channels/${channel}`);
  };

  // Get button config based on current channel
  const getButtonConfig = () => {
    switch (currentChannel) {
      case "experience":
        return {
          buttonText: "View Resume",
          buttonAction: () => navigateToChannel("resume", 1),
        };
      case "projects":
        return {
          buttonText: "View GitHub",
          buttonAction: () => window.open("https://github.com/w1lt", "_blank"),
        };
      case "spotify":
        return {
          buttonText: "Visit my Spotify",
          buttonAction: () => window.open("https://open.spotify.com/", "_blank"),
        };
      case "resume":
        return {
          buttonText: "Download PDF",
          buttonAction: () =>
            window.open(
              "https://docs.google.com/document/d/1AfyetAPTr0x9UEfcnXV7LvWgqlnbYmetNXsP6QqOhN4/export?format=pdf"
            ),
        };
      default:
        return {
          buttonText: "Start",
          buttonAction: () => router.push("/"),
        };
    }
  };

  const { buttonText, buttonAction } = getButtonConfig();

  // Handles the 'Home' navigation
  const handleHomeClick = useCallback(() => {
    playClick();
    setZoomOut(true);
    setTimeout(() => {
      router.push("/home");
      setZoomOut(false);
    }, 175);
  }, [router, playClick]);

  // Listen for 'Esc' key to navigate to home
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleHomeClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleHomeClick]);

  // Handles the page navigation with arrow keys
  const handlePageChange = (newDirection: number) => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    const currentPageIndex = pages.indexOf(currentChannel);
    const nextPageIndex =
      (currentPageIndex + newDirection + pages.length) % pages.length;

    playNextPage();
    
    const nextChannel = pages[nextPageIndex];
    navigateToChannel(nextChannel, newDirection);

    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const zoomOutVariants = {
    initial: { scale: 1, opacity: 1 },
    zoomOut: { scale: 0.5, opacity: 0, transition: { duration: 0.175 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentChannel}
          custom={direction}
          variants={zoomOut ? zoomOutVariants : variants}
          initial="enter"
          animate={zoomOut ? "zoomOut" : "center"}
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.25,
          }}
          className="fixed inset-0 bg-white dark:bg-gray-900 rounded-[60px] shadow-lg pt-6 flex flex-col"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-grow px-12">
            {getCurrentContent()}
          </div>

          {/* Navigation arrows */}
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-50">
            <button
              onClick={() => handlePageChange(-1)}
              className="text-4xl transform transition-all duration-300 hover:scale-150 cursor-pointer"
            >
              <Image
                src="/arrow.png"
                alt="Left arrow"
                width={48}
                height={48}
                className="w-12 h-12 transform -scale-x-100"
              />
            </button>
          </div>
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2 z-50">
            <button
              onClick={() => handlePageChange(1)}
              className="text-4xl transform transition-all duration-300 hover:scale-150 cursor-pointer"
            >
              <Image
                src="/arrow.png"
                alt="Right arrow"
                width={48}
                height={48}
                className="w-12 h-12 transform"
              />
            </button>
          </div>

          {/* Footer with dynamic buttons */}
          <footer className="flex-shrink-0 bg-gray-200 dark:bg-gray-800 py-3 flex justify-center items-center space-x-12 mt-auto z-50">
            <button
              onClick={handleHomeClick}
              className="bg-white dark:bg-gray-700 dark:text-white px-8 py-6 rounded-full shadow-lg text-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer"
            >
              Home
            </button>

            <button
              onClick={buttonAction}
              className="bg-white dark:bg-gray-700 dark:text-white px-8 py-6 rounded-full shadow-lg text-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer"
            >
              {buttonText}
            </button>
          </footer>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}


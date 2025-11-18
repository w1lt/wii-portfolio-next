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
import GuestbookPage from "@/components/pages/GuestbookPage";
import MacStatusPage from "@/components/pages/MacStatusPage";
import HomePage from "@/components/pages/HomePage";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { playClick, playNextPage } = useSound();
  const [direction, setDirection] = useState(0);
  const isNavigating = useRef(false);
  const dragDirection = useRef<"horizontal" | "vertical" | null>(null);
  const [zoomOut, setZoomOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get slug from URL
  const slug = params.slug as string[] | undefined;
  const currentSlug = slug?.[0];

  // If no slug, we're on the home page
  const isHomePage = !currentSlug;

  // Use client-side state for current channel to avoid remounting
  // Initialize from URL, but maintain independent state for client-side navigation
  const [currentChannel, setCurrentChannel] = useState(() => currentSlug || "");

  const pages = links.map((link) => link.route.substring(1)); // Remove leading slash

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Navigate to a channel (client-side only, updates URL without remounting)
  const navigateToChannel = useCallback((channel: string, dir: number) => {
    setDirection(dir);
    setCurrentChannel(channel);
    // Update URL without triggering Next.js navigation
    window.history.pushState({}, "", `/${channel}`);
  }, []);

  // Get button config based on current channel
  const getButtonConfig = useCallback(() => {
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
          buttonAction: () =>
            window.open("https://open.spotify.com/", "_blank"),
        };
      case "resume":
        return {
          buttonText: "Download PDF",
          buttonAction: () => (window.location.href = "/resume/pdf"),
        };
      case "mac-status":
        return {
          buttonText: "Refresh",
          buttonAction: () => window.location.reload(),
        };
      default:
        return {
          buttonText: "Home",
          buttonAction: () => router.push("/"),
        };
    }
  }, [currentChannel, navigateToChannel, router]);

  const { buttonText, buttonAction } = getButtonConfig();

  // Handles the 'Home' navigation
  const handleHomeClick = useCallback(() => {
    playClick();
    setZoomOut(true);
    setTimeout(() => {
      router.push("/");
    }, 200);
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
  const handlePageChange = useCallback(
    (newDirection: number) => {
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
    },
    [currentChannel, pages, playNextPage, navigateToChannel]
  );

  const handleDragStart = useCallback(() => {
    dragDirection.current = null;
  }, []);

  const handleDrag = useCallback(
    (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { x: number; y: number } }
    ) => {
      // Determine drag direction on first significant movement
      if (!dragDirection.current) {
        const absX = Math.abs(info.offset.x);
        const absY = Math.abs(info.offset.y);

        if (absX > 10 || absY > 10) {
          dragDirection.current = absX > absY ? "horizontal" : "vertical";
        }
      }
    },
    []
  );

  // Handle drag end for mobile swipe
  const handleDragEnd = useCallback(
    (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { x: number; y: number }; velocity: { x: number } }
    ) => {
      // Only process horizontal swipes
      if (dragDirection.current !== "horizontal") {
        dragDirection.current = null;
        return;
      }

      const swipeThreshold = 75;
      const { offset, velocity } = info;

      // Swipe left (next page)
      if (offset.x < -swipeThreshold || velocity.x < -500) {
        handlePageChange(1);
      }
      // Swipe right (previous page)
      else if (offset.x > swipeThreshold || velocity.x > 500) {
        handlePageChange(-1);
      }

      dragDirection.current = null;
    },
    [handlePageChange]
  );

  // If on home page, show HomePage
  if (isHomePage) {
    return <HomePage />;
  }

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
      case "guestbook":
        return <GuestbookPage />;
      case "mac-status":
        return <MacStatusPage />;
      default:
        return <ExperiencePage />;
    }
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
    zoomOut: {
      scale: 0.5,
      opacity: 0,
    },
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
          transition={
            zoomOut
              ? { duration: 0.2, ease: "easeInOut" }
              : { type: "spring", stiffness: 300, damping: 30, duration: 0.25 }
          }
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={isMobile ? handleDragStart : undefined}
          onDrag={isMobile ? handleDrag : undefined}
          onDragEnd={isMobile ? handleDragEnd : undefined}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          className="fixed inset-0 bg-white md:rounded-[60px] shadow-lg pt-[calc(1.5rem+env(safe-area-inset-top))] flex flex-col overflow-x-hidden"
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          {/* Scrollable content */}
          <div
            key={currentChannel}
            className="overflow-y-auto overflow-x-hidden grow px-4 md:px-12"
          >
            {getCurrentContent()}
          </div>

          {/* Navigation arrows - hidden on mobile */}
          <div className="hidden md:block absolute left-5 top-1/2 transform -translate-y-1/2 z-50">
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
          <div className="hidden md:block absolute right-5 top-1/2 transform -translate-y-1/2 z-50">
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
          <footer className="shrink-0 bg-gray-200 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] mb-12 md:mb-0 flex justify-center items-center space-x-8 md:space-x-12 mt-auto z-50">
            <button
              onClick={handleHomeClick}
              className="bg-white px-6 py-4 md:px-8 md:py-6 rounded-full shadow-lg text-xl md:text-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer active:scale-95"
            >
              Home
            </button>

            <button
              onClick={buttonAction}
              className="bg-white px-6 py-4 md:px-8 md:py-6 rounded-full shadow-lg text-xl md:text-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer active:scale-95"
            >
              {buttonText}
            </button>
          </footer>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

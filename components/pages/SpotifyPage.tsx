"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNowPlaying, type SpotifyTrack } from "@/app/actions/spotify";

// Helper function to format milliseconds to MM:SS
const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

function SpotifyPage() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const isInitialLoad = useRef(true);
  const hasLoadedOnce = useRef(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [previousTrackUrl, setPreviousTrackUrl] = useState<string | null>(null);

  // Handle mouse move for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X position within element
    const y = e.clientY - rect.top; // Mouse Y position within element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 30 degrees)
    const rotateY = ((x - centerX) / centerX) * 70;
    const rotateX = ((centerY - y) / centerY) * 70;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const data = await getNowPlaying();
        setTrack(data);

        // Set initial progress
        if (data?.progressMs !== undefined) {
          setCurrentProgress(data.progressMs);
        }

        if (isInitialLoad.current) {
          setLoading(false);
          isInitialLoad.current = false;
          hasLoadedOnce.current = true;
        }
      } catch (err) {
        console.error("Error fetching Spotify data:", err);
        setError(true);
        if (isInitialLoad.current) {
          setLoading(false);
          isInitialLoad.current = false;
          hasLoadedOnce.current = true;
        }
      }
    };

    fetchSpotifyData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchSpotifyData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Set previousTrackUrl after first load completes
  useEffect(() => {
    if (track?.songUrl && !previousTrackUrl && hasLoadedOnce.current) {
      // Set it after the initial fade-in animation completes
      const timer = setTimeout(() => {
        setPreviousTrackUrl(track.songUrl);
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [track?.songUrl, previousTrackUrl]);

  // Progress timer - updates every second
  useEffect(() => {
    // Clear existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    // Only run timer if song is playing
    if (track?.isPlaying && track?.durationMs) {
      progressInterval.current = setInterval(() => {
        setCurrentProgress((prev) => {
          const next = prev + 1000; // Add 1 second
          // Don't exceed duration
          return next < track.durationMs! ? next : track.durationMs!;
        });
      }, 1000);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [track?.isPlaying, track?.durationMs, track?.songUrl]);

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        {track?.isPlaying ? "Currently Listening" : "Last Played"}
      </h1>

      <div className="relative w-full flex justify-center ">
        <AnimatePresence>
          {loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.2 },
              }}
              className="flex flex-col items-center mb-6 max-w-md absolute"
            >
              {/* Album art skeleton - match exact sizing of real content */}
              <div
                className="p-8 w-full flex justify-center"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="relative aspect-square"
                  style={{
                    width: "min(30vw, 40vh)",
                    maxWidth: "100%",
                  }}
                >
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-full shadow-2xl"></div>
                </div>
              </div>

              {/* Text skeleton - match exact sizing */}
              <div className="w-full px-4">
                {/* Song title skeleton - matches text-2xl */}
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 max-w-md mb-2"></div>

                {/* Artist skeleton - matches text-xl */}
                <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/2 max-w-md"></div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xl text-red-600 dark:text-red-400 mb-4"
            >
              Unable to load Spotify data. Check back later!
            </motion.p>
          )}

          {!loading && !error && track && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.4, delay: 0.1 },
              }}
              className="flex flex-col items-center mb-6 max-w-md absolute"
            >
              <div
                className="p-8 w-full flex justify-center"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="relative aspect-square"
                  style={{
                    width: "min(30vw, 40vh)",
                    maxWidth: "100%",
                  }}
                >
                  <AnimatePresence initial={false}>
                    {/* Static hitbox for mouse events */}
                    <motion.div
                      key={track.songUrl}
                      initial={
                        previousTrackUrl &&
                        previousTrackUrl !== track.songUrl
                          ? { opacity: 0, x: "100%" }
                          : { opacity: 0 }
                      }
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: "-100%",
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      className="cursor-pointer absolute inset-0"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => window.open(track.songUrl, "_blank")}
                      onAnimationComplete={() => {
                        // Update previous track after slide animation completes
                        if (previousTrackUrl !== track.songUrl) {
                          setPreviousTrackUrl(track.songUrl);
                        }
                      }}
                    >
                      {/* Rotating content */}
                      <div
                        className="transition-all duration-500 ease-out relative"
                        style={{
                          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.05)`,
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={track.albumArt}
                          alt={`${track.name} album art`}
                          className="w-full h-full rounded-full shadow-2xl"
                          style={{
                            animation: "spin 6s linear infinite",
                            transform: "translateZ(20px)",
                            maskImage:
                              "radial-gradient(circle, transparent 5%, black 5%)",
                            WebkitMaskImage:
                              "radial-gradient(circle, transparent 5%, black 5%)",
                          }}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="w-full px-4">
                <h2
                  className="text-2xl font-bold truncate max-w-md cursor-pointer hover:underline text-gray-900 dark:text-gray-100"
                  onClick={() => window.open(track.songUrl, "_blank")}
                >
                  {track.name}
                </h2>
                <p
                  className="text-xl text-gray-600 dark:text-gray-400 truncate max-w-md cursor-pointer hover:underline"
                  onClick={() => window.open(track.artistUrl, "_blank")}
                >
                  {track.artist}
                </p>

                {/* Progress bar - only show if currently playing */}
                {track.isPlaying && track.durationMs && (
                  <div className="w-full max-w-md mx-auto mb-4">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>{formatTime(currentProgress)}</span>
                      <span>{formatTime(track.durationMs)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${
                            (currentProgress / track.durationMs) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {track.playedAt && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Played {new Date(track.playedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {!loading && !error && !track && (
            <motion.p
              key="no-tracks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xl text-gray-700 dark:text-gray-300 mb-6"
            >
              No recent tracks found. Check back later!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SpotifyPage;


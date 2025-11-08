"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  getGuestbookEntries,
  addGuestbookEntry,
  checkIfCanSign,
  type GuestbookEntry,
} from "@/app/actions/guestbook";

// Generate browser fingerprint
const generateFingerprint = (): string => {
  const data = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + "x" + screen.height,
    screen.colorDepth,
  ].join("|");

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

const STORAGE_KEY = "guestbook_entry_id";

// Format date as "nov 5th"
const formatDate = (date: Date) => {
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const day = date.getDate();

  // Get ordinal suffix
  const suffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${months[date.getMonth()]} ${day}${suffix(day)}`;
};

function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  const [userEntryId, setUserEntryId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
  );
  const [canSign, setCanSign] = useState(() =>
    typeof window !== "undefined" ? !localStorage.getItem(STORAGE_KEY) : true
  );
  const [fingerprint] = useState(() =>
    typeof window !== "undefined" ? generateFingerprint() : ""
  );

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    const data = await getGuestbookEntries();
    setEntries(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const storedEntryId = userEntryId;

    // Check server-side if can sign
    if (fingerprint) {
      checkIfCanSign(fingerprint).then((result) => {
        if (!result.canSign && !storedEntryId) {
          setCanSign(false);
        }
      });
    }

    // Load entries on mount - this is intentional data fetching
    // eslint-disable-next-line
    loadEntries();
  }, [fingerprint, userEntryId, loadEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSign) {
      return;
    }

    setIsSubmitting(true);

    const result = await addGuestbookEntry(message, fingerprint);

    if (result.success && result.entryId) {
      setMessage("");
      localStorage.setItem(STORAGE_KEY, result.entryId);
      setUserEntryId(result.entryId);
      setCanSign(false);
      await loadEntries();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 h-full flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Guestbook
      </h1>

      <div className="w-full flex flex-col gap-4 overflow-y-auto flex-1">
        {/* Input form at top if user can sign */}
        {canSign && (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message..."
                  maxLength={20}
                  className="w-full px-3 py-2 pr-12 border-2 border-gray-300 rounded text-lg focus:outline-none focus:border-gray-300"
                  disabled={isSubmitting}
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                  {20 - message.length}
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium whitespace-nowrap"
              >
                {isSubmitting ? "..." : "Sign"}
              </button>
            </div>
          </form>
        )}

        {/* Entries as rows */}
        {entries.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-8">
            Be the first to sign!
          </div>
        )}

        {entries.length > 0 && (
          <div className="w-full space-y-2">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="flex items-center justify-between text-gray-700 text-lg py-3 px-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <span>{entry.message}</span>
                <span className="text-sm text-gray-400 ml-4 whitespace-nowrap">
                  {formatDate(new Date(entry.createdAt))}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GuestbookPage;

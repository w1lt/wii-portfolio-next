"use client";

import { useEffect } from "react";
import { IconDownload } from "@tabler/icons-react";
import { motion } from "framer-motion";

function ResumePage() {
  useEffect(() => {
    const embedElement = document.querySelector("embed");
    if (embedElement) {
      embedElement.style.pointerEvents = "none";
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg"
    >
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Resume
      </h1>

      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/resume.jpg"
          alt="Resume Preview"
          className="w-full rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        />

        {/* Download button in top-right corner */}

        <a
          href="/whitehead_resume.pdf"
          download
          className="absolute top-4 right-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md shadow-md flex items-center space-x-2 hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 cursor-pointer"
        >
          <IconDownload size={20} />
          <span>Download</span>
        </a>
      </div>
    </motion.div>
  );
}

export default ResumePage;


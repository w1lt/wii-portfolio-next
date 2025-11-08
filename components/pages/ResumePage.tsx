"use client";

import { useState, useEffect } from "react";
import { IconDownload } from "@tabler/icons-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import react-pdf components with no SSR
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Import CSS
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

function ResumePage() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(800);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Configure PDF.js worker on client side only
    const setupPdfWorker = async () => {
      const pdfjs = await import("react-pdf");
      pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
    };
    setupPdfWorker();
    setMounted(true);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);

    // Set responsive width
    if (typeof window !== "undefined") {
      const containerWidth = Math.min(window.innerWidth - 100, 800);
      setPageWidth(containerWidth);
    }
  }

  if (!mounted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
      >
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
          Resume
        </h1>
        <div className="flex items-center justify-center h-[1000px] bg-gray-100 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
    >
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
        Resume
      </h1>

      <div className="relative">
        <div className="rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Document
            file="/Will_Whitehead_Resume.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-[1000px] bg-gray-100">
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-[1000px] bg-gray-100">
                <p className="text-red-600">Failed to load PDF</p>
              </div>
            }
          >
            {Array.from(new Array(numPages || 1), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={pageWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="mb-4"
              />
            ))}
          </Document>
        </div>

        {/* Download button in top-right corner */}
        <a
          href="/resume/pdf"
          className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md flex items-center space-x-2 hover:bg-blue-700 transition duration-300 cursor-pointer z-10"
        >
          <IconDownload size={20} />
          <span>Download</span>
        </a>
      </div>
    </motion.div>
  );
}

export default ResumePage;

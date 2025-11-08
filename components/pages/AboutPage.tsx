"use client";

import { motion } from "framer-motion";

function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg"
    >
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
        About Me
      </h1>
      <p className="text-xl text-gray-700 leading-relaxed mb-4">
        I&apos;m <span className="font-semibold">Will</span>, a Computer Science
        student at the University of Kansas with a focus on full-stack
        development, systems design, and fintech.
      </p>
      <p className="text-xl text-gray-700 leading-relaxed mb-4">
        This summer, I&apos;ll be interning at{" "}
        <span className="font-semibold">Cboe Global Markets</span>, where I&apos;ll
        help build production software for one of the world&apos;s leading financial
        exchanges.
      </p>
      <p className="text-xl text-gray-700 leading-relaxed mb-4">
        I like building tools that solve real problems, especially ones with
        business or product potential. I&apos;m always learning, experimenting, and
        looking for smart people to build with.
      </p>
    </motion.div>
  );
}

export default AboutPage;


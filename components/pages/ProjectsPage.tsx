"use client";

import { motion } from "framer-motion";
import { IconExternalLink } from "@tabler/icons-react";

export default function ProjectsPage() {
  const projects = [
    {
      name: "tickget",
      icon: "🎫",
      description: "Peer-to-peer ticket marketplace for students",
      language: "TypeScript",
      link: "https://github.com/w1lt/tickget",
    },
    {
      name: "csjobs",
      icon: "💼",
      description: "Job search platform for early-career CS students",
      language: "JavaScript",
      link: "https://github.com/w1lt/csjobs",
    },
    {
      name: "opensesame",
      icon: "🚪",
      description: "AI-powered smart doorbell with facial recognition",
      language: "Python",
      link: "https://github.com/bkfl-corp/OpenSesame",
    },
    {
      name: "hackku",
      icon: "🎯",
      description:
        "Registration & management system for 500+ hackathon attendees",
      language: "TypeScript",
      link: "https://github.com/the-hackku/hackku25-website",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-6 bg-white rounded-lg"
    >
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        Projects
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            {/* External link icon */}
            <div className="absolute top-4 right-4 text-gray-400 group-hover:text-gray-700 transition-colors">
              <IconExternalLink size={20} />
            </div>

            {/* Project name */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {project.name}
            </h2>

            {/* Icon and description */}
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">{project.icon}</span>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                {project.description}
              </p>
            </div>

            {/* Language indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  project.language === "TypeScript"
                    ? "bg-blue-500"
                    : project.language === "JavaScript"
                    ? "bg-yellow-500"
                    : project.language === "Python"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <span className="text-gray-500 text-sm">{project.language}</span>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

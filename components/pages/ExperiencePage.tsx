"use client";

import { motion } from "framer-motion";

// Reusable ExperienceCard component
interface ExperienceCardProps {
  role: string;
  company: string;
}

function ExperienceCard({ role, company }: ExperienceCardProps) {
  return (
    <div className="leading-tight">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
        {role}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 leading-tight mt-1">
        {company}
      </p>
    </div>
  );
}

// Experience data array
const experiences = [
  {
    role: "Software Engineer",
    company: "Cboe Global Markets",
    date: "Jun 2025 - Present",
  },
  {
    role: "Software Engineer Intern",
    company: "Cboe Global Markets",
    date: "Jun 2025 - Aug 2025",
  },
  {
    role: "Technology Director",
    company: "HackKU25",
    date: "May 2024 – Apr 2025",
  },
  {
    role: "Quantitative Trading Intern",
    company: "Tradebot Systems",
    date: "Jun 2024 – Jul 2024",
  },
  {
    role: "Founder",
    company: "Exodus",
    date: "Aug 2022 – Aug 2023",
  },
  {
    role: "Web Director",
    company: "ACM at KU",
    date: "Dec 2023 – May 2024",
  },
];

function ExperiencePage() {
  // Current role is the first one (index 0)
  const isCurrentRole = (index: number) => index === 0;

  return (
    <div className="max-w-4xl mx-auto p-8 h-full flex flex-col justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100"
      >
        Experience
      </motion.h1>

      <div className="relative" style={{ height: "500px" }}>
        {/* Snaking timeline SVG with rounded corners */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
        >
          {/* Curved snaking path with smooth corners */}
          <motion.path
            d="M 150 50 L 820 50 Q 850 50, 850 80 L 850 100 Q 850 130, 820 130 L 180 130 Q 150 130, 150 160 L 150 180 Q 150 210, 180 210 L 820 210 Q 850 210, 850 240 L 850 260 Q 850 290, 820 290 L 180 290 Q 150 290, 150 320 L 150 340 Q 150 370, 180 370 L 850 370"
            className="stroke-gray-300 dark:stroke-gray-600"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Dots and text paired together in SVG using foreignObject */}
          {[
            { x: 150, y: 50, isRight: false }, // Left - Cboe Software Engineer (current)
            { x: 850, y: 90, isRight: true }, // Right - Cboe Intern (middle of vertical)
            { x: 150, y: 170, isRight: false }, // Left - HackKU (middle of vertical)
            { x: 850, y: 250, isRight: true }, // Right - Tradebot (middle of vertical)
            { x: 150, y: 330, isRight: false }, // Left - Exodus (middle of vertical)
            { x: 850, y: 370, isRight: true }, // Right - ACM (end of line)
          ].map((pos, index) => (
            <g key={index}>
              {/* Dot */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="10"
                className={
                  isCurrentRole(index)
                    ? "fill-green-500 dark:fill-green-400"
                    : "fill-blue-500 dark:fill-blue-400"
                }
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2 + index * 0.15,
                  duration: 0.4,
                  type: "spring",
                }}
              >
                {isCurrentRole(index) && (
                  <animate
                    attributeName="r"
                    values="10;13;10"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
              </motion.circle>

              {/* Text paired with dot using foreignObject */}
              <foreignObject
                x={pos.isRight ? pos.x + 20 : pos.x - 520}
                y={pos.y - 30}
                width="500"
                height="60"
                style={{ overflow: "visible" }}
              >
                <motion.div
                  key={`experience-text-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
                  style={{
                    textAlign: pos.isRight ? "left" : "right",
                  }}
                >
                  <ExperienceCard
                    role={experiences[index].role}
                    company={experiences[index].company}
                  />
                </motion.div>
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default ExperiencePage;


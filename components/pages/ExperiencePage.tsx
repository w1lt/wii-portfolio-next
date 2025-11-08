"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Reusable ExperienceCard component
interface ExperienceCardProps {
  role: string;
  company: string;
  link?: string;
}

function ExperienceCard({ role, company, link }: ExperienceCardProps) {
  return (
    <div className="leading-tight">
      <h2 className="text-xl font-bold text-gray-800 leading-tight">
        {role}
      </h2>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 leading-tight mt-1 inline-block hover:text-blue-600 underline transition-colors"
        >
          {company}
        </a>
      ) : (
        <p className="text-gray-600 leading-tight mt-1">{company}</p>
      )}
    </div>
  );
}

// Experience data array
const experiences = [
  {
    role: "Software Engineer",
    company: "Cboe Global Markets",
    date: "Jun 2025 - Present",
    link: "https://cboe.com",
  },
  {
    role: "Software Engineer Intern",
    company: "Cboe Global Markets",
    date: "Jun 2025 - Aug 2025",
    link: "https://cboe.com",
  },
  {
    role: "Technology Director",
    company: "HackKU25",
    date: "May 2024 – Apr 2025",
    link: "https://hackku.org",
  },
  {
    role: "Quantitative Trading Intern",
    company: "Tradebot Systems",
    date: "Jun 2024 – Jul 2024",
    link: "https://tradebot.com",
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
    link: "https://kuacm.club",
  },
];

function ExperiencePage() {
  // Current role is the first one (index 0)
  const isCurrentRole = (index: number) => index === 0;
  
  // Control animation state
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Force animations to start from initial state on mount
    setShouldAnimate(false);
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive coordinates based on screen size
  const coords = isMobile
    ? {
        // Mobile: Shorter horizontal lines (300 to 700 instead of 150 to 850)
        path: "M 300 50 L 700 50 Q 720 50, 720 80 L 720 100 Q 720 130, 700 130 L 320 130 Q 300 130, 300 160 L 300 180 Q 300 210, 320 210 L 700 210 Q 720 210, 720 240 L 720 260 Q 720 290, 700 290 L 320 290 Q 300 290, 300 320 L 300 340 Q 300 370, 320 370 L 720 370",
        positions: [
          { x: 300, y: 50, isRight: false },
          { x: 720, y: 90, isRight: true },
          { x: 300, y: 170, isRight: false },
          { x: 720, y: 250, isRight: true },
          { x: 300, y: 330, isRight: false },
          { x: 720, y: 370, isRight: true },
        ],
        textWidth: 280,
        textOffset: 15,
      }
    : {
        // Desktop: Original wider lines
        path: "M 150 50 L 820 50 Q 850 50, 850 80 L 850 100 Q 850 130, 820 130 L 180 130 Q 150 130, 150 160 L 150 180 Q 150 210, 180 210 L 820 210 Q 850 210, 850 240 L 850 260 Q 850 290, 820 290 L 180 290 Q 150 290, 150 320 L 150 340 Q 150 370, 180 370 L 850 370",
        positions: [
          { x: 150, y: 50, isRight: false },
          { x: 850, y: 90, isRight: true },
          { x: 150, y: 170, isRight: false },
          { x: 850, y: 250, isRight: true },
          { x: 150, y: 330, isRight: false },
          { x: 850, y: 370, isRight: true },
        ],
        textWidth: 500,
        textOffset: 20,
      };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-full flex flex-col md:justify-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800 pt-4 md:pt-0"
      >
        Experience
      </motion.h1>

      {/* Mobile: Simple chronological list */}
      {isMobile && (
        <div className="space-y-6 pb-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
              className="border-l-4 border-blue-500 pl-4 py-2"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">
                    {exp.role}
                  </h2>
                  {exp.link ? (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 text-sm leading-tight mt-1 inline-block hover:text-blue-600 underline transition-colors"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm leading-tight mt-1">
                      {exp.company}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{exp.date}</p>
                </div>
                {isCurrentRole(index) && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    Current
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Desktop: Snaking timeline */}
      {!isMobile && (
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
            d={coords.path}
            className="stroke-gray-300"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Dots and text paired together in SVG using foreignObject */}
          {coords.positions.map((pos, index) => (
            <g key={index}>
              {/* Dot */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="10"
                className={
                  isCurrentRole(index)
                    ? "fill-green-500"
                    : "fill-blue-500"
                }
                initial={{ scale: 0 }}
                animate={shouldAnimate ? { scale: 1 } : { scale: 0 }}
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
                x={pos.isRight ? pos.x + coords.textOffset : pos.x - coords.textWidth - coords.textOffset}
                y={pos.y - 30}
                width={coords.textWidth}
                height="60"
                style={{ overflow: "visible" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    shouldAnimate
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
                  style={{
                    textAlign: pos.isRight ? "left" : "right",
                  }}
                >
                  <ExperienceCard
                    role={experiences[index].role}
                    company={experiences[index].company}
                    link={experiences[index].link}
                  />
                </motion.div>
              </foreignObject>
            </g>
          ))}
        </svg>
        </div>
      )}
    </div>
  );
}

export default ExperiencePage;


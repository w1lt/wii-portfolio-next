"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

interface ChannelProps {
  channel: {
    name: string;
    icon: string;
    route: string;
    gradient: string;
  };
  index: number;
  onClick: (index: number, route: string, element: HTMLElement) => void;
}

const ChannelComponent: React.FC<ChannelProps> = ({
  channel,
  index,
  onClick,
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const hoverAnimation = {
    scale: 1.01,
    y: -3,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;

    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate offset from center (-50 to 50 range)
    const x = ((e.clientX - rect.left) / rect.width) * 100 - 50;
    const y = ((e.clientY - rect.top) / rect.height) * 100 - 50;
    setMouseOffset({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  // Simple subtle gradient per channel - light mode only
  const randomGradient = useMemo(() => {
    const gradients = [
      "linear-gradient(135deg, #e5e5e5 0%, #f0f0f0 50%, #e0e0e0 100%)",
      "linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e3e3e3 100%)",
      "linear-gradient(135deg, #e2e2e2 0%, #f2f2f2 50%, #dddddd 100%)",
      "linear-gradient(135deg, #e6e6e6 0%, #f3f3f3 50%, #e1e1e1 100%)",
    ];
    return gradients[index % gradients.length];
  }, [index]);

  return (
    <motion.div
      onClick={(e) => onClick(index, channel.route, e.currentTarget)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={hoverAnimation}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative border border-gray-300 rounded-3xl shadow-lg hover:shadow-[0px_8px_12px_rgba(0,0,0,0.35)] transition-shadow duration-200 ease-out flex flex-col items-center justify-center overflow-hidden group bg-white h-full w-full cursor-pointer"
    >
      {/* Random Gray Gradient Background - Bottom Layer */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          background: randomGradient,
          zIndex: 0,
        }}
      />

      {/* CSS-Based Static Emoji Grid Background - Middle Layer */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='24' y='32' font-size='24' text-anchor='middle' fill='white' opacity='0.5'%3E${encodeURIComponent(
            channel.icon
          )}%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "48px 48px",
          zIndex: 5,
          transform: `translate(${mouseOffset.x * 0.4}px, ${
            mouseOffset.y * 0.4
          }px)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full p-4">
        <p className="text-4xl sm:text-5xl lg:text-6xl">{channel.icon}</p>
        <p className="text-sm sm:text-lg lg:text-xl font-semibold mt-2 text-center text-gray-800 group-hover:translate-y-0 transition-transform duration-300">
          {channel.name}
        </p>
      </div>
    </motion.div>
  );
};

export default ChannelComponent;


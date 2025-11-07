"use client";

import { IconBrandLinkedin, IconMoon, IconSun } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

function HomeFooter() {
  const { theme, toggleTheme } = useTheme();
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Manually format the date without a comma
      const day = now.getDate();
      const month = now.getMonth() + 1; // Month is 0-indexed
      const weekday = now.toLocaleString("en-US", { weekday: "short" });

      const formattedDate = `${weekday} ${month}/${day}`;
      setDate(formattedDate);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex justify-between w-full px-20 z-10">
        <a
          href="https://www.linkedin.com/in/willwhitehead122/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full w-20 h-20 shadow-lg flex items-center justify-center hover:scale-110 hover:ring-4 hover:ring-blue-500 hover:ring-offset-2 transition-transform cursor-pointer"
        >
          <span className="text-3xl text-opacity-100 dark:text-white">
            <IconBrandLinkedin size={32} />
          </span>
        </a>

        <button
          onClick={toggleTheme}
          className="bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full w-20 h-20 shadow-lg flex items-center justify-center hover:scale-110 hover:ring-4 hover:ring-yellow-500 hover:ring-offset-2 transition-all duration-300 cursor-pointer"
          aria-label="Toggle theme"
        >
          <span className="text-3xl text-opacity-100 dark:text-white">
            {theme === "dark" ? <IconSun size={32} /> : <IconMoon size={32} />}
          </span>
        </button>
      </div>

      <footer className="absolute bottom-0 left-0 w-full z-0">
        <div className="flex justify-between items-end">
          <div className="flex items-center">
            <div className="bg-gray-200 dark:bg-gray-800 w-[170px] h-[70px]"></div>
            <svg
              width="170"
              height="70"
              viewBox="0 0 170 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[170px] h-[70px]"
              style={{ transform: "scaleX(-1)" }}
            >
              <path
                d="M123.317 10.6215C134.082 3.68745 146.615 0 159.42 0H170L170 70H0H11.525C24.3294 70 36.863 66.3125 47.6274 59.3785L123.317 10.6215Z"
                className="fill-current text-gray-200 dark:text-gray-800"
              />
            </svg>
          </div>
          <div className="flex items-center">
            <svg
              width="170"
              height="70"
              viewBox="0 0 170 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[170px] h-[170px]"
            >
              <path
                d="M123.317 10.6215C134.082 3.68745 146.615 0 159.42 0H170L170 70H0H11.525C24.3294 70 36.863 66.3125 47.6274 59.3785L123.317 10.6215Z"
                className="fill-current text-gray-200 dark:text-gray-800"
              />
            </svg>
            <div className="bg-gray-200 dark:bg-gray-800 w-[170px] h-[70px]"></div>
          </div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 h-[90px] w-full flex items-start justify-center">
          <p className="text-4xl text-gray-400 dark:text-gray-500 font-semibold mt-4">
            {date}
          </p>
        </div>
      </footer>
    </>
  );
}

export default HomeFooter;


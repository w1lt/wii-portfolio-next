"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface SoundContextType {
  soundsEnabled: boolean;
  toggleSounds: () => void;
  playClick: () => void;
  playNextPage: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  // Audio permanently disabled
  const soundsEnabled = false;

  const toggleSounds = () => {
    // No-op - sounds permanently disabled
  };

  const playClick = () => {
    // No-op - sounds disabled
  };

  const playNextPage = () => {
    // No-op - sounds disabled
  };

  return (
    <SoundContext.Provider
      value={{
        soundsEnabled,
        toggleSounds,
        playClick,
        playNextPage,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};


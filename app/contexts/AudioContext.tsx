"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
interface AudioContextType {
  audio: HTMLAudioElement | null;
  isMusicPlaying: boolean;
  isMuted: boolean;
  toggleMusic: () => void;
  toggleMute: () => void;
  attemptAutoplay: () => Promise<void>;
  enableAudio: () => void;
}

// Create the context
const AudioContext = createContext<AudioContextType | null>(null);

// Custom hook to use the audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Provider component

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  useEffect(() => {
    if (!isAudioInitialized) {
      const audioElement = new Audio('/sounds/infantil.m4a');
      audioElement.loop = true;
      audioElement.volume = 0.5;
      setAudio(audioElement);
      setIsAudioInitialized(true);
    }

    return () => {
    };
  }, [isAudioInitialized]);

 const toggleMusic = () => {
  if (!audio) return;
  if (isMusicPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
  setIsMusicPlaying(!isMusicPlaying);
};

  const toggleMute = () => {
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
    }
  };

  const attemptAutoplay = async () => {
    if (!audio || isMusicPlaying) return;
    
    try {
      audio.muted = true;
      await audio.play();
      setTimeout(() => {
        audio.muted = false;
        setIsMusicPlaying(true);
      }, 100);
    } catch (err) {
      console.log("Autoplay attempt failed:", err);
      audio.muted = false;
    }
  };

  const enableAudio = () => {
    if (audio && audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(error => {
            console.log("Play failed:", error);
          });
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        audio,
        isMusicPlaying,
        isMuted,
        toggleMusic,
        toggleMute,
        attemptAutoplay,
        enableAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
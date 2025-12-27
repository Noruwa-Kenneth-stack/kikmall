// components/Countdown.tsx
"use client";
import React, { useEffect, useState } from "react";

interface CountdownProps {
  startDate: string; // required now
  endDate: string; // required
  onProgress?: (percent: number) => void;
}

export const Countdown: React.FC<CountdownProps> = ({
  startDate,
  endDate,
  onProgress,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const total = end - start; // total duration of the offer

    if (total <= 0) {
      onProgress?.(100);
      return;
    }

    const tick = () => {
      const now = Date.now();
      const diff = end - now; // time left
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onProgress?.(100);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });

      // progress = how far we are *inside* the offer window
      const elapsed = now - start;
      const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
      onProgress?.(percent);
    };

    tick(); // immediate first render
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate, endDate, onProgress]);

  return (
    <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
      <div className="flex gap-2 text-center">
        <div className="bg-gray-100 px-2 py-1 rounded">{timeLeft.days}</div>:
        <div className="bg-gray-100 px-2 py-1 rounded">{timeLeft.hours}</div>:
        <div className="bg-gray-100 px-2 py-1 rounded">{timeLeft.minutes}</div>:
        <div className="bg-gray-100 px-2 py-1 rounded">{timeLeft.seconds}</div>
      </div>
      <span>Remains until the end of the offer</span>
    </div>
  );
};

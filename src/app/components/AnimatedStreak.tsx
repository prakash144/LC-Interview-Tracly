"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

interface AnimatedStreakProps {
  streak: number;
}

export const AnimatedStreak = ({ streak }: AnimatedStreakProps) => {
  const [displayed, setDisplayed] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (streak <= 0) return;
    setAnimating(true);
    let start = 0;
    const duration = 600;
    const step = Math.max(1, Math.ceil(streak / 30));
    const interval = Math.floor(duration / (streak / step));

    const timer = setInterval(() => {
      start += step;
      if (start >= streak) {
        setDisplayed(streak);
        clearInterval(timer);
        setTimeout(() => setAnimating(false), 100);
      } else {
        setDisplayed(start);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [streak]);

  if (streak <= 0) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 shadow-sm transition-all duration-300 ${
      animating ? "border-warning/40 bg-warning/20 scale-105" : "border-warning/20 bg-warning/10"
    }`}>
      <Flame className={`size-4 transition-all duration-300 ${animating ? "text-warning scale-110" : "text-warning"}`} />
      <span className="text-sm font-bold tabular-nums text-warning">{displayed}</span>
      <span className="text-xs text-muted-foreground">day streak</span>
    </div>
  );
};

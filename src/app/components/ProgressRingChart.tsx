"use client";

import { memo, useEffect, useState } from "react";

interface RingSegment {
  name: string;
  total: number;
  solved: number;
  color: string;
}

interface ProgressRingChartProps {
  segments: RingSegment[];
  size?: number;
  strokeWidth?: number;
  onSegmentClick?: (name: string) => void;
}

const RING_GAP_DEG = 3;

const ProgressRingChart = memo(function ProgressRingChart({
  segments,
  size = 160,
  strokeWidth = 22,
  onSegmentClick,
}: ProgressRingChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gapLength = (RING_GAP_DEG / 360) * circumference;

  const grandTotal = segments.reduce((s, seg) => s + seg.total, 0);

  if (grandTotal === 0) {
    return (
      <div
        className="inline-flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    );
  }

  let cumulativeAngle = 0;

  return (
    <svg
      width={size}
      height={size}
      className="shrink-0 -rotate-90"
      viewBox={`0 0 ${size} ${size}`}
    >
      {segments.map((seg) => {
        const segmentAngle = (seg.total / grandTotal) * 360 - RING_GAP_DEG;
        const solvedAngle = seg.total > 0 ? (seg.solved / seg.total) * segmentAngle : 0;
        const unsolvedAngle = segmentAngle - solvedAngle;

        const solvedLen = (solvedAngle / 360) * circumference;
        const unsolvedLen = (unsolvedAngle / 360) * circumference;
        const gapLen = seg.total < grandTotal ? gapLength : 0;

        const solvedOffset = (cumulativeAngle / 360) * circumference;

        cumulativeAngle += segmentAngle + RING_GAP_DEG;

        return (
          <g
            key={seg.name}
            onClick={() => onSegmentClick?.(seg.name)}
            onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && onSegmentClick) { e.preventDefault(); onSegmentClick(seg.name); } }}
            role={onSegmentClick ? "button" : undefined}
            tabIndex={onSegmentClick ? 0 : undefined}
            aria-label={onSegmentClick ? `${seg.name}: ${seg.solved} of ${seg.total} solved` : undefined}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              opacity={0.1}
              strokeDasharray={`${solvedLen} ${gapLen} ${unsolvedLen} ${circumference - solvedLen - gapLen - unsolvedLen}`}
              strokeDashoffset={animated ? 0 : circumference}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${solvedLen} ${circumference - solvedLen}`}
              strokeDashoffset={animated ? solvedOffset : circumference}
              strokeLinecap="round"
              className={`transition-all duration-700 ease-out ${onSegmentClick ? "cursor-pointer hover:opacity-80" : ""}`}
            />
          </g>
        );
      })}
    </svg>
  );
});

export { ProgressRingChart, type RingSegment };

"use client";

import { useEffect, useState } from "react";

interface StatusSegment {
  label: string;
  value: number;
  color: string;
  lightColor: string;
}

interface ProfileStatusChartProps {
  total: number;
  solved: number;
  attempted: number;
  bookmarked: number;
}

const ProfileStatusChart = ({ total, solved, attempted, bookmarked }: ProfileStatusChartProps) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const untouched = Math.max(0, total - solved - attempted - bookmarked);

  const segments: StatusSegment[] = [
    { label: "Solved", value: solved, color: "#22c55e", lightColor: "bg-success/10 border-success/20 text-success" },
    { label: "Attempted", value: attempted, color: "#3b82f6", lightColor: "bg-info/10 border-info/20 text-info" },
    { label: "Bookmarked", value: bookmarked, color: "#f59e0b", lightColor: "bg-warning/10 border-warning/20 text-warning" },
    { label: "Untouched", value: untouched, color: "#6b7280", lightColor: "bg-secondary/50 border-border/40 text-muted-foreground" },
  ];

  const size = 164;
  const strokeWidth = 22;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;

  const grandTotal = segments.reduce((s, seg) => s + seg.value, 0);
  if (grandTotal === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-xs text-muted-foreground">No data</span>
      </div>
    );
  }

  let cumulative = 0;
  const slices = segments
    .filter((seg) => seg.value > 0)
    .map((seg) => {
      const ratio = seg.value / grandTotal;
      const angle = ratio * 360 - gap;
      const len = (angle / 360) * circumference;
      const offset = (cumulative / 360) * circumference;
      cumulative += angle + gap;
      return { ...seg, len, offset };
    });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {slices.map((seg) => (
            <circle
              key={seg.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.len} ${circumference - seg.len}`}
              strokeDashoffset={animated ? seg.offset : circumference}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              opacity={0.9}
            />
          ))}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference}`}
            opacity={0.08}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-foreground tabular-nums">{total}</span>
          <span className="text-[10px] text-muted-foreground leading-tight">total</span>
        </div>
      </div>
      <div className="space-y-2 min-w-0">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <div key={seg.label} className="flex items-center gap-2.5 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-muted-foreground min-w-20">{seg.label}</span>
              <span className="font-semibold text-foreground tabular-nums min-w-8 text-right">{seg.value}</span>
              <span className="text-xs text-muted-foreground/60 min-w-10 text-right tabular-nums">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileStatusChart;

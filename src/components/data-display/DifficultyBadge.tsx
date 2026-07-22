import { memo } from "react";

interface DifficultyBadgeProps {
  difficulty: string;
  size?: "sm" | "md";
  className?: string;
}

const colorMap: Record<string, string> = {
  easy: "text-easy bg-easy/10 border-easy/25",
  medium: "text-medium bg-medium/10 border-medium/25",
  hard: "text-hard bg-hard/10 border-hard/25",
};

const sizeMap: Record<string, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

const DifficultyBadge = memo(function DifficultyBadge({
  difficulty,
  size = "sm",
  className = "",
}: DifficultyBadgeProps) {
  const color = colorMap[difficulty.toLowerCase()] ?? "text-muted-foreground bg-secondary border-border";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-medium min-w-[72px] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${color} ${sizeMap[size]} ${className}`}
    >
      {difficulty}
    </span>
  );
});

export default DifficultyBadge;

import { memo } from "react";

interface CompanyBadgeProps {
  company: string;
  size?: "sm" | "md";
  className?: string;
}

const BADGE_COLORS: { bg: string; text: string; border: string }[] = [
  { bg: "bg-blue-500/15", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/25" },
  { bg: "bg-purple-500/15", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/25" },
  { bg: "bg-cyan-500/15", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/25" },
  { bg: "bg-pink-500/15", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/25" },
  { bg: "bg-orange-500/15", text: "text-orange-600 dark:text-orange-400", border: "border-orange-500/25" },
  { bg: "bg-teal-500/15", text: "text-teal-600 dark:text-teal-400", border: "border-teal-500/25" },
  { bg: "bg-indigo-500/15", text: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-500/25" },
  { bg: "bg-rose-500/15", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/25" },
];

const hashColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length];
  return `${c.bg} ${c.text} ${c.border}`;
};

const sizeMap: Record<string, string> = {
  sm: "size-5 text-[10px]",
  md: "size-7 text-xs",
};

const CompanyBadge = memo(function CompanyBadge({
  company,
  size = "sm",
  className = "",
}: CompanyBadgeProps) {
  if (!company) return null;

  const initial = company.charAt(0).toUpperCase();
  const color = hashColor(company);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-semibold shrink-0 ${color} ${sizeMap[size]} ${className}`}
      title={company}
      aria-label={company}
    >
      {initial}
    </span>
  );
});

export default CompanyBadge;

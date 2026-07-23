"use client";

import { memo, useState } from "react";
import CompanyBadge from "./CompanyBadge";

interface CompanyLogoProps {
  company: string;
  size?: "sm" | "md";
  className?: string;
}

const SLUG_OVERRIDES: Record<string, string> = {
  "meta": "meta",
  "ibm": "ibm",
  "ey": "ey",
  "kpmg": "kpmg",
  "pwc": "pwc",
  "zs associates": "zsa",
};

const toSlug = (name: string): string | null => {
  const lower = name.toLowerCase().trim();
  if (SLUG_OVERRIDES[lower]) return SLUG_OVERRIDES[lower];
  const slug = lower.replace(/[&'.\s]+/g, "");
  if (slug.length < 2) return null;
  return slug;
};

const sizeMap: Record<string, string> = {
  sm: "size-5",
  md: "size-7",
};

const CompanyLogo = memo(function CompanyLogo({
  company,
  size = "sm",
  className = "",
}: CompanyLogoProps) {
  const [errored, setErrored] = useState(false);

  if (!company || errored) {
    return <CompanyBadge company={company} size={size} className={className} />;
  }

  const slug = toSlug(company);
  if (!slug) {
    return <CompanyBadge company={company} size={size} className={className} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
      title={company}
      aria-label={company}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/888`}
        alt={company}
        className="size-full"
        loading="lazy"
        onError={() => setErrored(true)}
      />
    </span>
  );
});

export default CompanyLogo;

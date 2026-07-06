"use client";

import { Target, Clock, Award, ListChecks } from "lucide-react";

interface HeroCardProps {
  overallScore: number;
  level: string;
  remainingProblems: number;
  estimatedTime: string;
  selectedCompany?: string | null;
}

const levelConfig: Record<string, { label: string; color: string }> = {
  Excellent: { label: "Excellent", color: "text-success" },
  "Strong Candidate": { label: "Strong Candidate", color: "text-success" },
  "Interview Ready": { label: "Interview Ready", color: "text-warning" },
  Improving: { label: "Improving", color: "text-warning" },
  Beginner: { label: "Beginner", color: "text-muted-foreground" },
};

function getLevelConfig(level: string) {
  return levelConfig[level] ?? { label: level, color: "text-muted-foreground" };
}

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 48;
  const stroke = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "stroke-success" : score >= 50 ? "stroke-warning" : "stroke-destructive";

  return (
    <svg width={radius * 2 + stroke + 4} height={radius * 2 + stroke + 4} className="size-28 shrink-0">
      <circle cx={radius + stroke / 2 + 2} cy={radius + stroke / 2 + 2} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} />
      <circle
        cx={radius + stroke / 2 + 2}
        cy={radius + stroke / 2 + 2}
        r={radius}
        fill="none"
        className={`${color} transition-all duration-1000 ease-out`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${radius + stroke / 2 + 2} ${radius + stroke / 2 + 2})`}
      />
      <text x={radius + stroke / 2 + 2} y={radius + stroke / 2 + 2} textAnchor="middle" dominantBaseline="central" className="fill-foreground text-xl font-bold" fontSize={24}>
        {score}%
      </text>
    </svg>
  );
};

const HeroCard = ({ overallScore, level, remainingProblems, estimatedTime, selectedCompany }: HeroCardProps) => {
  const cfg = getLevelConfig(level);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card via-card/95 to-card/90 p-5 sm:p-6 transition-shadow duration-200 hover:shadow-md">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-success/5 via-success/3 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
        <ScoreRing score={overallScore} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Award className="size-4 text-muted-foreground" />
            <span className={`text-lg font-bold tracking-tight ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {selectedCompany
              ? `Your readiness for ${selectedCompany} coding interviews`
              : "Based on company coverage, topic depth, revision accuracy, and consistency across all tracked companies"}
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <ListChecks className="size-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground tabular-nums">{remainingProblems}</div>
                <div className="text-[10px] text-muted-foreground">Problems Remaining</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-zap/10">
                <Clock className="size-4 text-zap" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{estimatedTime}</div>
                <div className="text-[10px] text-muted-foreground">Estimated Time</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-info/10">
                <Target className="size-4 text-info" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {overallScore >= 80 ? "Ready" : overallScore >= 50 ? "In Progress" : "Getting Started"}
                </div>
                <div className="text-[10px] text-muted-foreground">Interview Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;

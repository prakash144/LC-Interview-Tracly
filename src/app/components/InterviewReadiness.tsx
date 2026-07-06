"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { InterviewReadinessResult } from "@/hooks/useInterviewReadiness";

interface InterviewReadinessProps {
  data: InterviewReadinessResult;
}

function safeStr(v: unknown): string {
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return "N/A";
  if (Array.isArray(v)) {
    const filtered = v.filter((x): x is string => typeof x === "string");
    return filtered.length > 0 ? filtered[0] : "N/A";
  }
  return String(v);
}

const ScoreRing = ({ score, size = "lg" }: { score: number; size?: "lg" | "sm" }) => {
  const radius = size === "lg" ? 54 : 32;
  const stroke = size === "lg" ? 8 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "stroke-success" : score >= 50 ? "stroke-warning" : "stroke-destructive";

  return (
    <svg width={radius * 2 + stroke} height={radius * 2 + stroke} className={`${size === "lg" ? "size-28" : "size-[60px]"}`}>
      <circle cx={radius + stroke / 2} cy={radius + stroke / 2} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} />
      <circle
        cx={radius + stroke / 2}
        cy={radius + stroke / 2}
        r={radius}
        fill="none"
        className={`${color} transition-all duration-1000 ease-out`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${radius + stroke / 2} ${radius + stroke / 2})`}
      />
      <text x={radius + stroke / 2} y={radius + stroke / 2 - 4} textAnchor="middle" dominantBaseline="central" className="fill-foreground text-lg font-bold" fontSize={size === "lg" ? 22 : 13}>
        {score}%
      </text>
      {size === "lg" && (
        <text x={radius + stroke / 2} y={radius + stroke / 2 + 12} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground" fontSize={8}>
          Readiness
        </text>
      )}
    </svg>
  );
};

const FactorBar = ({ label, value }: { label: string; value: number }) => {
  const color = value >= 80 ? "bg-success" : value >= 50 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-28 shrink-0 text-muted-foreground truncate" title={label}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-7 shrink-0 text-right font-semibold text-foreground tabular-nums">{value}%</span>
    </div>
  );
};

const InterviewReadiness = ({ data }: InterviewReadinessProps) => {
  const { overallScore, level, factors, companyScores, weakTopics, weakDifficulties, recommendations, weeklyReview } = data;
  const noData = companyScores.length === 0 && weakTopics.length === 0;

  const topTopic = safeStr(weeklyReview.mostPracticedTopic);
  const weakTopic = safeStr(weeklyReview.weakestTopic);

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      {noData ? (
        <div className="text-[11px] text-muted-foreground/50 text-center py-12">
          Solve problems to see your interview readiness score.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Hero: Score + Level */}
          <div className="flex items-center gap-4 sm:gap-6">
            <ScoreRing score={overallScore} />
            <div>
              <div className={`text-lg font-bold tracking-tight ${
                overallScore >= 80 ? "text-success" : overallScore >= 50 ? "text-warning" : "text-destructive"
              }`}>{level}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Based on company coverage, topic depth, revision accuracy, and consistency
              </div>
            </div>
          </div>

          {/* Factor Bars */}
          <div className="space-y-1.5">
            <FactorBar label="Company Completion" value={factors.companyCompletion} />
            <FactorBar label="Topic Coverage" value={factors.topicCoverage} />
            <FactorBar label="Difficulty Balance" value={factors.difficultyBalance} />
            <FactorBar label="Revision Completion" value={factors.revisionCompletion} />
            <FactorBar label="Consistency" value={factors.consistency} />
            <FactorBar label="Current Streak" value={factors.currentStreakScore} />
          </div>

          {/* Company Scores */}
          {companyScores.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Company Readiness</div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {companyScores.map((c) => {
                  const color = c.score >= 80 ? "bg-success" : c.score >= 50 ? "bg-warning" : "bg-destructive";
                  return (
                    <div key={c.company} className="rounded-lg border border-border bg-card/50 p-2.5 text-center">
                      <div className="text-[10px] font-semibold text-foreground truncate" title={c.company}>{c.company}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${c.score}%` }} />
                        </div>
                        <span className="text-[10px] font-bold tabular-nums text-foreground">{c.score}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weak Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-2.5">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Weak Topics</div>
              {weakTopics.length > 0 ? (
                <div className="space-y-1">
                  {weakTopics.slice(0, 4).map((t) => (
                    <div key={t.topic} className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground truncate mr-2" title={t.topic}>{safeStr(t.topic)}</span>
                      <span className={`tabular-nums font-medium ${t.completion < 30 ? "text-destructive" : t.completion < 60 ? "text-warning" : "text-success"}`}>
                        {t.completion}%
                      </span>
                    </div>
                  ))}
                  <Link
                    href="/problems"
                    className="inline-flex items-center gap-1 text-[10px] text-info hover:text-info/80 transition-colors mt-1"
                  >
                    Practice weak topics
                    <ArrowRight className="size-2.5" />
                  </Link>
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground/50 py-1">No topic data available</div>
              )}
            </div>
            <div className="rounded-lg border border-border p-2.5">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Weak Difficulties</div>
              {weakDifficulties.length > 0 ? (
                <div className="space-y-1">
                  {weakDifficulties.map((d) => (
                    <div key={d.difficulty} className="flex items-center justify-between text-[11px]">
                      <span className={`font-medium ${
                        d.difficulty === "Easy" ? "text-success" : d.difficulty === "Medium" ? "text-warning" : "text-destructive"
                      }`}>{d.difficulty}</span>
                      <span className="tabular-nums text-foreground font-medium">{d.completion}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground/50 py-1">No difficulty data</div>
              )}
            </div>
          </div>

          {/* Smart Recommendations */}
          {recommendations.length > 0 && (
            <div className="rounded-lg bg-zap/5 border border-zap/10 p-3">
              <div className="text-[10px] font-semibold text-zap uppercase tracking-wider mb-2">Smart Recommendations</div>
              <ul className="space-y-1.5">
                {recommendations.map((r) => (
                  <li key={r.topic} className="text-[11px] text-foreground flex items-start gap-1.5">
                    <span className="size-1.5 rounded-full bg-zap shrink-0 mt-1" />
                    <div>
                      <span className="font-medium">{r.count} {safeStr(r.topic)} problem{r.count > 1 ? "s" : ""}</span>
                      <span className="text-muted-foreground"> — {r.reason}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weekly Review */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Weekly Review</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Solved", value: String(weeklyReview.problemsSolved) },
                { label: "Acceptance", value: `${weeklyReview.acceptanceRate}%` },
                { label: "Best Day", value: weeklyReview.bestDay },
                { label: "Missed Days", value: String(weeklyReview.missedDays) },
                { label: "Top Topic", value: topTopic },
                { label: "Weak Topic", value: weakTopic },
                { label: "Goal", value: `${weeklyReview.goalCompletion}%` },
                { label: "Streak", value: `${data.factors.currentStreakScore}d` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-secondary/50 p-2 text-center min-w-0">
                  <div className="text-[10px] font-semibold text-foreground tabular-nums truncate" title={item.value}>{item.value}</div>
                  <div className="text-[8px] text-muted-foreground mt-0.5 truncate">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewReadiness;

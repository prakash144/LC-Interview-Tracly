"use client";

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
      <text x={radius + stroke / 2} y={radius + stroke / 2} textAnchor="middle" dominantBaseline="central" className="fill-foreground text-lg font-bold" fontSize={size === "lg" ? 22 : 13}>
        {score}%
      </text>
    </svg>
  );
};

const FactorBar = ({ label, value, weight }: { label: string; value: number; weight: string }) => {
  const color = value >= 80 ? "bg-success" : value >= 50 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-24 text-muted-foreground truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-7 text-right font-semibold text-foreground tabular-nums">{value}%</span>
      <span className="w-8 text-right text-muted-foreground/50 tabular-nums">{weight}</span>
    </div>
  );
};

const InterviewReadiness = ({ data }: InterviewReadinessProps) => {
  const { overallScore, factors, companyScores, weakTopics, weakDifficulties, recommendations, weeklyReview } = data;
  const noData = companyScores.length === 0 && weakTopics.length === 0;

  const topTopic = safeStr(weeklyReview.mostPracticedTopic);
  const weakTopic = safeStr(weeklyReview.weakestTopic);

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex size-5 items-center justify-center rounded bg-warning/10">
          <svg className="size-3 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xs font-semibold text-foreground">Interview Readiness</h2>
      </div>

      {noData ? (
        <div className="text-[11px] text-muted-foreground/50 text-center py-8">
          Solve problems to see your interview readiness score.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Overall Score + Factors */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="shrink-0 flex flex-col items-center">
              <ScoreRing score={overallScore} />
              <span className="text-[9px] text-muted-foreground mt-1">Overall</span>
            </div>
            <div className="flex-1 min-w-0 space-y-1.5 pt-1">
              <FactorBar label="Company Completion" value={factors.companyCompletion} weight="25%" />
              <FactorBar label="Topic Coverage" value={factors.topicCoverage} weight="20%" />
              <FactorBar label="Difficulty Balance" value={factors.difficultyBalance} weight="15%" />
              <FactorBar label="Revision Completion" value={factors.revisionCompletion} weight="15%" />
              <FactorBar label="Consistency" value={factors.consistency} weight="15%" />
              <FactorBar label="Current Streak" value={factors.currentStreakScore} weight="10%" />
            </div>
          </div>

          {/* Company Scores */}
          {companyScores.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {companyScores.map((c) => {
                const score = c.score;
                return (
                  <div key={c.company} className="rounded-lg border border-border bg-card/50 p-2.5 text-center">
                    <div className="text-[10px] font-semibold text-foreground truncate">{c.company}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            score >= 80 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-destructive"
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums text-foreground">{score}%</span>
                    </div>
                  </div>
                );
              })}
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
                      <span className="text-muted-foreground truncate mr-2">{safeStr(t.topic)}</span>
                      <span className={`tabular-nums font-medium ${t.completion < 30 ? "text-destructive" : t.completion < 60 ? "text-warning" : "text-success"}`}>
                        {t.completion}%
                      </span>
                    </div>
                  ))}
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

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="rounded-lg bg-zap/5 border border-zap/10 p-3">
              <div className="text-[10px] font-semibold text-zap uppercase tracking-wider mb-2">Smart Recommendations</div>
              <div className="text-[11px] text-muted-foreground mb-2">Today you should solve:</div>
              <ul className="space-y-1 mb-2">
                {recommendations.map((r) => (
                  <li key={r.topic} className="text-[11px] text-foreground flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-zap shrink-0" />
                    {r.count} {safeStr(r.topic)} problem{r.count > 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-muted-foreground">
                {recommendations.map((r) => r.reason).join(" ")}
              </div>
            </div>
          )}

          {/* Weekly Review */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Weekly Review</div>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {[
                { label: "Solved", value: String(weeklyReview.problemsSolved) },
                { label: "Acceptance", value: `${weeklyReview.acceptanceRate}%` },
                { label: "Best Day", value: weeklyReview.bestDay },
                { label: "Missed Days", value: String(weeklyReview.missedDays) },
                { label: "Top Topic", value: topTopic },
                { label: "Weak Topic", value: weakTopic },
                { label: "Goal", value: `${weeklyReview.goalCompletion}%` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-secondary/50 p-2 text-center">
                  <div className="text-[10px] font-semibold text-foreground tabular-nums truncate">{item.value}</div>
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

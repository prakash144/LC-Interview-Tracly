"use client";

import AppShell from "@/components/layout/AppShell";
import Footer from "@/app/components/Footer";
import { useCompanyReadiness } from "@/hooks/useCompanyReadiness";
import { useRevisionTracker } from "@/hooks/useRevisionTracker";
import { useInterviewReadiness } from "@/hooks/useInterviewReadiness";
import { useCalendarData } from "@/hooks/useCalendarData";
import { useGoals } from "@/hooks/useGoals";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

import CompanySelector from "@/app/components/readiness/CompanySelector";
import HeroCard from "@/app/components/readiness/HeroCard";
import ReadinessBreakdown from "@/app/components/readiness/ReadinessBreakdown";
import ActionPlan from "@/app/components/readiness/ActionPlan";
import WeakAreas from "@/app/components/readiness/WeakAreas";
import CompanyProgress from "@/app/components/readiness/CompanyProgress";
import MockInterviewSection from "@/app/components/readiness/MockInterviewSection";

const ReadinessPage = () => {
  const { auth, progress, questionsState } = useProblemWorkspaceData();
  const companyReadiness = useCompanyReadiness(progress.progressMap);
  const revisionTracker = useRevisionTracker(progress.progressMap, questionsState.questions);
  const { settings } = useGoals();
  const calendarData = useCalendarData(
    auth.user?.uid,
    progress.progressMap,
    questionsState.questions,
    "this-year"
  );

  const weeklySolved = 0;

  const interviewReadiness = useInterviewReadiness(
    progress.progressMap,
    questionsState.questions,
    companyReadiness.stats,
    revisionTracker.stats,
    calendarData.stats,
    calendarData.insights,
    settings,
    weeklySolved,
    companyReadiness.selectedCompany,
  );

  const { overallScore, level, factors, weakTopics, weakDifficulties, weakPatterns, actionPlan, remainingProblems, estimatedTime, mockReadiness } = interviewReadiness;

  return (
    <AppShell footer={<Footer />}>
      <div className="mx-auto max-w-5xl p-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Interview Readiness</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Are you ready for your target company&apos;s coding interview?
            </p>
          </div>
          <CompanySelector
            selected={companyReadiness.selectedCompany}
            onChange={companyReadiness.selectCompany}
          />
        </div>

        {!auth.user ? (
          <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">Sign in to view your readiness data.</p>
          </div>
        ) : (
          <div className="space-y-5">
            <HeroCard
              overallScore={overallScore}
              level={level}
              remainingProblems={remainingProblems}
              estimatedTime={estimatedTime}
              selectedCompany={companyReadiness.selectedCompany}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ReadinessBreakdown factors={factors} />
              <ActionPlan actions={actionPlan} />
            </div>

            <WeakAreas
              weakTopics={weakTopics}
              weakDifficulties={weakDifficulties}
              weakPatterns={weakPatterns}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <CompanyProgress
                stats={companyReadiness.stats}
                loading={companyReadiness.loading}
                selectedCompany={companyReadiness.selectedCompany}
                onSelectCompany={companyReadiness.selectCompany}
              />
              <MockInterviewSection
                items={mockReadiness}
                selectedCompany={companyReadiness.selectedCompany}
              />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default ReadinessPage;

"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/app/components/Footer";
import CompanyReadiness from "@/app/components/CompanyReadiness";
import InterviewReadiness from "@/app/components/InterviewReadiness";
import PatternCoverage from "@/app/components/PatternCoverage";
import MockInterviewReadiness from "@/app/components/MockInterviewReadiness";
import Achievements from "@/app/components/Achievements";
import { useCompanyReadiness } from "@/hooks/useCompanyReadiness";
import { useRevisionTracker } from "@/hooks/useRevisionTracker";
import { useInterviewReadiness } from "@/hooks/useInterviewReadiness";
import { useCalendarData } from "@/hooks/useCalendarData";
import { useGoals } from "@/hooks/useGoals";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

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
  );

  return (
    <AppShell footer={<Footer />}>
      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-6">
          <Link
            href="/activity"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="size-3" />
            Back to Activity
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Interview Readiness</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Measure your interview preparedness and discover what to practice next.
          </p>
        </div>

        {!auth.user ? (
          <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">Sign in to view your readiness data.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Two-column: Interview Readiness (left) + Company Readiness (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <InterviewReadiness data={interviewReadiness} />
              <CompanyReadiness
                stats={companyReadiness.stats}
                loading={companyReadiness.loading}
                selectedCompany={companyReadiness.selectedCompany}
                selectedProblems={companyReadiness.selectedProblems}
                difficultyBreakdown={companyReadiness.difficultyBreakdown}
                topicBreakdown={companyReadiness.topicBreakdown}
                solvedSet={companyReadiness.solvedSet}
                onSelectCompany={companyReadiness.selectCompany}
              />
            </div>

            {/* Two-column: Pattern Coverage + Mock Interview Readiness */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <PatternCoverage patterns={interviewReadiness.patternCoverage} />
              <MockInterviewReadiness items={interviewReadiness.mockReadiness} />
            </div>

            {/* Full-width: Achievements */}
            <Achievements achievements={interviewReadiness.achievements} />
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default ReadinessPage;

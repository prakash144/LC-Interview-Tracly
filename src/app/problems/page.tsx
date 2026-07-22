"use client";

import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ProblemWorkspace from "@/features/problems/components/ProblemWorkspace";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

const ProblemsPage = () => {
  const workspace = useProblemWorkspaceData();

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Problems"
        title="Problem Intelligence Workspace"
        description="Filter company questions, capture progress, and turn raw problem lists into a focused practice workflow."
      />
      <ProblemWorkspace workspace={workspace} />
    </AppShell>
  );
};

export default ProblemsPage;

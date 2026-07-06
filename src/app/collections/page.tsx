"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/app/components/Footer";
import PageHeader from "@/components/layout/PageHeader";
import CollectionSidebar from "@/app/components/collections/CollectionSidebar";
import CollectionView from "@/app/components/collections/CollectionView";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import { useCustomLists } from "@/hooks/useCustomLists";
import { useCollections } from "@/hooks/useCollections";

const CollectionsPage = () => {
  const workspace = useProblemWorkspaceData();
  const { auth, progress, questionsState } = workspace;
  const customListsData = useCustomLists(auth.user?.uid);
  const { collections, actions } = useCollections(
    progress.progressMap,
    customListsData.lists,
    (problemId: string) => {
      const q = questionsState.questions.find((qq) => qq.problemId === problemId);
      if (q) progress.toggleBookmarked(q);
    },
    {
      addProblem: customListsData.addProblem,
      removeProblem: customListsData.removeProblem,
      create: customListsData.create,
      rename: customListsData.rename,
      remove: customListsData.remove,
    },
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    collections.length > 0 ? collections[0].id : null,
  );

  const selectedCollection = collections.find((c) => c.id === selectedId) ?? null;

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Collections"
        title="Collections"
        description="Organize your interview preparation with collections"
      />

      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10">
        {questionsState.error && (
          <ErrorState message={questionsState.error} />
        )}

        {auth.error && typeof auth.error === "string" && (
          <ErrorState message={auth.error} />
        )}

        {customListsData.error && (
          <ErrorState message={customListsData.error} />
        )}

        {!auth.user ? (
          <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">Sign in to create and manage collections.</p>
          </div>
        ) : questionsState.loading || customListsData.loading ? (
          <LoadingState message="Loading collections..." />
        ) : (
          <div className="flex gap-6">
            <aside className="hidden sm:block w-64 shrink-0">
              <div className="sticky top-[66px] rounded-xl border border-border bg-card p-3">
                <CollectionSidebar
                  collections={collections}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onCreateCollection={actions.createCollection}
                  onRenameCollection={actions.renameCollection}
                  onDeleteCollection={actions.deleteCollection}
                />
              </div>
            </aside>

            {/* Mobile sidebar: horizontal scroll */}
            <div className="sm:hidden w-full overflow-x-auto pb-2">
              <div className="flex gap-1.5 min-w-max">
                {collections.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedId === c.id
                        ? "bg-accent text-foreground"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.icon && <span className="mr-1">{c.icon}</span>}
                    {c.name}
                    <span className="ml-1 text-muted-foreground/50">{c.count}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={async () => {
                    const name = window.prompt("Collection name:");
                    if (name?.trim()) await actions.createCollection(name.trim());
                  }}
                  className="whitespace-nowrap rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  + New
                </button>
              </div>
            </div>

            <main className="flex-1 min-w-0">
              <CollectionView
                collection={selectedCollection}
                questions={questionsState.questions}
                progressMap={progress.progressMap}
                progressLoading={progress.loading}
                progressEnabled={Boolean(auth.user)}
                onRequireAuth={auth.login}
                onToggleSolved={progress.toggleSolved}
                onToggleAttempted={progress.toggleAttempted}
                onToggleBookmarked={progress.toggleBookmarked}
                onToggleRevision={progress.toggleRevision}
                onSaveNotes={progress.saveNotes}
              />
            </main>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default CollectionsPage;

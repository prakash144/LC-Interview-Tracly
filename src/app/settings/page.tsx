"use client";

import { useCallback, useState } from "react";
import { ExternalLink, Github, Monitor, Moon, Sun, Trash2 } from "lucide-react";
import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ErrorState from "@/components/states/ErrorState";
import { SettingsSkeleton } from "@/components/states/PageSkeletons";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

const ACCENT_COLORS = [
  { label: "Green", value: "#22c55e", class: "bg-success" },
  { label: "Blue", value: "#3b82f6", class: "bg-info" },
  { label: "Purple", value: "#8b5cf6", class: "bg-purple-500" },
  { label: "Orange", value: "#f97316", class: "bg-orange-500" },
];

function getStoredAccent(): string {
  if (typeof window === "undefined") return "#22c55e";
  return localStorage.getItem("interview-tracly-accent") || "#22c55e";
}

const SettingsPage = () => {
  const { auth, progress, questionsState } = useProblemWorkspaceData();
  const { mode, setMode, effective } = useTheme();
  const [accent, setAccent] = useState<string>(getStoredAccent);

  const handleAccentChange = useCallback((color: string) => {
    setAccent(color);
    localStorage.setItem("interview-tracly-accent", color);
    document.documentElement.style.setProperty("--accent-color", color);
  }, []);

  const [heatmapVisible, setHeatmapVisible] = useState(true);

  const totalSolved = Object.values(progress.progressMap).filter((p) => p.solved).length;

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Settings"
        title="Account & Preferences"
        description="Manage your account, preferences, and application settings."
      />

      <div className="mx-auto max-w-3xl space-y-8 p-4 sm:px-6 lg:px-8 pb-10">
        {questionsState.error && (
          <ErrorState message={questionsState.error} />
        )}

        {auth.error && typeof auth.error === "string" && (
          <ErrorState message={auth.error} />
        )}

        {progress.error && (
          <ErrorState message={progress.error} />
        )}

        {progress.loading && (
          <SettingsSkeleton />
        )}

        {/* Appearance */}
        <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
          <h2 className="text-base font-semibold text-foreground mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-card-foreground">Theme</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {mode === "system"
                  ? `Following system preference (${effective === "dark" ? "Dark" : "Light"})`
                  : `Manually set to ${mode === "dark" ? "Dark" : "Light"} mode`}
              </div>
              <div className="flex gap-2 mt-3">
                {[
                  { value: "light" as const, label: "Light", icon: Sun },
                  { value: "dark" as const, label: "Dark", icon: Moon },
                  { value: "system" as const, label: "System", icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    className={`cursor-pointer flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all ${
                      mode === value
                        ? "border-success/50 bg-success/10 text-success font-medium"
                        : "border-border bg-secondary text-muted-foreground hover:border-border hover:bg-accent"
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-card-foreground">Accent Color</div>
                <div className="text-xs text-muted-foreground">Customize the primary accent color</div>
              </div>
              <div className="flex gap-1.5">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleAccentChange(c.value)}
                    className={`size-6 rounded-full cursor-pointer transition-all ${
                      accent === c.value
                        ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                        : "ring-1 ring-transparent hover:scale-110"
                    }`}
                    style={{ backgroundColor: c.value, "--tw-ring-color": c.value } as React.CSSProperties}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coding Preferences */}
        <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
          <h2 className="text-base font-semibold text-foreground mb-4">Coding Preferences</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Preferences will sync across devices once signed in. Configure your defaults below.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-card/80 p-3">
                <div className="text-xs text-muted-foreground">Default Company</div>
                <div className="text-sm text-card-foreground font-medium mt-0.5">Google</div>
              </div>
              <div className="rounded-lg border border-border bg-card/80 p-3">
                <div className="text-xs text-muted-foreground">Default Sheet</div>
                <div className="text-sm text-card-foreground font-medium mt-0.5">5. All.csv</div>
              </div>
              <div className="rounded-lg border border-border bg-card/80 p-3">
                <div className="text-xs text-muted-foreground">Default Sorting</div>
                <div className="text-sm text-card-foreground font-medium mt-0.5">Frequency</div>
              </div>
              <div className="rounded-lg border border-border bg-card/80 p-3">
                <div className="text-xs text-muted-foreground">Page Size</div>
                <div className="text-sm text-card-foreground font-medium mt-0.5">25</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
          <h2 className="text-base font-semibold text-foreground mb-4">Dashboard</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-card-foreground">Weekly Goal</div>
                <div className="text-xs text-muted-foreground">Target problems to solve per week</div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="border-border bg-secondary text-card-foreground h-8 w-8 p-0" aria-label="Decrease weekly goal">-</Button>
                <span className="w-8 text-center text-sm font-medium text-card-foreground">5</span>
                <Button type="button" variant="outline" size="sm" className="border-border bg-secondary text-card-foreground h-8 w-8 p-0" aria-label="Increase weekly goal">+</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-card-foreground">Daily Goal</div>
                <div className="text-xs text-muted-foreground">Target problems to solve per day</div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="border-border bg-secondary text-card-foreground h-8 w-8 p-0" aria-label="Decrease daily goal">-</Button>
                <span className="w-8 text-center text-sm font-medium text-card-foreground">1</span>
                <Button type="button" variant="outline" size="sm" className="border-border bg-secondary text-card-foreground h-8 w-8 p-0" aria-label="Increase daily goal">+</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-card-foreground">Heatmap Visibility</div>
                <div className="text-xs text-muted-foreground">Show activity heatmap on dashboard</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={heatmapVisible}
                onClick={() => setHeatmapVisible((v) => !v)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setHeatmapVisible((v) => !v); } }}
                className={`relative h-5 w-10 rounded-full cursor-pointer transition-colors ${
                  heatmapVisible ? "bg-success" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform ${
                    heatmapVisible ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
          <h2 className="text-base font-semibold text-foreground mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-card-foreground">Connected Account</div>
                <div className="text-xs text-muted-foreground">Signed in with Google</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{auth.user?.email || "—"}</span>
                {auth.user?.photoURL && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={auth.user.photoURL} alt="" className="size-7 rounded-full border border-border" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-card-foreground">Export Progress</div>
                <div className="text-xs text-muted-foreground">Download your progress data as JSON</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!auth.user}
                onClick={() => {
                  const data = JSON.stringify(progress.progressMap, null, 2);
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "interview-tracly-progress.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="border-border bg-secondary text-card-foreground hover:bg-accent"
              >
                Export JSON
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-card-foreground">Total Solved</div>
                <div className="text-xs text-muted-foreground">Problems solved across all datasets</div>
              </div>
              <span className="text-sm font-semibold text-success">{totalSolved}</span>
            </div>
            <div className="border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
              >
                <Trash2 className="size-4" />
                Delete Account
              </Button>
              <p className="mt-1.5 text-xs text-muted-foreground">Account deletion is not yet available.</p>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
          <h2 className="text-base font-semibold text-foreground mb-4">About</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="text-card-foreground">0.1.0</span>
            </div>
            <div className="border-t border-border" />
            <a
              href="https://github.com/prakash144/leetcode-company-wise-problems"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <Github className="size-4" />
                GitHub
              </span>
              <ExternalLink className="size-3" />
            </a>
            <div className="border-t border-border" />
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Privacy Policy</span>
              <span className="text-xs text-muted-foreground">Coming soon</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Terms of Service</span>
              <span className="text-xs text-muted-foreground">Coming soon</span>
            </div>
            <div className="border-t border-border" />
            <div className="text-muted-foreground text-xs leading-relaxed">
              Interview Tracly helps you track your coding journey and crack your dream company.
              Built with Next.js, Firebase, and Tailwind CSS.
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
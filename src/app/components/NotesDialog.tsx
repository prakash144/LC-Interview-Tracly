"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import type { Problem } from "@/lib/progressTypes";
import MarkdownRenderer from "./MarkdownRenderer";

type ViewMode = "edit" | "preview";

interface NotesDialogProps {
    problem: Problem;
    notes: string;
    disabled?: boolean;
    onSave: (problem: Problem, notes: string) => void;
    onRequireAuth?: () => void;
}

const NotesDialog = ({
                         problem,
                         notes,
                         disabled = false,
                         onSave,
                         onRequireAuth,
                     }: NotesDialogProps) => {
    const [draft, setDraft] = useState(notes);
    const [mode, setMode] = useState<ViewMode>("edit");

    useEffect(() => {
        setDraft(notes);
    }, [notes]);

    const handleOpenChange = (open: boolean) => {
        if (open && disabled) {
            onRequireAuth?.();
        }
    };

    const handleSave = () => {
        if (disabled) {
            onRequireAuth?.();
            return;
        }

        onSave(problem, draft);
    };

    const hasNotes = notes.trim().length > 0;

    return (
        <Dialog.Root onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-xs border transition-all ${
                        hasNotes
                            ? "border-success/50 bg-success/10 text-success hover:bg-success/20 hover:text-success"
                            : "text-foreground hover:text-foreground border-border bg-secondary hover:bg-accent"
                    }`}
                >
                    {hasNotes && <span className="size-1.5 rounded-full bg-success animate-pulse" />}
                    Notes
                </Button>
            </Dialog.Trigger>
            {!disabled && (
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-background/80 z-40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 max-w-2xl w-full bg-card border border-border text-foreground p-6 rounded-lg -translate-x-1/2 -translate-y-1/2 z-50">
                        <Dialog.Title className="text-lg font-semibold mb-3">
                            Notes
                        </Dialog.Title>

                        <div className="flex gap-1 mb-3 border-b border-border pb-2">
                            <button
                                type="button"
                                onClick={() => setMode("edit")}
                                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                                    mode === "edit"
                                        ? "bg-accent text-accent-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("preview")}
                                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                                    mode === "preview"
                                        ? "bg-accent text-accent-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Preview
                            </button>
                        </div>

                        {mode === "edit" ? (
                            <textarea
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                maxLength={4000}
                                aria-label="Notes"
                                className="w-full h-60 resize-none rounded-md border border-border bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
                                placeholder={`Write markdown notes for ${problem.title}...`}
                            />
                        ) : (
                            <div className="w-full min-h-60 max-h-96 overflow-y-auto rounded-md border border-border bg-secondary p-3 text-sm">
                                <MarkdownRenderer content={draft || "*No notes yet*"} />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <Dialog.Close asChild>
                                <Button
                                    variant="outline"
                                    className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent"
                                >
                                    Close
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                                <Button
                                    onClick={handleSave}
                                    variant="outline"
                                    className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent"
                                >
                                    Save
                                </Button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            )}
        </Dialog.Root>
    );
};

export default NotesDialog;

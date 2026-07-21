"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ResourceNotesDialogProps {
  resourceId: string;
  resourceTitle: string;
  notes: string;
  disabled?: boolean;
  onSave: (resourceId: string, notes: string) => void;
  onRequireAuth?: () => void;
}

const ResourceNotesDialog = ({
  resourceId,
  resourceTitle,
  notes,
  disabled = false,
  onSave,
  onRequireAuth,
}: ResourceNotesDialogProps) => {
  const [draft, setDraft] = useState(notes);

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
    onSave(resourceId, draft);
  };

  const hasNotes = notes.trim().length > 0;

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
            hasNotes
              ? "bg-success/10 text-success hover:bg-success/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <FileText className="size-3" />
          {hasNotes ? "Notes" : "Add Notes"}
        </button>
      </Dialog.Trigger>
      {!disabled && (
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-w-lg w-full bg-card border border-border text-foreground p-6 rounded-lg -translate-x-1/2 -translate-y-1/2 z-50">
            <Dialog.Title className="text-base font-semibold mb-1">
              Personal Notes
            </Dialog.Title>
            <p className="text-xs text-muted-foreground mb-4 truncate">{resourceTitle}</p>

            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={4000}
              aria-label="Personal notes"
              className="w-full h-48 resize-none rounded-md border border-border bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
              placeholder="Write your personal notes, takeaways, and key learnings..."
            />

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

export default ResourceNotesDialog;

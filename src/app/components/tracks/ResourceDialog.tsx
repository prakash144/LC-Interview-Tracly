"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2 } from "lucide-react";
import type { DifficultyLevel, ResourceLink, LinkType } from "@/lib/knowledgeBase";
import { LINK_TYPE_ICONS, LINK_LABELS, COMPANIES } from "@/lib/knowledgeBase";

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id?: string;
    title: string;
    company: string;
    difficulty: DifficultyLevel;
    tags: string[];
    resourceLinks: ResourceLink[];
    askedAt: string;
    notes: string;
  };
  onSave: (data: {
    title: string;
    company: string;
    difficulty: DifficultyLevel;
    tags: string[];
    resourceLinks: ResourceLink[];
    askedAt: string;
    notes: string;
  }) => void;
}

const linkTypes: LinkType[] = ["youtube", "blog", "website", "github", "article", "course", "other"];

const ResourceDialog = ({ open, onOpenChange, initialData, onSave }: ResourceDialogProps) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Medium");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<ResourceLink[]>([]);
  const [askedAt, setAskedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCompany(initialData.company);
      setDifficulty(initialData.difficulty);
      setTags(initialData.tags);
      setLinks(initialData.resourceLinks);
      setAskedAt(initialData.askedAt);
      setNotes(initialData.notes);
      setTagsInput(initialData.tags.join(", "));
    } else {
      setTitle("");
      setCompany("");
      setDifficulty("Medium");
      setTags([]);
      setTagsInput("");
      setLinks([{ type: "youtube", url: "", label: "" }]);
      setAskedAt("");
      setNotes("");
    }
  }, [initialData, open]);

  const filteredCompanies = COMPANIES.filter(
    (c) => c.toLowerCase().includes(companySearch.toLowerCase())
  );

  const handleTagsBlur = () => {
    setTags(
      tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
  };

  const addLink = () => {
    setLinks([...links, { type: "youtube", url: "", label: "" }]);
  };

  const updateLink = (index: number, field: keyof ResourceLink, value: string) => {
    setLinks(links.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      company: company || "General",
      difficulty,
      tags: tags.length > 0 ? tags : ["General"],
      resourceLinks: links.filter((l) => l.url.trim()),
      askedAt,
      notes,
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto bg-card border border-border text-foreground p-6 rounded-xl -translate-x-1/2 -translate-y-1/2 z-50">
          <Dialog.Title className="text-lg font-semibold mb-1">
            {initialData ? "Edit Resource" : "Add Resource"}
          </Dialog.Title>
          <p className="text-xs text-muted-foreground mb-5">
            {initialData ? "Update the interview question details." : "Add an interview question for your study track."}
          </p>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Question / Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design Google Pay"
                className="h-9 text-sm bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Company */}
            <div className="relative">
              <label className="text-xs font-medium text-foreground mb-1 block">Company</label>
              <Input
                value={companySearch || company}
                onChange={(e) => { setCompanySearch(e.target.value); setShowCompanyDropdown(true); setCompany(""); }}
                onFocus={() => setShowCompanyDropdown(true)}
                onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 200)}
                placeholder="Search or type company name"
                className="h-9 text-sm bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              {showCompanyDropdown && filteredCompanies.length > 0 && (
                <div className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto rounded-md bg-card border border-border shadow-lg">
                  {filteredCompanies.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onMouseDown={() => { setCompany(c); setCompanySearch(c); setShowCompanyDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors ${
                        company === c ? "bg-accent font-semibold" : ""
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty + Asked At */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Difficulty</label>
                <div className="flex gap-1.5">
                  {(["Easy", "Medium", "Hard"] as DifficultyLevel[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                        difficulty === d
                          ? d === "Easy"
                            ? "bg-easy/20 text-easy border border-easy/30"
                            : d === "Medium"
                              ? "bg-medium/20 text-medium border border-medium/30"
                              : "bg-hard/20 text-hard border border-hard/30"
                          : "bg-secondary text-muted-foreground border border-border hover:bg-accent"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Asked At</label>
                <Input
                  value={askedAt}
                  onChange={(e) => setAskedAt(e.target.value)}
                  placeholder="e.g. 2024-03 or Recent"
                  className="h-9 text-sm bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Tags (comma-separated)</label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onBlur={handleTagsBlur}
                placeholder="e.g. Payment, Fintech, Distributed Systems"
                className="h-9 text-sm bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] text-muted-foreground border border-border">
                      {tag}
                      <button type="button" onClick={() => { const t = [...tags]; t.splice(i, 1); setTags(t); setTagsInput(t.join(", ")); }} className="hover:text-foreground">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Resource Links */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-foreground">Resource Links</label>
                <button type="button" onClick={addLink} className="text-[10px] text-info hover:text-info/80 flex items-center gap-0.5">
                  <Plus className="size-3" /> Add Link
                </button>
              </div>
              <div className="space-y-2">
                {links.map((link, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <select
                      value={link.type}
                      onChange={(e) => updateLink(i, "type", e.target.value as LinkType)}
                      className="h-8 rounded-md border border-border bg-secondary text-[10px] text-foreground px-1.5 outline-none"
                    >
                      {linkTypes.map((lt) => (
                        <option key={lt} value={lt}>{LINK_TYPE_ICONS[lt]} {LINK_LABELS[lt]}</option>
                      ))}
                    </select>
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      placeholder="URL"
                      className="h-8 text-xs flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Input
                      value={link.label}
                      onChange={(e) => updateLink(i, "label", e.target.value)}
                      placeholder="Label"
                      className="h-8 text-xs w-28 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <button type="button" onClick={() => removeLink(i)} className="p-1 text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Notes / Key Points</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Key concepts, approach, and important considerations..."
                className="w-full resize-none rounded-md border border-border bg-secondary p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
            <Dialog.Close asChild>
              <Button variant="outline" className="text-sm text-foreground border-border bg-secondary hover:bg-accent">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
              className="text-sm bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
            >
              {initialData ? "Update" : "Add Resource"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ResourceDialog;

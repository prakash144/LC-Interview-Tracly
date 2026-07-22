"use client";

import { Check, ChevronDown, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TopicSelector from "@/app/components/TopicSelector";
import CompanySelector from "@/app/components/CompanySelector";
import type { ProblemStatusFilter } from "@/features/problems/hooks/useFilteredProblems";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CollectionFilterBarProps {
    selectedDifficulty: string;
    onDifficultySelect: (difficulty: string) => void;
    selectedTopic: string[];
    onTopicSelect: (topics: string[]) => void;
    selectedStatus: ProblemStatusFilter;
    onStatusSelect: (status: ProblemStatusFilter) => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onResetFilters: () => void;
    hasActiveFilters: boolean;
    selectedCompany: string;
    onCompanySelect: (company: string) => void;
    frequencyFilter: string;
    onFrequencyFilter: (frequency: string) => void;
    notesFilter: boolean | null;
    onNotesFilter: (value: boolean | null) => void;
    revisionFilter: boolean | null;
    onRevisionFilter: (value: boolean | null) => void;
}

const CollectionFilterBar = ({
    selectedDifficulty,
    onDifficultySelect,
    selectedTopic,
    onTopicSelect,
    selectedStatus,
    onStatusSelect,
    searchTerm,
    onSearchChange,
    onResetFilters,
    hasActiveFilters,
    selectedCompany,
    onCompanySelect,
    frequencyFilter,
    onFrequencyFilter,
    notesFilter,
    onNotesFilter,
    revisionFilter,
    onRevisionFilter,
}: CollectionFilterBarProps) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    const difficulties = ["Easy", "Medium", "Hard"];
    const statusOptions: { label: string; value: ProblemStatusFilter }[] = [
        { label: "All statuses", value: "all" },
        { label: "Solved", value: "solved" },
        { label: "Attempted", value: "attempted" },
        { label: "Unsolved", value: "unsolved" },
        { label: "Favorites", value: "bookmarked" },
        { label: "Revision", value: "revision" },
    ];
    const selectedStatusLabel =
        statusOptions.find((option) => option.value === selectedStatus)?.label ?? "Status";

    const frequencies = ["High", "Medium", "Low"];

    return (
        <div className="rounded-lg border border-border/70 bg-card/90 p-3 shadow-sm backdrop-blur">
            <div className="mb-3 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-md border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                    <SlidersHorizontal className="size-3" />
                    Collection filters
                </div>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-8 rounded-md border-border/70 bg-background/75 px-2.5 text-xs text-foreground shadow-sm transition-all hover:border-foreground/15 hover:bg-accent"
                        >
                            {selectedDifficulty || "Difficulty"} <ChevronDown size={12} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        {difficulties.map((item) => (
                            <DropdownMenuItem
                                key={item}
                                className={`hover:bg-accent cursor-pointer text-xs ${
                                    selectedDifficulty === item ? "bg-secondary font-semibold text-success" : ""
                                }`}
                                onClick={() =>
                                    onDifficultySelect(selectedDifficulty === item ? '' : item)
                                }
                            >
                                {selectedDifficulty === item && <Check className="mr-2 size-3 text-success" />}
                                {item}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <TopicSelector selectedTopics={selectedTopic} onTopicChange={onTopicSelect} />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-8 rounded-md border-border/70 bg-background/75 px-2.5 text-xs text-foreground shadow-sm transition-all hover:border-foreground/15 hover:bg-accent"
                        >
                            {selectedStatusLabel} <ChevronDown size={12} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        {statusOptions.map((item) => (
                            <DropdownMenuItem
                                key={item.value}
                                className={`hover:bg-accent cursor-pointer text-xs ${
                                    selectedStatus === item.value ? "bg-secondary font-semibold text-success" : ""
                                }`}
                                onClick={() => onStatusSelect(item.value)}
                            >
                                {selectedStatus === item.value && <Check className="mr-2 size-3 text-success" />}
                                {item.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <CompanySelector
                    selectedCompanies={selectedCompany}
                    onCompanyChange={onCompanySelect}
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-8 rounded-md border-border/70 bg-background/75 px-2.5 text-xs text-foreground shadow-sm transition-all hover:border-foreground/15 hover:bg-accent"
                        >
                            {frequencyFilter || "Frequency"} <ChevronDown size={12} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        {frequencies.map((item) => (
                            <DropdownMenuItem
                                key={item}
                                className={`hover:bg-accent cursor-pointer text-xs ${
                                    frequencyFilter === item ? "bg-secondary font-semibold text-success" : ""
                                }`}
                                onClick={() =>
                                    onFrequencyFilter(frequencyFilter === item ? '' : item)
                                }
                            >
                                {frequencyFilter === item && <Check className="mr-2 size-3 text-success" />}
                                {item}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-8 rounded-md border-border/70 bg-background/75 px-2.5 text-xs text-foreground shadow-sm transition-all hover:border-foreground/15 hover:bg-accent"
                        >
                            {notesFilter === null ? "Notes" : notesFilter ? "Has Notes" : "No Notes"} <ChevronDown size={12} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer text-xs ${notesFilter === null ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onNotesFilter(null)}
                        >
                            {notesFilter === null && <Check className="mr-2 size-3 text-success" />}
                            All
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer text-xs ${notesFilter === true ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onNotesFilter(true)}
                        >
                            {notesFilter === true && <Check className="mr-2 size-3 text-success" />}
                            Has Notes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer text-xs ${notesFilter === false ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onNotesFilter(false)}
                        >
                            {notesFilter === false && <Check className="mr-2 size-3 text-success" />}
                            No Notes
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-8 rounded-md border-border/70 bg-background/75 px-2.5 text-xs text-foreground shadow-sm transition-all hover:border-foreground/15 hover:bg-accent"
                        >
                            {revisionFilter === null ? "Revision" : revisionFilter ? "Due Revision" : "No Revision"} <ChevronDown size={12} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer text-xs ${revisionFilter === null ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onRevisionFilter(null)}
                        >
                            {revisionFilter === null && <Check className="mr-2 size-3 text-success" />}
                            All
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer text-xs ${revisionFilter === true ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onRevisionFilter(true)}
                        >
                            {revisionFilter === true && <Check className="mr-2 size-3 text-success" />}
                            Due Revision
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer text-xs ${revisionFilter === false ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onRevisionFilter(false)}
                        >
                            {revisionFilter === false && <Check className="mr-2 size-3 text-success" />}
                            No Revision
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    type="button"
                    variant="outline"
                    disabled={!hasActiveFilters}
                    onClick={onResetFilters}
                    className="h-8 rounded-md border-border/70 bg-background/75 px-2.5 text-xs text-foreground shadow-sm transition-all hover:border-foreground/15 hover:bg-accent"
                >
                    <RotateCcw size={12} />
                    Reset
                </Button>
            </div>

            <div className="relative mt-3 w-full sm:w-[300px]">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search questions"
                    aria-label="Search questions"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-9 w-full border-border/70 bg-background/75 pl-8 text-xs text-foreground shadow-sm placeholder:text-muted-foreground"
                />
            </div>
        </div>
    );
};

export default CollectionFilterBar;

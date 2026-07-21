"use client";

import { ChevronDown, RotateCcw } from "lucide-react";
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
        <div className="flex flex-col gap-3 py-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                        >
                            {selectedDifficulty || "Difficulty"} <ChevronDown size={16} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        {difficulties.map((item) => (
                            <DropdownMenuItem
                                key={item}
                                className={`hover:bg-accent cursor-pointer ${
                                    selectedDifficulty === item ? "bg-secondary font-semibold text-success" : ""
                                }`}
                                onClick={() =>
                                    onDifficultySelect(selectedDifficulty === item ? '' : item)
                                }
                            >
                                {selectedDifficulty === item && <span className="mr-2">✅</span>}
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
                            className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                        >
                            {selectedStatusLabel} <ChevronDown size={16} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        {statusOptions.map((item) => (
                            <DropdownMenuItem
                                key={item.value}
                                className={`hover:bg-accent cursor-pointer ${
                                    selectedStatus === item.value ? "bg-secondary font-semibold text-success" : ""
                                }`}
                                onClick={() => onStatusSelect(item.value)}
                            >
                                {selectedStatus === item.value && <span className="mr-2">✅</span>}
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
                            className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                        >
                            {frequencyFilter || "Frequency"} <ChevronDown size={16} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        {frequencies.map((item) => (
                            <DropdownMenuItem
                                key={item}
                                className={`hover:bg-accent cursor-pointer ${
                                    frequencyFilter === item ? "bg-secondary font-semibold text-success" : ""
                                }`}
                                onClick={() =>
                                    onFrequencyFilter(frequencyFilter === item ? '' : item)
                                }
                            >
                                {frequencyFilter === item && <span className="mr-2">✅</span>}
                                {item}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                        >
                            {notesFilter === null ? "Notes" : notesFilter ? "Has Notes" : "No Notes"} <ChevronDown size={16} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer ${notesFilter === null ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onNotesFilter(null)}
                        >
                            {notesFilter === null && <span className="mr-2">✅</span>}
                            All
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer ${notesFilter === true ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onNotesFilter(true)}
                        >
                            {notesFilter === true && <span className="mr-2">✅</span>}
                            Has Notes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer ${notesFilter === false ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onNotesFilter(false)}
                        >
                            {notesFilter === false && <span className="mr-2">✅</span>}
                            No Notes
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                        >
                            {revisionFilter === null ? "Revision" : revisionFilter ? "Due Revision" : "No Revision"} <ChevronDown size={16} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border-border text-foreground">
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer ${revisionFilter === null ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onRevisionFilter(null)}
                        >
                            {revisionFilter === null && <span className="mr-2">✅</span>}
                            All
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer ${revisionFilter === true ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onRevisionFilter(true)}
                        >
                            {revisionFilter === true && <span className="mr-2">✅</span>}
                            Due Revision
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={`hover:bg-accent cursor-pointer ${revisionFilter === false ? "bg-secondary font-semibold text-success" : ""}`}
                            onClick={() => onRevisionFilter(false)}
                        >
                            {revisionFilter === false && <span className="mr-2">✅</span>}
                            No Revision
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    type="button"
                    variant="outline"
                    disabled={!hasActiveFilters}
                    onClick={onResetFilters}
                    className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                >
                    <RotateCcw size={16} />
                    Reset
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search questions..."
                    aria-label="Search questions"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full text-sm bg-secondary border-border text-foreground placeholder:text-muted-foreground sm:w-[280px]"
                />
            </div>
        </div>
    );
};

export default CollectionFilterBar;

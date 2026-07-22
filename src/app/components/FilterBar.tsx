"use client";

import { CalendarDays, Check, ChevronDown, Database, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TopicSelector from "./TopicSelector";
import CompanySelector from "./CompanySelector";
import type { ProblemStatusFilter } from "@/features/problems/hooks/useFilteredProblems";
import type { Collection } from "@/hooks/useCollections";
import { cn } from "@/lib/utils";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterBarProps {
    selectedCompany: string;
    onCompanySelect: (company: string) => void;
    onListSelect: (list: string) => void;
    selectedList: string;
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
    lastUpdated?: string | null;
    selectedCollectionId?: string;
    onCollectionFilterChange?: (collectionId: string) => void;
    collections?: Collection[];
}

const FilterBar = ({
                       selectedCompany,
                       onCompanySelect,
                       onListSelect,
                       selectedList,
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
                       lastUpdated,
                       selectedCollectionId = "",
                       onCollectionFilterChange,
                       collections = [],
                   }: FilterBarProps) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    const listOptions = [
        { label: "Last 30 Days", value: "1. Thirty Days.csv" },
        { label: "Last 3 Months", value: "2. Three Months.csv" },
        { label: "Last 6 Months", value: "3. Six Months.csv" },
        { label: "More Than 6 Months", value: "4. More Than Six Months.csv" },
        { label: "All Time", value: "5. All.csv" },
    ];

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

    const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
    const triggerClass = "h-8 rounded-md border-border/70 bg-background/75 px-2.5 text-xs text-foreground shadow-sm transition-all hover:border-foreground/15 hover:bg-accent";
    const quickStatuses: { label: string; value: ProblemStatusFilter }[] = [
        { label: "All", value: "all" },
        { label: "Unsolved", value: "unsolved" },
        { label: "Attempted", value: "attempted" },
        { label: "Solved", value: "solved" },
        { label: "Revision", value: "revision" },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-border/70 bg-card/90 p-3 shadow-sm backdrop-blur">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-md border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                                <SlidersHorizontal className="size-3" />
                                Smart filters
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/65 px-2.5 py-1 text-[11px] text-muted-foreground">
                                <Database className="size-3" />
                                {selectedCompany}
                            </div>
                            <div className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/65 px-2.5 py-1 text-[11px] text-muted-foreground">
                                <CalendarDays className="size-3" />
                                Updated {lastUpdated ?? "Loading..."}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                    {/* List Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className={triggerClass}
                            >
                                {selectedList ? listOptions.find(o => o.value === selectedList)?.label : "Lists"} <ChevronDown size={12} className="ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border border-border text-foreground min-w-36">
                            {listOptions.map(({ label, value }) => (
                                <DropdownMenuItem
                                    key={value}
                                    className={`hover:bg-accent cursor-pointer text-xs ${
                                        selectedList === value ? "bg-secondary font-semibold text-success" : ""
                                    }`}
                                    onClick={() => onListSelect(value)}
                                >
                                    {selectedList === value && <Check className="mr-2 size-3 text-success" />}
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Difficulty Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className={triggerClass}
                            >
                                {selectedDifficulty || "Difficulty"} <ChevronDown size={12} className="ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border text-foreground min-w-28">
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

                    {/* Topic Selector */}
                    <TopicSelector selectedTopics={selectedTopic} onTopicChange={onTopicSelect} />

                    {/* Status Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className={triggerClass}
                            >
                                {selectedStatusLabel} <ChevronDown size={12} className="ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border text-foreground min-w-32">
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

                    {/* Collection Filter Dropdown */}
                    {collections.length > 0 && onCollectionFilterChange && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={triggerClass}
                                >
                                    {selectedCollection ? (
                                        <><span className="mr-1">{selectedCollection.icon}</span>{selectedCollection.name}</>
                                    ) : "Collection"} <ChevronDown size={12} className="ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-card border-border text-foreground max-h-60 overflow-y-auto min-w-40">
                                <DropdownMenuItem
                                    className={`hover:bg-accent cursor-pointer text-xs ${
                                        !selectedCollectionId ? "bg-secondary font-semibold text-success" : ""
                                    }`}
                                    onClick={() => onCollectionFilterChange("")}
                                >
                                    {!selectedCollectionId && <Check className="mr-2 size-3 text-success" />}
                                    All Collections
                                </DropdownMenuItem>
                                {collections.map((c) => (
                                    <DropdownMenuItem
                                        key={c.id}
                                        className={`hover:bg-accent cursor-pointer text-xs ${
                                            selectedCollectionId === c.id ? "bg-secondary font-semibold text-success" : ""
                                        }`}
                                        onClick={() => onCollectionFilterChange(
                                            selectedCollectionId === c.id ? "" : c.id
                                        )}
                                    >
                                        {selectedCollectionId === c.id && <Check className="mr-2 size-3 text-success" />}
                                        <span className="mr-1.5">{c.icon}</span>
                                        {c.name}
                                        <span className="ml-1 text-muted-foreground/50 text-[10px]">{c.count}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Company Selector */}
                    <CompanySelector
                        selectedCompanies={selectedCompany}
                        onCompanyChange={onCompanySelect}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        disabled={!hasActiveFilters}
                        onClick={onResetFilters}
                        className={triggerClass}
                    >
                        <RotateCcw size={12} className="mr-1" />
                        Reset
                    </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {quickStatuses.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => onStatusSelect(item.value)}
                                    className={cn(
                                        "h-7 rounded-md border px-2.5 text-[11px] font-medium transition-all",
                                        selectedStatus === item.value
                                            ? "border-success/40 bg-success/15 text-success shadow-sm"
                                            : "border-border/60 bg-background/55 text-muted-foreground hover:border-foreground/15 hover:text-foreground"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                </div>

                {/* Search + Updated */}
                <div className="relative w-full xl:w-72">
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
            </div>
        </div>
    );
};

export default FilterBar;

"use client";

import { ChevronDown, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TopicSelector from "./TopicSelector";
import CompanySelector from "./CompanySelector";
import type { ProblemStatusFilter } from "@/features/problems/hooks/useFilteredProblems";
import type { Collection } from "@/hooks/useCollections";

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

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-background border-y border-border">
            <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                    {/* List Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-7 text-xs text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
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
                                    {selectedList === value && <span className="mr-2">✅</span>}
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
                                className="h-7 text-xs text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
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
                                    {selectedDifficulty === item && <span className="mr-2">✅</span>}
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
                                className="h-7 text-xs text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
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
                                    {selectedStatus === item.value && <span className="mr-2">✅</span>}
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
                                    className="h-7 text-xs text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
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
                                    {!selectedCollectionId && <span className="mr-2">✅</span>}
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
                                        {selectedCollectionId === c.id && <span className="mr-2">✅</span>}
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
                        className="h-7 text-xs text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                    >
                        <RotateCcw size={12} className="mr-1" />
                        Reset
                    </Button>
                </div>

                {/* Search + Updated */}
                <div className="flex items-center gap-3">
                    <div className="text-success font-bold text-[11px] whitespace-nowrap">
                        <span aria-hidden="true">🧠</span> Updated {lastUpdated ?? "Loading..."}
                    </div>
                    <Input
                        placeholder="Search questions"
                        aria-label="Search questions"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="h-7 w-44 text-xs bg-secondary border-border text-foreground placeholder:text-muted-foreground lg:w-56"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;

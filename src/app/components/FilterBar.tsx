"use client";

import { ChevronDown, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TopicSelector from "./TopicSelector";
import CompanySelector from "./CompanySelector";
import type { ProblemStatusFilter } from "@/features/problems/hooks/useFilteredProblems";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CollectionOption {
  id: string;
  name: string;
  icon?: string;
}

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
    collectionOptions?: CollectionOption[];
    selectedCollection?: string | null;
    onCollectionSelect?: (collectionId: string | null) => void;
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
    collectionOptions,
    selectedCollection,
    onCollectionSelect,
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

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:px-8 bg-background border-y border-border lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
                {/* List Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                        >
                            Lists <ChevronDown size={16} className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-card border border-border text-foreground">
                        {listOptions.map(({ label, value }) => (
                            <DropdownMenuItem
                                key={value}
                                className={`hover:bg-accent cursor-pointer ${
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

                {/* Topic Selector */}
                <div className="flex items-center gap-4">
                    <TopicSelector selectedTopics={selectedTopic} onTopicChange={onTopicSelect} />
                </div>

                {/* Status Dropdown */}
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

                {/* Collection Dropdown */}
                {collectionOptions && onCollectionSelect && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                            >
                                {selectedCollection
                                    ? collectionOptions.find((c) => c.id === selectedCollection)?.name || "Collection"
                                    : "Collection"} <ChevronDown size={16} className="ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-card border-border text-foreground max-h-60 overflow-y-auto">
                            <DropdownMenuItem
                                className={`hover:bg-accent cursor-pointer ${!selectedCollection ? "bg-secondary font-semibold text-success" : ""}`}
                                onClick={() => onCollectionSelect(null)}
                            >
                                {!selectedCollection && <span className="mr-2">✅</span>}
                                All Collections
                            </DropdownMenuItem>
                            {collectionOptions.map((item) => (
                                <DropdownMenuItem
                                    key={item.id}
                                    className={`hover:bg-accent cursor-pointer ${
                                        selectedCollection === item.id ? "bg-secondary font-semibold text-success" : ""
                                    }`}
                                    onClick={() => onCollectionSelect(selectedCollection === item.id ? null : item.id)}
                                >
                                    {selectedCollection === item.id && <span className="mr-2">✅</span>}
                                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                                    {item.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

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

                {/* Company Selector */}
                <div className="flex items-center gap-4">
                    <CompanySelector
                        selectedCompanies={selectedCompany}
                        onCompanyChange={onCompanySelect}
                    />
                </div>
            </div>

            {/* Search */}
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {/* Last Updated Info */}
                <div className="text-success font-bold text-xs sm:mr-2">
                    <span aria-hidden="true">🧠</span> Problem Set – Updated on {lastUpdated ?? "Loading..."}
                </div>

                {/* Search */}
                <Input
                    placeholder="Search questions"
                    aria-label="Search questions"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full text-sm bg-secondary border-border text-foreground placeholder:text-muted-foreground sm:w-[240px]"
                />
            </div>
        </div>
    );
};

export default FilterBar;

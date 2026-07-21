"use client";
import React, { useEffect, useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

// Define types
type TopicCategory = {
    [category: string]: string[];
};

const topics: TopicCategory = {
    "Core Data Structures & Algorithms": [
        "Array", "String", "Hash Table", "Dynamic Programming", "Sorting",
        "Binary Search", "Stack", "Queue", "Recursion", "Divide and Conquer",
        "Memoization", "Bitmask", "Trie", "Bit Manipulation", "Heap (Priority Queue)",
        "Counting", "Sliding Window", "Two Pointers", "Prefix Sum", "Linked List",
        "Binary Indexed Tree", "Segment Tree", "Binary Tree", "Binary Search Tree", "Tree"
    ],
    "Algorithmic Paradigms": [
        "Greedy", "Backtracking", "Depth-First Search", "Breadth-First Search",
        "Union Find", "Simulation", "Design", "Enumeration", "Topological Sort",
        "Shortest Path", "Game Theory", "Strongly Connected Component"
    ],
    "Advanced Concepts & Theories": [
        "Geometry", "Number Theory", "Combinatorics", "Graph", "Probability and Statistics",
        "Suffix Array", "Rolling Hash", "Line Sweep", "Reservoir Sampling",
        "Quick Select", "Hash Function"
    ],
    "Tech & Miscellaneous": [
        "Database", "Ordered Set", "Data Stream", "Interactive", "Iterator",
        "Shell", "Concurrency", "Randomized", "Doubly-Linked List", "Merge Sort",
        "Counting Sort", "Minimum Spanning Tree", "Monotonic Stack", "Monotonic Queue",
        "Brainteaser", "String Matching"
    ]
};

interface TopicSelectorProps {
    selectedTopics: string[];
    onTopicChange: (topics: string[]) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopics, onTopicChange }) => {
    const [selectedTopic, setSelectedTopic] = useState<Set<string>>(new Set(selectedTopics));
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Sync state with parent
    useEffect(() => {
        setSelectedTopic(new Set(selectedTopics));
    }, [selectedTopics]);

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    const toggleTopicSelection = useCallback((topic: string) => {
        const newSelection = new Set(selectedTopic);
        if (newSelection.has(topic)) {
            newSelection.delete(topic);
        } else {
            newSelection.add(topic);
        }
        setSelectedTopic(newSelection);
        onTopicChange(Array.from(newSelection));
    }, [selectedTopic, onTopicChange]);

    const handleClearSelection = () => {
        setSelectedTopic(new Set());
        setSearchQuery(""); // Clear the search query
        onTopicChange([]);
    };

    // Filter topics based on search query
    const filteredTopics = Object.entries(topics).map(([category, subtopics]) => {
        const filteredSubtopics = subtopics.filter((topic) =>
            topic.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { category, subtopics: filteredSubtopics };
    });

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    className="h-7 text-xs text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent cursor-pointer transition-colors duration-150 rounded-md"
                    aria-label="Open topic selector"
                >
                    <span className="truncate max-w-20">
                        {selectedTopic.size > 0
                            ? `${selectedTopic.size} topic${selectedTopic.size > 1 ? "s" : ""}`
                            : "Topic"}
                    </span>
                    <ChevronDown size={12} className="ml-1" />
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-background/80" />
                <Dialog.Content
                    className="fixed top-1/2 left-1/2 max-h-[90vh] w-[calc(100vw-2rem)] max-w-md overflow-hidden bg-card border border-border text-foreground p-4 rounded-xl -translate-x-1/2 -translate-y-1/2 z-50 sm:p-6">
                    <div className="p-4 border-b border-border">
                        <Dialog.Title asChild>
                            <h2 className="text-xl font-semibold text-foreground">Topics</h2>
                        </Dialog.Title>
                        <p className="text-sm text-muted-foreground">Choose multiple topics from the list below.</p>
                    </div>

                    <div className="mb-4 p-2">
                        <input
                            type="text"
                            placeholder="Search Topics"
                            className="w-full p-2 text-sm text-foreground bg-secondary rounded-md focus:outline-none"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            aria-label="Search topics"
                        />
                    </div>

                    <div className="h-64 pr-2 p-4 overflow-y-auto scrollbar-thin-dark">
                        {filteredTopics.map(({ category, subtopics }) => (
                            subtopics.length > 0 && (
                                <div key={category} className="mb-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {subtopics.map((topic) => (
                                            <button
                                                type="button"
                                                key={topic}
                                                onClick={() => toggleTopicSelection(topic)}
                                                aria-pressed={selectedTopic.has(topic)}
                                                className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-all duration-200 ease-in-out border ${
                                                    selectedTopic.has(topic)
                                                        ? "bg-success text-foreground border-success"
                                                        : "bg-secondary border-border hover:bg-accent"
                                                }`}
                                                aria-label={selectedTopic.has(topic) ? `Deselect ${topic}` : `Select ${topic}`}
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                    <div className="flex justify-between gap-2 mt-6">
                        <Button
                            onClick={handleClearSelection}
                            variant="outline"
                            className="flex-1 text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent"
                        >
                            Clear
                        </Button>
                        <Dialog.Close asChild>
                            <Button
                                variant="outline"
                                className="flex-1 text-sm text-foreground hover:text-foreground border border-border bg-secondary hover:bg-accent"
                            >
                                Close
                            </Button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default TopicSelector;

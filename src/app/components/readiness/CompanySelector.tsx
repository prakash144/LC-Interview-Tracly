"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Building2, Search } from "lucide-react";
import CompanyLogo from "@/components/data-display/CompanyLogo";

interface CompanySelectorProps {
  companies: string[];
  selected: string | null;
  onChange: (company: string | null) => void;
}

const CompanySelector = ({ companies, selected, onChange }: CompanySelectorProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase().trim();
    if (!lower) {
      return selected
        ? companies.filter((c) => c !== selected).slice(0, 8)
        : companies.slice(0, 8);
    }
    return companies
      .filter((c) => c.toLowerCase().includes(lower))
      .slice(0, 12);
  }, [query, companies, selected]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  const handleSelect = (company: string) => {
    onChange(company);
    setQuery(company);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % filtered.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && filtered[highlightIndex]) {
          handleSelect(filtered[highlightIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
        <Building2 className="size-4" />
        <span className="font-medium">Target Company</span>
      </div>
      <div className="relative" ref={containerRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={selected ? selected : query}
            onChange={(e) => {
              if (selected) onChange(null);
              setQuery(e.target.value);
              setIsOpen(true);
              setHighlightIndex(-1);
            }}
            onFocus={() => {
              if (selected) {
                onChange(null);
                setQuery("");
              }
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search company..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/20 focus:bg-accent transition-all min-w-[200px] shadow-xs"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {selected ? (
              <CompanyLogo company={selected} size="sm" />
            ) : (
              <Search className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
        </div>

        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-1 text-sm shadow-lg"
          >
            {filtered.length > 0 ? (
              filtered.map((company, idx) => (
                <li
                  key={company}
                  role="option"
                  aria-selected={highlightIndex === idx}
                  onClick={() => handleSelect(company)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    idx === highlightIndex ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"
                  }`}
                >
                  <CompanyLogo company={company} size="sm" />
                  <span className="font-medium">{company}</span>
                </li>
              ))
            ) : (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground/50">
                No companies found
              </li>
            )}
          </ul>
        )}

        {selected && (
          <button
            type="button"
            onClick={handleClear}
            className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
};

export default CompanySelector;

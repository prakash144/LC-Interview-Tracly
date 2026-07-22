"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_OPTIONS } from "../hooks/usePagination";

interface ProblemPaginationProps {
  currentPage: number;
  pageSize: number;
  rangeFrom: number;
  rangeTo: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const ProblemPagination = ({
  currentPage,
  pageSize,
  rangeFrom,
  rangeTo,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: ProblemPaginationProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card/85 px-4 py-3 text-sm text-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{rangeFrom}</span>
        {" - "}
        <span className="font-semibold text-foreground">{rangeTo}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-9 rounded-md border border-border/70 bg-background px-2 text-foreground outline-none focus:border-success/50"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="border-border/70 bg-background text-foreground hover:bg-accent"
          >
            <ChevronLeft />
            Prev
          </Button>
          <span className="min-w-20 text-center text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="border-border/70 bg-background text-foreground hover:bg-accent"
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProblemPagination;

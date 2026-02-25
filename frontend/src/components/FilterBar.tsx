import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface FilterBarProps {
  categories: string[];
  categoriesLoading: boolean;
  activeCategory: string | null;
  sortOption: string | null;
  onCategoryChange: (cat: string | null) => void;
  onSortChange: (sort: string | null) => void;
  totalCount: number;
  filteredCount: number;
}

const SORT_OPTIONS = [
  { value: 'annualFee', label: 'Annual Fee (Low → High)' },
  { value: 'apr', label: 'APR (Low → High)' },
  { value: 'rewardsRate', label: 'Rewards Rate (High → Low)' },
];

const CATEGORY_LABELS: Record<string, string> = {
  cashback: 'Cash Back',
  travel: 'Travel',
  rewards: 'Rewards',
  'balance transfer': 'Balance Transfer',
  business: 'Business',
  student: 'Student',
};

export default function FilterBar({
  categories,
  categoriesLoading,
  activeCategory,
  sortOption,
  onCategoryChange,
  onSortChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
      <div className="flex flex-col gap-4">
        {/* Top row: filter label + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-teal-500" />
            <span className="font-display font-600 text-sm text-foreground">Filter by Category</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({filteredCount} of {totalCount} cards)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <Select
              value={sortOption ?? 'default'}
              onValueChange={(val) => onSortChange(val === 'default' ? null : val)}
            >
              <SelectTrigger className="w-52 h-8 text-sm border-border bg-background">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Order</SelectItem>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(null)}
            className={`rounded-full text-xs font-600 h-7 px-3 transition-all ${
              activeCategory === null
                ? 'bg-teal-500 hover:bg-teal-600 text-white border-teal-500 shadow-teal'
                : 'border-border text-muted-foreground hover:border-teal-300 hover:text-teal-600'
            }`}
          >
            All Cards
          </Button>

          {categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))
          ) : (
            categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
                className={`rounded-full text-xs font-600 h-7 px-3 transition-all capitalize ${
                  activeCategory === cat
                    ? 'bg-teal-500 hover:bg-teal-600 text-white border-teal-500 shadow-teal'
                    : 'border-border text-muted-foreground hover:border-teal-300 hover:text-teal-600'
                }`}
              >
                {CATEGORY_LABELS[cat.toLowerCase()] ?? cat}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

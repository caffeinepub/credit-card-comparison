import React, { useMemo, useEffect } from 'react';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import CardTile from '../components/CardTile';
import FilterBar from '../components/FilterBar';
import ComparisonBar from '../components/ComparisonBar';
import { useAllCards, useCardsByCategory, useSortedCards, useAllCategories, useInitialize } from '../hooks/useQueries';
import { useCardComparison } from '../hooks/useCardComparison';
import type { CreditCard as CreditCardType } from '../backend';

interface CardListingPageProps {
  onCompare: (cards: CreditCardType[]) => void;
}

export default function CardListingPage({ onCompare }: CardListingPageProps) {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [sortOption, setSortOption] = React.useState<string | null>(null);

  const { data: allCards = [], isLoading: allLoading, error: allError } = useAllCards();
  const { data: categoryCards = [], isLoading: categoryLoading } = useCardsByCategory(activeCategory);
  const { data: sortedCards = [], isLoading: sortLoading } = useSortedCards(sortOption);
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategories();
  const initMutation = useInitialize();

  const { selectedIds, isSelected, canAdd, toggle, remove, clear } = useCardComparison();

  // Auto-initialize if no cards
  useEffect(() => {
    if (!allLoading && allCards.length === 0 && !initMutation.isPending && !initMutation.isSuccess) {
      initMutation.mutate();
    }
  }, [allLoading, allCards.length]);

  // Compute displayed cards
  const displayedCards = useMemo(() => {
    let base: CreditCardType[] = allCards;

    if (activeCategory && categoryCards.length > 0) {
      base = categoryCards;
    }

    if (sortOption && sortedCards.length > 0) {
      if (activeCategory) {
        // Filter sorted cards by active category
        base = sortedCards.filter((c) =>
          c.categories.some((cat) => cat.toLowerCase() === activeCategory.toLowerCase())
        );
      } else {
        base = sortedCards;
      }
    }

    return base;
  }, [allCards, categoryCards, sortedCards, activeCategory, sortOption]);

  const selectedCards = useMemo(
    () => allCards.filter((c) => selectedIds.has(c.id)),
    [allCards, selectedIds]
  );

  const isLoading = allLoading || (activeCategory !== null && categoryLoading) || (sortOption !== null && sortLoading);

  const handleCompare = () => {
    onCompare(selectedCards);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 pb-28">
      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar
          categories={categories}
          categoriesLoading={categoriesLoading}
          activeCategory={activeCategory}
          sortOption={sortOption}
          onCategoryChange={setActiveCategory}
          onSortChange={setSortOption}
          totalCount={allCards.length}
          filteredCount={displayedCards.length}
        />
      </div>

      {/* Error State */}
      {allError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load credit cards. Please refresh the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Initializing */}
      {initMutation.isPending && (
        <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
          <span className="text-sm font-medium">Setting up card data...</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !initMutation.isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
              <Skeleton className="h-28 w-full" />
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </div>
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !initMutation.isPending && displayedCards.length === 0 && !allError && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-teal flex items-center justify-center mb-4 shadow-teal">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-display font-700 text-lg text-foreground mb-2">No cards found</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            {activeCategory
              ? `No cards found in the "${activeCategory}" category. Try a different filter.`
              : 'No credit cards available at the moment.'}
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && !initMutation.isPending && displayedCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
          {displayedCards.map((card) => (
            <CardTile
              key={card.id.toString()}
              card={card}
              isSelected={isSelected(card.id)}
              canAdd={canAdd}
              onToggleCompare={toggle}
            />
          ))}
        </div>
      )}

      {/* Comparison Bar */}
      <ComparisonBar
        selectedCards={selectedCards}
        onRemove={remove}
        onCompare={handleCompare}
        onClear={clear}
      />
    </div>
  );
}

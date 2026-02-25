import React from 'react';
import { X, BarChart2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CreditCard } from '../backend';

interface ComparisonBarProps {
  selectedCards: CreditCard[];
  onRemove: (id: bigint) => void;
  onCompare: () => void;
  onClear: () => void;
}

export default function ComparisonBar({ selectedCards, onRemove, onCompare, onClear }: ComparisonBarProps) {
  if (selectedCards.length < 1) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-card/95 backdrop-blur-md border-t border-teal-200 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Label */}
            <div className="flex items-center gap-2 shrink-0">
              <BarChart2 className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-display font-600 text-foreground">
                Compare ({selectedCards.length}/3)
              </span>
            </div>

            {/* Selected cards */}
            <div className="flex flex-wrap gap-2 flex-1">
              {selectedCards.map((card) => (
                <div
                  key={card.id.toString()}
                  className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 rounded-full px-3 py-1"
                >
                  <span className="text-xs font-600 text-teal-700 max-w-[120px] truncate">{card.name}</span>
                  <button
                    onClick={() => onRemove(card.id)}
                    className="text-teal-400 hover:text-teal-600 transition-colors ml-0.5"
                    aria-label={`Remove ${card.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 3 - selectedCards.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center gap-1.5 border border-dashed border-border rounded-full px-3 py-1"
                >
                  <span className="text-xs text-muted-foreground">Add card</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-xs text-muted-foreground hover:text-foreground h-8"
              >
                Clear all
              </Button>
              <Button
                onClick={onCompare}
                disabled={selectedCards.length < 2}
                size="sm"
                className={`h-8 text-xs font-600 transition-all ${
                  selectedCards.length >= 2
                    ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal'
                    : 'opacity-50 cursor-not-allowed bg-teal-500 text-white'
                }`}
              >
                Compare Now
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

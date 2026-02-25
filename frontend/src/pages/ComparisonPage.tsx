import React from 'react';
import { ArrowLeft, X, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CreditCard } from '../backend';

interface ComparisonPageProps {
  cards: CreditCard[];
  onBack: () => void;
  onRemoveCard: (id: bigint) => void;
}

function formatFee(fee: number): string {
  return fee === 0 ? '$0 / Free' : `$${fee.toFixed(0)}/yr`;
}

function formatRewards(rewardsRate: CreditCard['rewardsRate']): React.ReactNode {
  const parts: string[] = [];
  if (rewardsRate.cashBack != null) parts.push(`${rewardsRate.cashBack}% Cash Back`);
  if (rewardsRate.points != null) parts.push(`${rewardsRate.points}x Points`);
  if (rewardsRate.miles != null) parts.push(`${rewardsRate.miles}x Miles`);
  if (parts.length === 0) return <span className="text-muted-foreground">No rewards</span>;
  return (
    <div className="flex flex-col gap-0.5">
      {parts.map((p) => (
        <span key={p} className="text-sm font-medium text-foreground">{p}</span>
      ))}
    </div>
  );
}

function getCreditScoreColor(score: string): string {
  const s = score.toLowerCase();
  if (s === 'excellent') return 'text-teal-600 font-600';
  if (s === 'good') return 'text-blue-600 font-600';
  if (s === 'fair') return 'text-gold-700 font-600';
  return 'text-muted-foreground';
}

interface CompareRowProps {
  label: string;
  values: React.ReactNode[];
  highlight?: boolean;
}

function CompareRow({ label, values, highlight }: CompareRowProps) {
  return (
    <tr className={`border-b border-border ${highlight ? 'bg-teal-50/50' : 'bg-card'}`}>
      <td className="py-4 px-4 text-sm font-600 text-muted-foreground w-36 sm:w-44 shrink-0 align-top">
        {label}
      </td>
      {values.map((val, i) => (
        <td key={i} className="py-4 px-4 text-sm text-foreground align-top min-w-[160px]">
          {val}
        </td>
      ))}
    </tr>
  );
}

export default function ComparisonPage({ cards, onBack, onRemoveCard }: ComparisonPageProps) {
  if (cards.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 text-center">
        <p className="text-muted-foreground mb-4">No cards selected for comparison.</p>
        <Button onClick={onBack} variant="outline" className="border-teal-300 text-teal-600 hover:bg-teal-50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cards
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Cards
          </Button>
        </div>
        <div>
          <h2 className="font-display font-700 text-xl text-foreground">Side-by-Side Comparison</h2>
          <p className="text-sm text-muted-foreground">Comparing {cards.length} credit cards</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <ScrollArea className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-left text-xs font-600 text-muted-foreground uppercase tracking-wider w-36 sm:w-44 bg-secondary/50">
                    Feature
                  </th>
                  {cards.map((card) => (
                    <th key={card.id.toString()} className="py-4 px-4 min-w-[160px] bg-secondary/30">
                      <div className="flex flex-col gap-2">
                        {/* Card header mini */}
                        <div className="relative rounded-xl overflow-hidden gradient-teal p-3 text-left">
                          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-white/10" />
                          <p className="text-white/70 text-xs font-medium">{card.issuer}</p>
                          <p className="text-white font-display font-700 text-sm leading-tight mt-0.5">{card.name}</p>
                        </div>
                        {/* Remove button */}
                        {cards.length > 2 && (
                          <button
                            onClick={() => onRemoveCard(card.id)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors self-start"
                          >
                            <X className="w-3 h-3" />
                            Remove
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompareRow
                  label="Annual Fee"
                  highlight
                  values={cards.map((c) => (
                    <span className={c.annualFee === 0 ? 'text-teal-600 font-700' : 'font-600'}>
                      {formatFee(c.annualFee)}
                    </span>
                  ))}
                />
                <CompareRow
                  label="APR Range"
                  values={cards.map((c) => (
                    <span className="font-medium">
                      {c.apr.min.toFixed(2)}% – {c.apr.max.toFixed(2)}%
                    </span>
                  ))}
                />
                <CompareRow
                  label="Rewards Rate"
                  highlight
                  values={cards.map((c) => formatRewards(c.rewardsRate))}
                />
                <CompareRow
                  label="Sign-up Bonus"
                  values={cards.map((c) => (
                    <span className="text-sm leading-snug">{c.signupBonus}</span>
                  ))}
                />
                <CompareRow
                  label="Categories"
                  highlight
                  values={cards.map((c) => (
                    <div className="flex flex-wrap gap-1">
                      {c.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 capitalize"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  ))}
                />
                <CompareRow
                  label="Credit Score"
                  values={cards.map((c) => (
                    <span className={getCreditScoreColor(c.creditScoreRequired)}>
                      {c.creditScoreRequired}
                    </span>
                  ))}
                />
                <CompareRow
                  label="Description"
                  highlight
                  values={cards.map((c) => (
                    <span className="text-sm text-muted-foreground leading-relaxed">{c.description}</span>
                  ))}
                />
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-teal-300 text-teal-600 hover:bg-teal-50 hover:border-teal-400 font-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Cards
        </Button>
      </div>
    </div>
  );
}

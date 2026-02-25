import React from 'react';
import { Check, Plus, Star, Plane, CreditCard, ArrowLeftRight, Briefcase, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CreditCard as CreditCardType } from '../backend';

interface CardTileProps {
  card: CreditCardType;
  isSelected: boolean;
  canAdd: boolean;
  onToggleCompare: (card: CreditCardType) => void;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  cashback: { label: 'Cash Back', icon: <Star className="w-3 h-3" />, color: 'bg-gold-100 text-gold-700 border-gold-200' },
  travel: { label: 'Travel', icon: <Plane className="w-3 h-3" />, color: 'bg-teal-100 text-teal-700 border-teal-200' },
  rewards: { label: 'Rewards', icon: <Star className="w-3 h-3" />, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  'balance transfer': { label: 'Balance Transfer', icon: <ArrowLeftRight className="w-3 h-3" />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  business: { label: 'Business', icon: <Briefcase className="w-3 h-3" />, color: 'bg-slate-100 text-slate-700 border-slate-200' },
  student: { label: 'Student', icon: <GraduationCap className="w-3 h-3" />, color: 'bg-green-100 text-green-700 border-green-200' },
};

function getCategoryConfig(cat: string) {
  return CATEGORY_CONFIG[cat.toLowerCase()] ?? {
    label: cat,
    icon: <CreditCard className="w-3 h-3" />,
    color: 'bg-secondary text-secondary-foreground border-border',
  };
}

function formatRewards(rewardsRate: CreditCardType['rewardsRate']): string {
  const parts: string[] = [];
  if (rewardsRate.cashBack != null) parts.push(`${rewardsRate.cashBack}% Cash Back`);
  if (rewardsRate.points != null) parts.push(`${rewardsRate.points}x Points`);
  if (rewardsRate.miles != null) parts.push(`${rewardsRate.miles}x Miles`);
  return parts.length > 0 ? parts.join(' · ') : 'No rewards';
}

function getCreditScoreColor(score: string): string {
  const s = score.toLowerCase();
  if (s === 'excellent') return 'text-teal-600 bg-teal-50 border-teal-200';
  if (s === 'good') return 'text-blue-600 bg-blue-50 border-blue-200';
  if (s === 'fair') return 'text-gold-700 bg-gold-50 border-gold-200';
  return 'text-muted-foreground bg-secondary border-border';
}

export default function CardTile({ card, isSelected, canAdd, onToggleCompare }: CardTileProps) {
  const isDisabled = !isSelected && !canAdd;

  return (
    <article
      className={`
        relative bg-card rounded-2xl border transition-all duration-300 ease-out flex flex-col overflow-hidden
        ${isSelected
          ? 'border-teal-400 shadow-teal ring-2 ring-teal-400/30 -translate-y-1'
          : 'border-border shadow-card hover:-translate-y-1 hover:shadow-card-hover'
        }
      `}
    >
      {/* Card Header Gradient */}
      <div className="relative h-28 gradient-teal flex items-end p-4 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/8" />
        {/* Card illustration */}
        <div className="absolute top-3 right-4 opacity-30">
          <img
            src="/assets/generated/card-placeholder.dim_400x250.png"
            alt=""
            className="w-20 h-12 object-cover rounded-md"
          />
        </div>
        <div className="relative z-10">
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{card.issuer}</p>
          <h3 className="text-white font-display font-700 text-lg leading-tight mt-0.5">{card.name}</h3>
        </div>
        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Check className="w-3.5 h-3.5 text-teal-600" />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Key Stats Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-secondary rounded-xl p-2.5">
            <p className="text-xs text-muted-foreground font-medium">Annual Fee</p>
            <p className="text-sm font-display font-700 text-foreground mt-0.5">
              {card.annualFee === 0 ? (
                <span className="text-teal-600">$0 / Free</span>
              ) : (
                `$${card.annualFee.toFixed(0)}/yr`
              )}
            </p>
          </div>
          <div className="bg-secondary rounded-xl p-2.5">
            <p className="text-xs text-muted-foreground font-medium">APR Range</p>
            <p className="text-sm font-display font-700 text-foreground mt-0.5">
              {card.apr.min.toFixed(2)}% – {card.apr.max.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-2.5">
          <p className="text-xs text-gold-700 font-medium">Rewards Rate</p>
          <p className="text-sm font-600 text-gold-800 mt-0.5 leading-snug">{formatRewards(card.rewardsRate)}</p>
        </div>

        {/* Signup Bonus */}
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-1">Sign-up Bonus</p>
          <p className="text-sm text-foreground leading-snug line-clamp-2">{card.signupBonus}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {card.categories.map((cat) => {
            const cfg = getCategoryConfig(cat);
            return (
              <span
                key={cat}
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            );
          })}
        </div>

        {/* Credit Score */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Credit Score</span>
          <span className={`text-xs font-600 px-2 py-0.5 rounded-full border ${getCreditScoreColor(card.creditScoreRequired)}`}>
            {card.creditScoreRequired}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4">
        <Button
          onClick={() => onToggleCompare(card)}
          disabled={isDisabled}
          variant={isSelected ? 'default' : 'outline'}
          size="sm"
          className={`w-full font-600 transition-all duration-200 ${
            isSelected
              ? 'bg-teal-500 hover:bg-teal-600 text-white border-teal-500 shadow-teal'
              : isDisabled
              ? 'opacity-40 cursor-not-allowed'
              : 'border-teal-300 text-teal-600 hover:bg-teal-50 hover:border-teal-400'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Added to Compare
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {isDisabled ? 'Max 3 Selected' : 'Compare'}
            </>
          )}
        </Button>
      </div>
    </article>
  );
}

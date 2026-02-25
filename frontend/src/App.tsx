import React, { useState } from 'react';
import Layout from './components/Layout';
import CardListingPage from './pages/CardListingPage';
import ComparisonPage from './pages/ComparisonPage';
import type { CreditCard } from './backend';

type View = 'listing' | 'comparison';

export default function App() {
  const [view, setView] = useState<View>('listing');
  const [comparisonCards, setComparisonCards] = useState<CreditCard[]>([]);

  const handleCompare = (cards: CreditCard[]) => {
    setComparisonCards(cards);
    setView('comparison');
  };

  const handleBack = () => {
    setView('listing');
  };

  const handleRemoveFromComparison = (id: bigint) => {
    const updated = comparisonCards.filter((c) => c.id !== id);
    if (updated.length < 2) {
      // Go back to listing if fewer than 2 cards remain
      setView('listing');
    } else {
      setComparisonCards(updated);
    }
  };

  return (
    <Layout>
      {view === 'listing' ? (
        <CardListingPage onCompare={handleCompare} />
      ) : (
        <ComparisonPage
          cards={comparisonCards}
          onBack={handleBack}
          onRemoveCard={handleRemoveFromComparison}
        />
      )}
    </Layout>
  );
}

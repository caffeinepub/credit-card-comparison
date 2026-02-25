import { useState, useCallback } from 'react';
import type { CreditCard } from '../backend';

const MAX_COMPARE = 3;

export function useCardComparison() {
  const [selectedIds, setSelectedIds] = useState<Set<bigint>>(new Set());

  const isSelected = useCallback(
    (id: bigint) => selectedIds.has(id),
    [selectedIds]
  );

  const canAdd = selectedIds.size < MAX_COMPARE;

  const toggle = useCallback(
    (card: CreditCard) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(card.id)) {
          next.delete(card.id);
        } else if (next.size < MAX_COMPARE) {
          next.add(card.id);
        }
        return next;
      });
    },
    []
  );

  const remove = useCallback((id: bigint) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isSelected,
    canAdd,
    toggle,
    remove,
    clear,
  };
}

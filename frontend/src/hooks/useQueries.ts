import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CreditCard } from '../backend';

export function useInitialize() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.initialize();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useAllCards() {
  const { actor, isFetching } = useActor();

  return useQuery<CreditCard[]>({
    queryKey: ['cards', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCardsByCategory(category: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<CreditCard[]>({
    queryKey: ['cards', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getCardsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useSortedCards(sortOption: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<CreditCard[]>({
    queryKey: ['cards', 'sorted', sortOption],
    queryFn: async () => {
      if (!actor || !sortOption) return [];
      return actor.getSortedCards(sortOption);
    },
    enabled: !!actor && !isFetching && !!sortOption,
  });
}

export function useAllCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

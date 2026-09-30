import { queryOptions } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { terminal, type SavedOperation } from './operation';

export type HistoryJob = { id: string; status: string; prompt: string; tool?: string; createdAt: number; completedAt?: number; errorCode?: string; saved?: boolean; width?: number; height?: number };
export const historyKey = (uid?: string) => ['image-history', uid ?? null] as const;

/** Cache only a user's display list; credit checks and generation requests always reach the server. */
export function historyOptions(user: Pick<User, 'uid' | 'getIdToken'> | null, visible: boolean) {
  return queryOptions({
    queryKey: historyKey(user?.uid),
    enabled: !!user && visible,
    staleTime: 30_000,
    gcTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async ({ signal }) => {
      if (!user) throw new Error('Sign in to see history');
      const token = await user.getIdToken();
      signal.throwIfAborted();
      const response = await fetch('/api/image-edit/history', { headers: { Authorization: `Bearer ${token}` }, signal });
      if (!response.ok) throw new Error('History is temporarily unavailable');
      const data = await response.json() as { jobs: HistoryJob[] };
      if (!Array.isArray(data.jobs)) throw new Error('History response is incomplete');
      return { jobs: data.jobs, token };
    },
  });
}

/** Restoring an already completed task on mount must not trigger a second history read. */
export function historyChanged(previous: SavedOperation | null, current: SavedOperation | null, uid?: string) {
  return !!uid && !!previous && !!current && current.userId === uid && previous.userId === uid
    && previous.key === current.key && !terminal(previous.status) && terminal(current.status);
}

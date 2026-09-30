import { useEffect, useRef } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import type { SavedOperation } from './operation';
import { historyChanged, historyKey, historyOptions } from './history';

const client = new QueryClient();

export function useHistory(user: User | null, visible: boolean, operation: SavedOperation | null) {
  const query = useQuery(historyOptions(user, visible), client);
  const previous = useRef<SavedOperation | null>(null);
  const previousUid = useRef(user?.uid);

  useEffect(() => {
    if (previousUid.current && previousUid.current !== user?.uid) {
      client.removeQueries({ queryKey: historyKey(previousUid.current) });
    }
    previousUid.current = user?.uid;
  }, [user?.uid]);

  useEffect(() => {
    if (historyChanged(previous.current, operation, user?.uid)) {
      // Invalidate while hidden too: opening history after a conversion should show the new task.
      void client.invalidateQueries({ queryKey: historyKey(user?.uid) });
    }
    previous.current = operation;
  }, [user?.uid, operation]);

  return { history: query.data?.jobs ?? [], historyToken: query.data?.token ?? '' };
}

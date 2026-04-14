# React — React Query

## Use React Query for all client-side fetching and mutations

Use `@tanstack/react-query` for all client-side data fetching and mutations. Do not use raw `fetch` in `useEffect`, SWR, or hand-rolled state management for async operations.

## Extend library types, don't re-declare

When a custom query hook accepts React Query options (like `enabled`, `select`, `staleTime`, etc.), use `Partial<UseQueryOptions<TData, Error>>` as the props type. The hook provides `queryKey` and `queryFn` and spreads caller options on top. Never manually re-declare options that already exist in the library type.

## Export query keys

Every query hook must export its query key as a named `const` (e.g. `getExercisesQueryKey`) so callers can use it for invalidation, prefetching, or cache reads.

```tsx
// ✓ correct — full query hook example
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

import { getExercisesAction } from "@/features/exercises/actions/exercise-actions";
import type { Exercise } from "@/features/exercises/types/exercise";

export const getExercisesQueryKey = ["exercises"];

export const useGetExercises = (
  options?: Partial<UseQueryOptions<Exercise[], Error>>,
): UseQueryResult<Exercise[], Error> =>
  useQuery<Exercise[], Error>({
    queryKey: getExercisesQueryKey,
    queryFn: getExercisesAction,
    ...options,
  });
```

import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

import { getExercisesAction } from "@/features/exercises/actions/exercise-actions";
import type { Exercise } from "@/features/exercises/types/exercise";

export const getExercisesQueryKey = ["exercises"];

export const useGetExercises = <TData = Exercise[]>(
  options?: Partial<UseQueryOptions<Exercise[], Error, TData>>,
): UseQueryResult<TData, Error> =>
  useQuery<Exercise[], Error, TData>({
    queryKey: getExercisesQueryKey,
    queryFn: getExercisesAction,
    ...options,
  });

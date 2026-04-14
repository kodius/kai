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

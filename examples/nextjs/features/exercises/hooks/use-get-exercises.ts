import { useQuery } from "@tanstack/react-query";

import { getExercisesAction } from "@/features/exercises/actions/exercise-actions";
import type { Exercise } from "@/features/exercises/types/exercise";

type Props<TData = Exercise[]> = {
  enabled?: boolean;
  select?: (data: Exercise[]) => TData;
};

export const useGetExercises = <TData = Exercise[]>(props?: Props<TData>) => {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: getExercisesAction,
    enabled: props?.enabled,
    select: props?.select,
  });
};

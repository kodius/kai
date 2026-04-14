import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Exercise } from "@/features/exercises/types/exercise";

type Props = {
  exercise: Exercise;
};

export const ExerciseCard = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.exercise.name}</CardTitle>
        <CardDescription>{props.exercise.muscleGroup}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.exercise.description}</p>
      </CardContent>
      <CardFooter>
        <Badge variant="secondary">{props.exercise.difficulty}</Badge>
      </CardFooter>
    </Card>
  );
};

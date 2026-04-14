import { getDb } from "./db";

const exercises = [
  {
    id: "1",
    name: "Barbell Bench Press",
    description:
      "Lie on a flat bench and press a barbell upward from chest level until arms are fully extended.",
    muscleGroup: "Chest",
    difficulty: "intermediate",
  },
  {
    id: "2",
    name: "Deadlift",
    description:
      "Lift a loaded barbell from the floor to hip level, then lower it back down.",
    muscleGroup: "Back",
    difficulty: "advanced",
  },
  {
    id: "3",
    name: "Barbell Squat",
    description:
      "With a barbell on your upper back, bend your knees and hips to lower your body, then stand back up.",
    muscleGroup: "Legs",
    difficulty: "advanced",
  },
  {
    id: "4",
    name: "Overhead Press",
    description:
      "Press a barbell from shoulder height to overhead until arms are locked out.",
    muscleGroup: "Shoulders",
    difficulty: "intermediate",
  },
  {
    id: "5",
    name: "Bicep Curl",
    description:
      "Hold dumbbells at your sides and curl them upward by bending at the elbow.",
    muscleGroup: "Arms",
    difficulty: "beginner",
  },
  {
    id: "6",
    name: "Plank",
    description:
      "Hold a push-up position with your body in a straight line, engaging your core throughout.",
    muscleGroup: "Core",
    difficulty: "beginner",
  },
];

const db = getDb();

const insert = db.prepare(`
  INSERT OR REPLACE INTO exercises (id, name, description, muscle_group, difficulty)
  VALUES (@id, @name, @description, @muscleGroup, @difficulty)
`);

const seedAll = db.transaction(() => {
  for (const exercise of exercises) {
    insert.run(exercise);
  }
});

seedAll();
console.log(`Seeded ${exercises.length} exercises.`);

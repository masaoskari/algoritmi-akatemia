"use server";
import { createClient } from "@/utils/supabase/server";

export async function getExerciseByName(name: string): Promise<string | null> {
  const supabase = await createClient();
  console.log("Fetching exercise by name:", name);
  try {
    const { data: exercise, error } = await supabase
      .from("exercises")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (error) {
      console.error("Error fetching exercise:", error);
      return null;
    }

    return exercise?.id || null;
  } catch (error) {
    console.error("Error in getExerciseByName:", error);
    return null;
  }
}

export async function isExerciseCompleted(exerciseName: string): Promise<boolean> {
    console.log("Checking if exercise is completed:", exerciseName);
  const supabase = await createClient();
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    const exerciseId = await getExerciseByName(exerciseName);
    if (!exerciseId) {
      throw new Error("Exercise not found");
    }

    const { data: userExercise, error: userExerciseError } = await supabase
      .from("user_exercises")
      .select("exercise_id")
      .eq("user_id", user.id)
      .eq("exercise_id", exerciseId)
      .maybeSingle();

    if (userExerciseError) {
      console.error("Error checking completion:", userExerciseError);
      throw userExerciseError;
    }

    return !!userExercise;
  } catch (error) {
    console.error("Error in checking exercise completion:", error);
    return false;
  }
}

export async function markExerciseAsCompleted(exerciseName: string, points: number): Promise<void> {
  const supabase = await createClient();
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    const exerciseId = await getExerciseByName(exerciseName);
    if (!exerciseId) {
      throw new Error("Exercise not found");
    }

    const { error } = await supabase
      .from("user_exercises")
      .upsert({
        user_id: user.id,
        exercise_id: exerciseId,
        points_earned: points,
      });

    if (error) {
      console.error("Error marking exercise as completed:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in marking exercise as completed:", error);
  }
}
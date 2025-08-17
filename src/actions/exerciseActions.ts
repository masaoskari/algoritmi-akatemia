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

    // First check if exercise exists and get current points
    const { data: existingExercise } = await supabase
      .from("user_exercises")
      .select("points_earned")
      .eq("user_id", user.id)
      .eq("exercise_id", exerciseId)
      .maybeSingle();

    // If exercise doesn't exist or new points are higher, update/insert
    if (!existingExercise || points > existingExercise.points_earned) {
      const { error } = await supabase
        .from("user_exercises")
        .upsert({
          user_id: user.id,
          exercise_id: exerciseId,
          points_earned: points,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,exercise_id'
        });

      if (error) {
        console.error("Error marking exercise as completed:", error);
        throw error;
      }
    } else {
      console.log(`Current points (${existingExercise.points_earned}) are higher than or equal to new points (${points}). Not updating.`);
    }
  } catch (error) {
    console.error("Error in marking exercise as completed:", error);
  }
}

export async function getExercisePoints(exerciseName: string): Promise<number> {
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
      .select("points_earned")
      .eq("user_id", user.id)
      .eq("exercise_id", exerciseId)
      .maybeSingle();

    if (userExerciseError) {
      console.error("Error fetching exercise points:", userExerciseError);
      throw userExerciseError;
    }

    return userExercise?.points_earned || 0;
  } catch (error) {
    console.error("Error in getting exercise points:", error);
    return 0;
  }
}
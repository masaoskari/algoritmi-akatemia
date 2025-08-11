// TODO: Refactor this...
import { logout } from "@/app/user/actions";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export default async function Dashboard({ user }: { user: User }) {
  const supabase = await createClient();
  const allExercises = await supabase
    .from("exercises")
    .select("*")
    .order("category");

  // Get user's completed exercises
  const userExercises = await supabase
    .from("user_exercises")
    .select("*, exercise:exercises(category)")
    .eq("user_id", user?.id || "");

  // Group exercises by category
  const exercisesByCategory =
    allExercises.data?.reduce((acc, exercise) => {
      if (!acc[exercise.category]) {
        acc[exercise.category] = [];
      }
      acc[exercise.category].push(exercise);
      return acc;
    }, {} as Record<string, any[]>) || {};

  // Group user's completed exercises by category
  const completedByCategory =
    userExercises.data?.reduce((acc, userEx) => {
      const category = userEx.exercise?.category;
      if (category) {
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category]++;
      }
      return acc;
    }, {} as Record<string, number>) || {};

  // Calculate category progress
  const categoryProgress = Object.keys(exercisesByCategory).map((category) => {
    const total = exercisesByCategory[category].length;
    const completed = completedByCategory[category] || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      name: category,
      completed,
      total,
      percentage,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-background shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Tervetuloa!</h1>
              <p className="text-gray-300 mt-1">{user.email}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Kirjaudu ulos
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">🎯</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white truncate">
                    Suoritetut tehtävät
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {userExercises.data?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">⭐</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Pisteet yhteensä
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {userExercises.data?.reduce(
                      (sum, ue) => sum + (ue.points_earned || 0),
                      0
                    ) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📚</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white truncate">
                    Kategorioita aloitettu
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {Object.keys(completedByCategory).length} /{" "}
                    {Object.keys(exercisesByCategory).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Category Progress Bars */}
        <div className="space-y-6 mb-8">
          {categoryProgress.map((category) => (
            <div key={category.name} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-medium text-gray-900 capitalize">
                  {category.name.replace(/([A-Z])/g, " $1").trim()}
                </h4>
                <span className="text-sm font-medium text-gray-600">
                  {category.percentage}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    category.percentage === 100
                      ? "bg-green-500"
                      : category.percentage >= 50
                      ? "bg-blue-600"
                      : "bg-orange-500"
                  }`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {category.completed} / {category.total} tehtävää suoritettu
                </p>
                <div className="flex items-center space-x-2">
                  {category.percentage === 100 ? (
                    <span className="text-green-600 text-sm font-medium">
                      ✅ Valmis!
                    </span>
                  ) : category.percentage >= 50 ? (
                    <span className="text-blue-600 text-sm font-medium">
                      🔄 Hyvää menoa
                    </span>
                  ) : category.completed > 0 ? (
                    <span className="text-orange-600 text-sm font-medium">
                      🚀 Aloitettu
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm font-medium">
                      ⭐ Ei aloitettu
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Quick Actions */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <a
              href="/"
              className="group px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 flex items-center justify-center gap-2 font-medium hover:border-gray-300"
            >
              ← Etusivulle
            </a>

            <a
              href="/materiaali/7lk/johdanto"
              className="group px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-900 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
            >
              Materiaaliin →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

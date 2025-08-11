import Dashboard from "@/components/Dashboard";
import { login, logout } from "./actions";
import { createClient } from "@/utils/supabase/server";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return <Dashboard user={user} />;
  }

  // Show login form if not logged in
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-white">
          Kirjaudu sisään
        </h2>

        <form className="space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Sähköposti"
            className="w-full px-4 py-2 bg-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Salasana"
            minLength={6}
            className="w-full px-4 py-2 bg-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            formAction={login}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 mt-6"
          >
            Kirjaudu sisään
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Eikö sinulla ole vielä tiliä?{" "}
          <a
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Luo uusi tili
          </a>
        </p>

        <div className="text-center">
          <a href="/" className="text-sm text-primary hover:underline">
            ← Takaisin etusivulle
          </a>
        </div>
      </div>
    </div>
  );
}

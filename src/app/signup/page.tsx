import { signup } from '../user/actions';
import { createClient } from '@/utils/supabase/server';

export default async function SignupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-white">
          Luo uusi tili
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
            placeholder="Salasana (vähintään 6 merkkiä)"
            minLength={6}
            className="w-full px-4 py-2 bg-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <button
            formAction={signup}
            className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 mt-6"
          >
            Luo tili
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Onko sinulla jo tili?{' '}
          <a href="/user" className="text-primary hover:underline font-medium">
            Kirjaudu sisään
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
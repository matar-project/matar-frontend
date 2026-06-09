import { useAuth } from '../Hooks/auth/UseAuth';

function Home() {
  const { logout, user } = useAuth();

  return (
    <main className="grid min-h-screen place-content-center justify-items-center gap-4 bg-slate-100 p-6">
      <h1 className="text-3xl font-semibold text-slate-900">Home</h1>
      <p className="text-slate-600">Welcome, {user?.name}.</p>
      <button
        className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-600/30"
        type="button"
        onClick={logout}
      >
        Log out
      </button>
    </main>
  );
}

export default Home;

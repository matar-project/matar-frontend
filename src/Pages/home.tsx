import { useAuth } from "../Hooks/auth/UseAuth";
import "./home.css";

function Home() {
  const { logout, user } = useAuth();

  return (
    <main className="home-page">
      <h1>Home</h1>
      <p>Welcome, {user?.name}.</p>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </main>
  );
}

export default Home;

import { useNavigate } from "react-router-dom";
import UnauthenticatedNavbar from "../../src/components/UnauthenticatedNavbar";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div>
      <UnauthenticatedNavbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-chrononest px-6 pt-24">
        <div className="relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)] rounded-2xl shadow-[0_0_24px_rgba(113,245,255,0.65)] p-8 max-w-xl text-center transition-all duration-500 before:absolute before:inset-0 before:border before:border-[rgb(113,245,255)] before:opacity-50 before:blur-xl before:pointer-events-none">
          <h1 className="text-6xl font-bold text-cyan-200 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-slate-300 text-lg mb-6">
            Oops! The page you’re looking for does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 shadow-[0_0_12px_rgba(113,245,255,0.6)]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

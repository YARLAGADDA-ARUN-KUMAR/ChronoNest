import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthenticatedNavbar from "../../src/components/AuthenticatedNavbar";

export default function DashboardPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "http://localhost:3000/api/capsules/dashboard/summary",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Failed to load dashboard");
        } else {
          setStats(await res.json());
        }
      } catch (err) {
        setError("Network error: " + err.message);
      }
      setLoading(false);
    }
    if (token) fetchDashboard();
  }, [token]);

  const glowCardClass = `
    relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)]
    rounded-2xl shadow-[0_0_18px_rgba(113,245,255,0.78)]
    transition-all duration-700 flex flex-col min-h-[620px]
    before:absolute before:inset-0 before:rounded-2xl
    before:border before:border-[rgb(113,245,255)]
    before:opacity-50 before:blur-xl before:pointer-events-none
    px-8 py-8
  `;

  return (
    <div>
      <AuthenticatedNavbar />
      <div className="min-h-screen bg-chrononest flex flex-col items-center py-16 px-6 justify-center mt-10">
        <div className="w-full max-w-4xl mx-auto">
          <div className={glowCardClass}>
            <div className="flex justify-center items-center mb-8 mt-2">
              <h1 className="text-4xl font-bold text-cyan-200 text-center">
                Dashboard
              </h1>
            </div>

            <div className="flex-1">
              {loading ? (
                <div className="text-cyan-300 text-lg text-center">
                  Loading dashboard…
                </div>
              ) : error ? (
                <div className="text-red-400 font-bold text-lg text-center">
                  {error}
                </div>
              ) : (
                stats && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                      <StatTile label="Total Capsules" value={stats.count} />
                      <StatTile
                        label="Released"
                        value={stats.released}
                        highlight
                      />
                      <StatTile label="Pending" value={stats.pending} />
                    </div>
                    <GlowSection>
                      <h2 className="text-2xl text-cyan-300 font-semibold mb-5 text-center">
                        Recent Capsules
                      </h2>
                      {stats.recent && stats.recent.length > 0 ? (
                        <ul className="space-y-2">
                          {stats.recent.map((c) => (
                            <li
                              key={c._id}
                              className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 py-2 border-b border-slate-800 last:border-none"
                            >
                              <span className="text-white font-bold">
                                {c.title}
                              </span>
                              <span className="text-slate-400">
                                {new Date(c.triggerDate).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => navigate(`/capsule/${c._id}`)}
                                className="text-cyan-400 hover:text-cyan-200 underline ml-4"
                              >
                                View
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-slate-400 italic text-center">
                          No capsules created yet.
                        </div>
                      )}
                    </GlowSection>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-7 justify-center items-center">
              <button
                className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-black text-2xl font-bold rounded-xl min-w-[220px] h-16 px-8 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(52,255,182,0.7)] border border-green-200"
                onClick={() => navigate("/create-capsule")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  className="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
                <span>Create Capsule</span>
              </button>
              <button
                className="flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-600 text-black text-2xl font-bold rounded-xl min-w-[220px] h-16 px-8 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(113,245,255,0.7)] border border-cyan-200"
                onClick={() => navigate("/capsule-list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  className="bi bi-list-ul"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 12.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3-.5a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H5zm-3-3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3-.5a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H5zm-3-3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3-.5a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H5z"
                  />
                </svg>
                <span>View All Capsules</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, highlight }) {
  return (
    <div
      className={`rounded-xl px-8 py-6 text-center border-2 shadow-lg
      ${
        highlight
          ? "border-green-400 bg-green-900/40"
          : "border-cyan-400 bg-slate-900/60"
      }`}
    >
      <div className="text-cyan-300 text-lg font-medium mb-2">{label}</div>
      <div className="text-4xl font-bold text-white">{value}</div>
    </div>
  );
}

function GlowSection({ children }) {
  return (
    <div className=" border border-cyan-400 rounded-2xl shadow-[0_0_4px_rgba(113,245,255,0.35)] p-8 mb-8">
      {children}
    </div>
  );
}

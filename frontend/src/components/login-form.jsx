import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ChronoNestLogo = () => (
  <div className="flex items-center gap-2 mt-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-white"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    <span className="text-4xl font-bold text-white">ChronoNest</span>
  </div>
);

export function LoginForm({ className, ...props }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHomeClick = () => {
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <Card
      className={cn(
        "relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)] rounded-2xl text-white shadow-[0_0_10px_rgba(113,245,255,0.5)] transition-all duration-500",
        "before:absolute before:inset-0 before:rounded-2xl before:border before:border-[rgb(113,245,255)] before:opacity-50 before:blur-md before:pointer-events-none",
        className
      )}
      {...props}
    >
      <CardHeader className="pt-8 pr-8 pl-8">
        <Button
          variant="outline"
          className="absolute top-6 left-6 text-xs bg-transparent border-slate-600 hover:bg-slate-700/50 hover:text-white h-8 px-3"
          onClick={handleHomeClick}
        >
          Back to Home
        </Button>

        <div className="flex justify-center items-center mb-4">
          <ChronoNestLogo />
        </div>

        <h1 className="text-3xl font-bold text-center text-slate-100">
          Log In
        </h1>
      </CardHeader>

      <CardContent className="p-8 pt-0">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/60 border-slate-700 rounded-lg h-12 placeholder:text-slate-400 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-800/60 border-slate-700 rounded-lg h-12 placeholder:text-slate-400 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-black text-lg font-bold rounded-lg h-12 transition-all duration-300 transform hover:scale-105"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {error && (
            <div className="text-red-400 text-center text-sm mt-2">{error}</div>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Forgot your account?{" "}
          <a
            href="/signup"
            className="font-semibold text-green-400 hover:underline"
          >
            Sign Up
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

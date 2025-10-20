import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function UnauthenticatedNavbar() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50">
      <div className="relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)] text-white shadow-[0_0_10px_rgba(113,245,255,0.5)] transition-all duration-500 before:absolute before:inset-0 before:border before:border-[rgb(113,245,255)] before:opacity-50 before:blur-md before:pointer-events-none flex justify-between items-center h-full px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">ChronoNest</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

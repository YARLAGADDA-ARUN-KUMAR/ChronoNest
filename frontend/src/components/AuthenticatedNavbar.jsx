import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";

export default function AuthenticatedNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50">
      <div className="relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)] text-white shadow-[0_0_10px_rgba(113,245,255,0.5)] transition-all duration-500 before:absolute before:inset-0 before:border before:border-[rgb(113,245,255)] before:opacity-50 before:blur-md before:pointer-events-none flex items-center h-full px-6 justify-between">
        <Link
          to="/dashboard"
          className="text-cyan-300 font-bold text-lg hover:underline tracking-wide pr-8"
          aria-label="Dashboard"
        >
          Dashboard
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center space-x-3 select-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            fill="white"
            viewBox="0 0 16 16"
            className="mt-1"
          >
            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555l-4.2 2.568-.051-.105c-.666-1.3-2.363-1.917-3.699-1.25-1.336-.667-3.033-.05-3.699 1.25l-.05.105zM11.584 8.91l-.073.139L16 11.8V4.697l-4.003 2.447c.027.562-.107 1.163-.413 1.767Zm-4.135 3.05c-1.048-.693-1.84-1.39-2.398-2.082L.19 12.856A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144L10.95 9.878c-.559.692-1.35 1.389-2.398 2.081L8 12.324l-.551-.365ZM4.416 8.91c-.306-.603-.44-1.204-.413-1.766L0 4.697v7.104l4.49-2.752z" />
            <path d="M8 5.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132" />
          </svg>

          <span className="text-5xl font-bold text-white">ChronoNest</span>
        </Link>

        <div className="flex items-center border-4 rounded-full border-[rgb(113,245,255)]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open user menu">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-slate-900 border-cyan-500 text-white"
            >
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer focus:bg-cyan-800 focus:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-cyan-500/50" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-400 focus:bg-red-800 focus:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

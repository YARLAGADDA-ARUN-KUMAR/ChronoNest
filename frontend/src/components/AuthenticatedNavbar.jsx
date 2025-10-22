import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
      <div className="relative bg-transparent backdrop-blur-none border border-[rgb(113,245,255)] text-white shadow-[0_0_10px_rgba(113,245,255,0.5)] transition-all duration-500 before:absolute before:inset-0 before:border before:border-[rgb(113,245,255)] before:opacity-50 before:blur-md before:pointer-events-none flex justify-between items-center h-full px-6">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl">ChronoNest</span>
          </Link>
        </div>

        <div className="flex items-center border-4 rounded-full border-[rgb(113,245,255)]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to="/settings"
                  className="flex items-center cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Profile/Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
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

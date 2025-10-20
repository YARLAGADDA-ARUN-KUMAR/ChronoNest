import "./App.css";
import { ThemeProvider } from "./components/ui/themeProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import DashBoard from "../pages/DashBoard";
import CreateCapsule from "../pages/CreateCapsule";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import NotFound from "../pages/NotFound";
import Settings from "../pages/Settings";

function App() {
  return (
    <div className="bg-chrononest">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create-capsule" element={<CreateCapsule />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;

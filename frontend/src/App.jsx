import "./App.css";
import { ThemeProvider } from "./components/ui/themeProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import DashBoard from "../pages/DashBoard";
import CreateCapsule from "../pages/CreateCapsule";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import NotFound from "../pages/NotFound";
import CapsuleListPage from "../pages/CapsuleListPage";
import CapsuleDetailsPage from "../pages/CapsuleDetailsPage";
import CapsuleEditForm from "../pages/CapsuleEditForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="bg-chrononest">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-capsule"
              element={
                <ProtectedRoute>
                  <CreateCapsule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/capsule-list"
              element={
                <ProtectedRoute>
                  <CapsuleListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/capsule/:id"
              element={
                <ProtectedRoute>
                  <CapsuleDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/capsule/:id/edit"
              element={
                <ProtectedRoute>
                  <CapsuleEditForm />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;

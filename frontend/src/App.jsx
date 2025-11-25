import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './components/ui/themeProvider';
import CapsuleDetailsPage from './pages/CapsuleDetailsPage';
import CapsuleEditForm from './pages/CapsuleEditForm';
import CapsuleListPage from './pages/CapsuleListPage';
import CreateCapsule from './pages/CreateCapsule';
import DashBoard from './pages/DashBoard';
import EngagementSuccessPage from './pages/EngagementSuccessPage'; // ✅ new import
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';
import SignUp from './pages/SignUp';

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
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/engagement-success" element={<EngagementSuccessPage />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}

export default App;

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Blogs from "./pages/Blogs";
import Experience from "./pages/Experience";
import Testimonials from "./pages/Testimonials";
import Services from "./pages/Services";
import Media from "./pages/Media";
import Messages from "./pages/Messages";

import AdminLayout from "./layouts/AdminLayout";
import {
    AuthProvider,
    useAuth
} from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Dashboard />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/about"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <About />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/skills"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Skills />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Projects />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/blogs"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Blogs />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/experience"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Experience />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/testimonials"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Testimonials />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/services"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Services />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/media"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Media />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Messages />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

const AppWithAuth = () => {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
};

export default AppWithAuth;
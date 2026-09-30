import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email.trim(), password);

            console.log("✅ Login successful");

            navigate("/", { replace: true });
        } catch (error) {
            console.error("❌ Login error:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                        <ShieldCheck
                            size={28}
                            className="text-slate-900"
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        Portfolio CMS
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Admin Panel
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl bg-white p-8 shadow-2xl"
                >
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Admin Login
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Sign in to manage your portfolio.
                    </p>

                    {error && (
                        <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="admin@portfolio.com"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                            required
                        />
                    </div>

                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium text-slate-900">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
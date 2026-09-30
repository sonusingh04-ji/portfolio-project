import { useEffect, useState } from "react";

import {
    FolderKanban,
    FileText,
    BriefcaseBusiness,
    MessageSquare,
    Code2,
    Wrench,
    Image,
    Quote
} from "lucide-react";

import api from "../services/api";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await api.get(
                    "/api/dashboard/stats"
                );

                setStats(response.data.data);
            } catch (error) {
                console.error(
                    "Dashboard stats error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard statistics"
                );
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const cards = [
        {
            title: "Projects",
            key: "projects",
            icon: FolderKanban
        },
        {
            title: "Blogs",
            key: "blogs",
            icon: FileText
        },
        {
            title: "Experience",
            key: "experience",
            icon: BriefcaseBusiness
        },
        {
            title: "Messages",
            key: "messages",
            icon: MessageSquare
        },
        {
            title: "Skills",
            key: "skills",
            icon: Code2
        },
        {
            title: "Services",
            key: "services",
            icon: Wrench
        },
        {
            title: "Media",
            key: "media",
            icon: Image
        },
        {
            title: "Testimonials",
            key: "testimonials",
            icon: Quote
        }
    ];

    return (
        <div className="min-h-screen bg-slate-100">

            <header className="border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between px-8 py-5">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Portfolio CMS
                        </h1>

                        <p className="text-sm text-slate-500">
                            Admin Dashboard
                        </p>
                    </div>

                    <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                        Administrator
                    </div>

                </div>
            </header>

            <main className="px-8 py-10">

                <h2 className="text-3xl font-bold text-slate-900">
                    Dashboard
                </h2>

                <p className="mt-2 text-slate-500">
                    Overview of your portfolio content.
                </p>

                {error && (
                    <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.key}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            {card.title}
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-slate-900">
                                            {loading
                                                ? "..."
                                                : stats?.[card.key] ?? 0}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-slate-100 p-3">
                                        <Icon
                                            size={22}
                                            className="text-slate-700"
                                        />
                                    </div>

                                </div>
                            </div>
                        );
                    })}

                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">

                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Message Overview
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Current contact activity.
                        </p>

                        <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-5">
                            <span className="text-slate-600">
                                Unread Messages
                            </span>

                            <span className="text-2xl font-bold text-slate-900">
                                {loading
                                    ? "..."
                                    : stats?.unreadMessages ?? 0}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">
                            CMS Status
                        </h3>

                        <div className="mt-6 space-y-4">

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Backend API
                                </span>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    Online
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Database
                                </span>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    Connected
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">
                                    Authentication
                                </span>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    Active
                                </span>
                            </div>

                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default Dashboard;
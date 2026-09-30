import {
    LayoutDashboard,
    UserRound,
    Code2,
    FolderKanban,
    FileText,
    BriefcaseBusiness,
    MessageSquareQuote,
    Wrench,
    Images,
    Inbox,
    LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        {
            label: "Dashboard",
            path: "/",
            icon: LayoutDashboard
        },
        {
            label: "About",
            path: "/about",
            icon: UserRound
        },
        {
            label: "Skills",
            path: "/skills",
            icon: Code2
        },
        {
            label: "Projects",
            path: "/projects",
            icon: FolderKanban
        },
        {
            label: "Blogs",
            path: "/blogs",
            icon: FileText
        },
        {
            label: "Experience",
            path: "/experience",
            icon: BriefcaseBusiness
        },
        {
            label: "Testimonials",
            path: "/testimonials",
            icon: MessageSquareQuote
        },
        {
            label: "Services",
            path: "/services",
            icon: Wrench
        },
        {
            label: "Media",
            path: "/media",
            icon: Images
        },
        {
            label: "Messages",
            path: "/messages",
            icon: Inbox
        }
    ];

    return (
        <aside className="flex min-h-screen w-64 flex-col bg-slate-950 text-white">

            <div className="border-b border-slate-800 px-6 py-6">
                <h1 className="text-xl font-bold">
                    Portfolio CMS
                </h1>

                <p className="mt-1 text-xs text-slate-400">
                    Administration Panel
                </p>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-5">

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-white text-slate-950"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={18} />

                            {item.label}
                        </NavLink>
                    );
                })}

            </nav>

            <div className="border-t border-slate-800 p-3">

                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 hover:bg-red-950 hover:text-red-300"
                >
                    <LogOut size={18} />

                    Logout
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;
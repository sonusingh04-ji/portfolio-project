import { useEffect, useState } from "react";

import {
    ArrowUpRight,
    Menu,
    X
} from "lucide-react";

import {
    Link,
    NavLink,
    useLocation
} from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const location = useLocation();

    const links = [
        {
            label: "Home",
            to: "/"
        },
        {
            label: "About",
            to: "/about"
        },
        {
            label: "Skills",
            to: "/skills"
        },
        {
            label: "Projects",
            to: "/projects"
        },
        {
            label: "Experience",
            to: "/experience"
        },
        {
            label: "Blog",
            to: "/blog"
        }
    ];

    /*
     * Close mobile menu whenever route changes.
     */
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    /*
     * Prevent body scrolling while mobile menu is open.
     */
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    return (
        <header className="mx-auto max-w-7xl">

            <nav className="relative rounded-[1.25rem] border border-slate-200 bg-slate-950 px-4 py-3 text-white shadow-2xl shadow-slate-950/10 sm:px-6">

                <div className="flex items-center justify-between">

                    {/* Brand */}
                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-bold text-slate-950">
                            S
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-base font-semibold">
                                Portfolio
                            </p>

                            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                                Developer
                            </p>
                        </div>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden items-center gap-1 md:flex">

                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={
                                    link.to === "/"
                                }
                                className={({ isActive }) =>
                                    `rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-white text-slate-950"
                                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                    </div>

                    {/* Desktop contact */}
                    <Link
                        to="/contact"
                        className="hidden items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 sm:px-5 md:inline-flex"
                    >
                        Contact
                        <ArrowUpRight
                            size={17}
                        />
                    </Link>

                    {/* Mobile controls */}
                    <div className="flex items-center gap-2 md:hidden">

                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-950"
                        >
                            Contact
                            <ArrowUpRight
                                size={15}
                            />
                        </Link>

                        <button
                            type="button"
                            onClick={() =>
                                setMenuOpen(
                                    (previous) =>
                                        !previous
                                )
                            }
                            aria-label={
                                menuOpen
                                    ? "Close menu"
                                    : "Open menu"
                            }
                            aria-expanded={
                                menuOpen
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
                        >
                            {menuOpen ? (
                                <X size={21} />
                            ) : (
                                <Menu size={21} />
                            )}
                        </button>

                    </div>

                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-950 shadow-2xl md:hidden">

                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={
                                    link.to === "/"
                                }
                                className={({ isActive }) =>
                                    `block rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                                        isActive
                                            ? "bg-slate-950 text-white"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        <div className="my-2 border-t border-slate-200" />

                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold ${
                                    isActive
                                        ? "bg-slate-950 text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            Contact

                            <ArrowUpRight
                                size={17}
                            />
                        </NavLink>

                    </div>
                )}

            </nav>

        </header>
    );
};

export default Navbar;
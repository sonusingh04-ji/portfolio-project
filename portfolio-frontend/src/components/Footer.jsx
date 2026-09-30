import {
    Mail,
    ArrowUpRight
} from "lucide-react";

import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-slate-950 text-white">

            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-black text-slate-950">
                                S
                            </div>

                            <div>
                                <p className="font-bold">
                                    Portfolio
                                </p>

                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                    Developer
                                </p>
                            </div>

                        </div>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                            Building modern digital experiences
                            with scalable backend systems and
                            clean, responsive interfaces.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                            Navigation
                        </h3>

                        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

                            <Link
                                to="/"
                                className="text-slate-400 hover:text-white"
                            >
                                Home
                            </Link>

                            <Link
                                to="/about"
                                className="text-slate-400 hover:text-white"
                            >
                                About
                            </Link>

                            <Link
                                to="/skills"
                                className="text-slate-400 hover:text-white"
                            >
                                Skills
                            </Link>

                            <Link
                                to="/projects"
                                className="text-slate-400 hover:text-white"
                            >
                                Projects
                            </Link>

                            <Link
                                to="/experience"
                                className="text-slate-400 hover:text-white"
                            >
                                Experience
                            </Link>

                            <Link
                                to="/blog"
                                className="text-slate-400 hover:text-white"
                            >
                                Blog
                            </Link>

                            <Link
                                to="/contact"
                                className="text-slate-400 hover:text-white"
                            >
                                Contact
                            </Link>

                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                            Connect
                        </h3>

                        <div className="mt-5 space-y-4">

                            <a
                                href="mailto:hello@example.com"
                                className="flex items-center gap-3 text-sm text-slate-400 transition hover:text-white"
                            >
                                <Mail size={17} />
                                hello@example.com
                            </a>

                            <a
                                href="#"
                                className="flex items-center gap-3 text-sm text-slate-400 transition hover:text-white"
                            >
                                GitHub
                                <ArrowUpRight size={14} />
                            </a>

                            <a
                                href="#"
                                className="flex items-center gap-3 text-sm text-slate-400 transition hover:text-white"
                            >
                                LinkedIn
                                <ArrowUpRight size={14} />
                            </a>

                        </div>
                    </div>

                </div>

                <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} Portfolio.
                    All rights reserved.
                </div>

            </div>
        </footer>
    );
};

export default Footer;
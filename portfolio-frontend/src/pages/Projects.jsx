import { useEffect, useState } from "react";
import {
    ArrowUpRight,
    FolderKanban,
    Sparkles
} from "lucide-react";

import { getProjects } from "../services/contentService";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProjects();

                const publishedProjects = (
                    response?.data || []
                )
                    .filter(
                        (project) =>
                            project.is_published !== false
                    )
                    .sort(
                        (a, b) =>
                            (a.display_order ?? 0) -
                            (b.display_order ?? 0)
                    );

                setProjects(publishedProjects);
            } catch (err) {
                console.error(
                    "Projects load error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load projects."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    return (
        <main className="bg-white text-slate-950">

            {/* Header */}
            <section className="bg-slate-950 px-6 pb-20 pt-40 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Selected Work
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Projects built with
                        technology and purpose.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                        A collection of projects, platforms and
                        digital products built with modern
                        technologies and practical engineering.
                    </p>

                </div>
            </section>

            {/* Projects */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-7xl">

                    {/* Loading */}
                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500">
                            Loading projects...
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Empty */}
                    {!loading &&
                        !error &&
                        projects.length === 0 && (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-16 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                                    <FolderKanban
                                        size={30}
                                    />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold">
                                    Projects coming soon
                                </h2>

                                <p className="mx-auto mt-3 max-w-lg text-slate-500">
                                    Projects published through the
                                    Portfolio CMS will appear here
                                    automatically.
                                </p>

                            </div>
                        )}

                    {/* Project Grid */}
                    {!loading &&
                        !error &&
                        projects.length > 0 && (
                            <div className="space-y-8">

                                {projects.map((project) => (
                                    <article
                                        key={project.id}
                                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >

                                        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

                                            {/* Image / Placeholder */}
                                            <div className="min-h-[280px] bg-slate-100">

                                                {project.image_url ? (
                                                    <img
                                                        src={
                                                            project.image_url
                                                        }
                                                        alt={
                                                            project.title
                                                        }
                                                        loading="lazy"
                                                        className="h-full min-h-[280px] w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full min-h-[280px] items-center justify-center bg-slate-950">

                                                        <div className="text-center text-white">

                                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-950">
                                                                <FolderKanban
                                                                    size={
                                                                        30
                                                                    }
                                                                />
                                                            </div>

                                                            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                                                Project
                                                            </p>

                                                            <h3 className="mt-2 text-2xl font-bold">
                                                                {
                                                                    project.title
                                                                }
                                                            </h3>

                                                        </div>

                                                    </div>
                                                )}

                                            </div>

                                            {/* Content */}
                                            <div className="p-8 sm:p-10">

                                                {/* Featured */}
                                                {project.featured && (
                                                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                                                        <Sparkles
                                                            size={14}
                                                        />
                                                        Featured Project
                                                    </div>
                                                )}

                                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                                    {project.slug}
                                                </p>

                                                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                                    {
                                                        project.title
                                                    }
                                                </h2>

                                                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                                                    {
                                                        project.description
                                                    }
                                                </p>

                                                {/* Technologies */}
                                                {Array.isArray(
                                                        project.tech_stack
                                                    ) &&
                                                    project.tech_stack
                                                        .length > 0 && (
                                                        <div className="mt-7">

                                                            <p className="mb-3 text-sm font-semibold text-slate-900">
                                                                Technology
                                                            </p>

                                                            <div className="flex flex-wrap gap-2">

                                                                {project.tech_stack.map(
                                                                    (
                                                                        technology
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                technology
                                                                            }
                                                                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                                                                        >
                                                                            {
                                                                                technology
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}

                                                            </div>

                                                        </div>
                                                    )}

                                                {/* Links */}
                                                {(project.live_url ||
                                                    project.github_url) && (
                                                    <div className="mt-8 flex flex-wrap gap-4">

                                                        {project.live_url && (
                                                            <a
                                                                href={
                                                                    project.live_url
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                                                            >
                                                                Live Demo
                                                                <ArrowUpRight
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            </a>
                                                        )}

                                                        {project.github_url && (
                                                            <a
                                                                href={
                                                                    project.github_url
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
                                                            >
                                                                GitHub
                                                                <ArrowUpRight
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            </a>
                                                        )}

                                                    </div>
                                                )}

                                            </div>

                                        </div>

                                    </article>
                                ))}

                            </div>
                        )}

                </div>
            </section>

        </main>
    );
};

export default Projects;
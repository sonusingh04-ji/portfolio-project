import { useEffect, useState } from "react";
import {
    Code2,
    Layers3,
    Sparkles,
    ArrowUpRight
} from "lucide-react";

import { getSkills } from "../services/contentService";

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSkills = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getSkills();

                const visibleSkills = (
                    response?.data || []
                )
                    .filter(
                        (skill) =>
                            skill.is_visible === true
                    )
                    .sort(
                        (a, b) =>
                            (a.display_order ?? 0) -
                            (b.display_order ?? 0)
                    );

                setSkills(visibleSkills);
            } catch (err) {
                console.error(
                    "Skills load error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load skills."
                );
            } finally {
                setLoading(false);
            }
        };

        loadSkills();
    }, []);

    const getCategoryIcon = (category) => {
        const value =
            category?.toLowerCase() || "";

        if (value.includes("frontend")) {
            return Code2;
        }

        if (value.includes("backend")) {
            return Layers3;
        }

        return Sparkles;
    };

    return (
        <main className="bg-white text-slate-950">

            {/* Header */}
            <section className="bg-slate-950 px-6 pb-20 pt-40 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Skills
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Technologies I use
                        to build products.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                        My technical skills are managed through
                        the Portfolio CMS and displayed dynamically
                        on this website.
                    </p>

                </div>
            </section>

            {/* Skills */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-7xl">

                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500">
                            Loading skills...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        skills.length === 0 && (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                                    <Sparkles size={30} />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold">
                                    Skills coming soon
                                </h2>

                                <p className="mx-auto mt-3 max-w-lg text-slate-500">
                                    Skills published through the
                                    Portfolio CMS will appear here.
                                </p>

                            </div>
                        )}

                    {!loading &&
                        !error &&
                        skills.length > 0 && (
                            <>
                                <div className="mb-10">
                                    <p className="text-sm text-slate-500">
                                        {skills.length}{" "}
                                        {skills.length === 1
                                            ? "skill"
                                            : "skills"}{" "}
                                        available
                                    </p>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                                    {skills.map((skill) => {
                                        const Icon =
                                            getCategoryIcon(
                                                skill.category
                                            );

                                        const proficiency =
                                            Math.max(
                                                0,
                                                Math.min(
                                                    100,
                                                    Number(
                                                        skill.proficiency
                                                    ) || 0
                                                )
                                            );

                                        return (
                                            <article
                                                key={skill.id}
                                                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                            >

                                                <div className="flex items-start justify-between gap-5">

                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
                                                        <Icon size={21} />
                                                    </div>

                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                                                        {proficiency}%
                                                    </span>

                                                </div>

                                                <h2 className="mt-6 text-2xl font-bold">
                                                    {skill.name}
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {skill.category}
                                                </p>

                                                <div className="mt-7">
                                                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                                                        <span>
                                                            Proficiency
                                                        </span>

                                                        <span>
                                                            {proficiency}%
                                                        </span>
                                                    </div>

                                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className="h-full rounded-full bg-slate-950 transition-all duration-700"
                                                            style={{
                                                                width: `${proficiency}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-slate-500">
                                                    {skill.icon && (
                                                        <span>
                                                            {skill.icon}
                                                        </span>
                                                    )}

                                                    <ArrowUpRight
                                                        size={15}
                                                        className="opacity-0 transition-opacity group-hover:opacity-100"
                                                    />
                                                </div>

                                            </article>
                                        );
                                    })}

                                </div>
                            </>
                        )}

                </div>
            </section>

        </main>
    );
};

export default Skills;
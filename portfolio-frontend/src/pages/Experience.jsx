import { useEffect, useState } from "react";
import {
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
    MapPin
} from "lucide-react";

import { getExperience } from "../services/contentService";

const Experience = () => {
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadExperience = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getExperience();

                const items = (response?.data || []).sort(
                    (a, b) =>
                        (a.display_order ?? 0) -
                        (b.display_order ?? 0)
                );

                setExperience(items);
            } catch (err) {
                console.error(
                    "Experience load error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load experience."
                );
            } finally {
                setLoading(false);
            }
        };

        loadExperience();
    }, []);

    const formatDate = (value) => {
        if (!value) {
            return "Present";
        }

        return new Date(value).toLocaleDateString(
            "en-US",
            {
                month: "short",
                year: "numeric"
            }
        );
    };

    return (
        <main className="bg-white text-slate-950">

            <section className="bg-slate-950 px-6 pb-20 pt-40 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Experience
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        My professional
                        journey.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                        Experience managed through the Portfolio CMS.
                    </p>

                </div>
            </section>

            <section className="px-6 py-20 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-5xl">

                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500">
                            Loading experience...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        experience.length === 0 && (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">
                                <BriefcaseBusiness
                                    className="mx-auto text-slate-300"
                                    size={42}
                                />

                                <h2 className="mt-6 text-2xl font-bold">
                                    Experience coming soon
                                </h2>

                                <p className="mt-3 text-slate-500">
                                    Experience added through the CMS
                                    will appear here.
                                </p>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        experience.length > 0 && (
                            <div className="relative">

                                <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-slate-200 md:block" />

                                <div className="space-y-10">

                                    {experience.map((item) => (
                                        <article
                                            key={item.id}
                                            className="relative md:pl-14"
                                        >

                                            <div className="absolute left-0 top-6 hidden h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white md:flex">
                                                <BriefcaseBusiness
                                                    size={17}
                                                />
                                            </div>

                                            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                                                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

                                                    <div>

                                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                            {item.employment_type}
                                                        </p>

                                                        <h2 className="mt-2 text-2xl font-bold">
                                                            {item.position}
                                                        </h2>

                                                        <p className="mt-1 text-lg font-medium text-slate-600">
                                                            {item.company}
                                                        </p>

                                                    </div>

                                                    {item.is_current && (
                                                        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                                            Current
                                                        </span>
                                                    )}

                                                </div>

                                                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">

                                                    <span className="inline-flex items-center gap-2">
                                                        <CalendarDays size={15} />

                                                        {formatDate(
                                                            item.start_date
                                                        )}

                                                        {" — "}

                                                        {item.is_current
                                                            ? "Present"
                                                            : formatDate(
                                                                item.end_date
                                                            )}
                                                    </span>

                                                    {item.location && (
                                                        <span className="inline-flex items-center gap-2">
                                                            <MapPin size={15} />
                                                            {item.location}
                                                        </span>
                                                    )}

                                                </div>

                                                {item.description && (
                                                    <p className="mt-6 leading-8 text-slate-600">
                                                        {item.description}
                                                    </p>
                                                )}

                                                {Array.isArray(
                                                        item.technologies
                                                    ) &&
                                                    item.technologies.length > 0 && (
                                                        <div className="mt-6 flex flex-wrap gap-2">

                                                            {item.technologies.map(
                                                                (technology) => (
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
                                                    )}

                                            </div>

                                        </article>
                                    ))}

                                </div>
                            </div>
                        )}

                </div>
            </section>

        </main>
    );
};

export default Experience;
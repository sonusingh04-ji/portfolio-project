import { useEffect, useState } from "react";
import {
    ArrowUpRight,
    Download,
    MapPin,
    Mail,
    Phone
} from "lucide-react";

import { Link } from "react-router-dom";
import { getAbout } from "../services/contentService";

const About = () => {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAbout = async () => {
            try {
                setLoading(true);

                const response = await getAbout();

                setAbout(response?.data || null);
            } catch (err) {
                console.error("About load error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load About information."
                );
            } finally {
                setLoading(false);
            }
        };

        loadAbout();
    }, []);

    return (
        <main className="bg-white text-slate-950">

            {/* Hero */}
            <section className="bg-slate-950 px-6 pb-20 pt-40 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        About Me
                    </p>

                    <h1 className="mt-5 max-w-5xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        {about?.headline ||
                            "Building practical digital products."}
                    </h1>

                </div>
            </section>

            {/* Content */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-7xl">

                    {/* Loading */}
                    {loading && (
                        <div className="rounded-2xl border border-slate-200 p-8 text-slate-500">
                            Loading About information...
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    )}

                    {/* About Data */}
                    {!loading && !error && about && (
                        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">

                            {/* Profile */}
                            <div>

                                {about.profile_image_url ? (
                                    <img
                                        src={about.profile_image_url}
                                        alt={about.full_name}
                                        loading="lazy"
                                        className="aspect-square w-full max-w-sm rounded-3xl object-cover"
                                    />
                                ) : (
                                    <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl bg-slate-100 text-7xl font-bold text-slate-300">
                                        {about.full_name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "S"}
                                    </div>
                                )}

                                <div className="mt-6">

                                    <h2 className="text-2xl font-bold">
                                        {about.full_name}
                                    </h2>

                                    <p className="mt-1 text-slate-500">
                                        {about.headline}
                                    </p>

                                </div>

                            </div>

                            {/* Details */}
                            <div>

                                <p className="max-w-3xl text-xl leading-9 text-slate-600">
                                    {about.bio}
                                </p>

                                {/* Contact Information */}
                                <div className="mt-10 grid gap-4 sm:grid-cols-2">

                                    {/* Location */}
                                    {about.location && (
                                        <div className="rounded-2xl border border-slate-200 p-5">

                                            <div className="flex items-center gap-3">
                                                <MapPin size={18} />

                                                <span className="text-sm text-slate-500">
                                                    Location
                                                </span>
                                            </div>

                                            <p className="mt-3 font-semibold">
                                                {about.location}
                                            </p>

                                        </div>
                                    )}

                                    {/* Email */}
                                    {about.email && (
                                        <div className="rounded-2xl border border-slate-200 p-5">

                                            <div className="flex items-center gap-3">
                                                <Mail size={18} />

                                                <span className="text-sm text-slate-500">
                                                    Email
                                                </span>
                                            </div>

                                            <a
                                                href={`mailto:${about.email}`}
                                                className="mt-3 block break-all font-semibold hover:underline"
                                            >
                                                {about.email}
                                            </a>

                                        </div>
                                    )}

                                    {/* Phone */}
                                    {about.phone && (
                                        <div className="rounded-2xl border border-slate-200 p-5">

                                            <div className="flex items-center gap-3">
                                                <Phone size={18} />

                                                <span className="text-sm text-slate-500">
                                                    Phone
                                                </span>
                                            </div>

                                            <a
                                                href={`tel:${about.phone}`}
                                                className="mt-3 block font-semibold hover:underline"
                                            >
                                                {about.phone}
                                            </a>

                                        </div>
                                    )}

                                    {/* Website */}
                                    {about.website_url && (
                                        <div className="rounded-2xl border border-slate-200 p-5">

                                            <div className="flex items-center gap-3">
                                                <ArrowUpRight size={18} />

                                                <span className="text-sm text-slate-500">
                                                    Website
                                                </span>
                                            </div>

                                            <a
                                                href={about.website_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-3 block break-all font-semibold hover:underline"
                                            >
                                                Visit website
                                            </a>

                                        </div>
                                    )}

                                </div>

                                {/* Action Buttons */}
                                <div className="mt-10 flex flex-wrap gap-4">

                                    {/* Resume */}
                                    {about.resume_url && (
                                        <a
                                            href={about.resume_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                                        >
                                            <Download size={17} />
                                            View Resume
                                        </a>
                                    )}

                                    {/* GitHub */}
                                    {about.github_url && (
                                        <a
                                            href={about.github_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100"
                                        >
                                            GitHub
                                            <ArrowUpRight size={17} />
                                        </a>
                                    )}

                                    {/* LinkedIn */}
                                    {about.linkedin_url && (
                                        <a
                                            href={about.linkedin_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold transition hover:bg-slate-100"
                                        >
                                            LinkedIn
                                            <ArrowUpRight size={17} />
                                        </a>
                                    )}

                                </div>

                                {/* Contact CTA */}
                                <div className="mt-10">

                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-2 font-semibold"
                                    >
                                        Let's work together
                                        <ArrowUpRight size={17} />
                                    </Link>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* No data */}
                    {!loading && !error && !about && (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">

                            <h2 className="text-2xl font-bold">
                                About information unavailable
                            </h2>

                            <p className="mt-3 text-slate-500">
                                Add About information from the Admin CMS.
                            </p>

                        </div>
                    )}

                </div>
            </section>

        </main>
    );
};

export default About;
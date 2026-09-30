import { useEffect, useState } from "react";

import {
    ArrowUpRight,
    Code2,
    Layers3,
    ServerCog,
    Sparkles
} from "lucide-react";

import { Link } from "react-router-dom";

import { getServices } from "../services/contentService";

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getServices();

                const visibleServices = (
                    response?.data || []
                )
                    .filter(
                        (service) =>
                            service.is_visible === true
                    )
                    .sort(
                        (a, b) =>
                            (a.display_order ?? 0) -
                            (b.display_order ?? 0)
                    );

                setServices(visibleServices);
            } catch (err) {
                console.error(
                    "Services load error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load services."
                );
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    const getServiceIcon = (icon) => {
        const value =
            icon?.toLowerCase() || "";

        if (value.includes("server")) {
            return ServerCog;
        }

        if (value.includes("layer")) {
            return Layers3;
        }

        if (value.includes("code")) {
            return Code2;
        }

        return Sparkles;
    };

    return (
        <main className="bg-white text-slate-950">

            {/* Hero */}
            <section className="bg-slate-950 px-6 pb-20 pt-24 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Services
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        From idea to
                        <br />
                        working software.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                        Development services managed through
                        the Portfolio CMS.
                    </p>

                </div>
            </section>

            {/* Services */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">

                <div className="mx-auto max-w-7xl">

                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500">
                            Loading services...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        services.length === 0 && (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300">
                                    <Sparkles
                                        size={30}
                                    />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold">
                                    Services coming soon
                                </h2>

                                <p className="mt-3 text-slate-500">
                                    Services published through the
                                    CMS will appear here.
                                </p>

                            </div>
                        )}

                    {!loading &&
                        !error &&
                        services.length > 0 && (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                                {services.map((service) => {
                                    const Icon =
                                        getServiceIcon(
                                            service.icon
                                        );

                                    return (
                                        <article
                                            key={service.id}
                                            className="group rounded-3xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                        >

                                            <div className="flex items-center justify-between">

                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                                    <Icon
                                                        size={25}
                                                    />
                                                </div>

                                                <ArrowUpRight
                                                    size={20}
                                                    className="text-slate-300 transition group-hover:text-slate-950"
                                                />

                                            </div>

                                            <h2 className="mt-7 text-2xl font-bold">
                                                {
                                                    service.title
                                                }
                                            </h2>

                                            <p className="mt-4 leading-7 text-slate-600">
                                                {
                                                    service.description
                                                }
                                            </p>

                                            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">

                                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                    {
                                                        service.slug
                                                    }
                                                </span>

                                                <span className="text-xs text-slate-400">
                                                    Service
                                                </span>

                                            </div>

                                        </article>
                                    );
                                })}

                            </div>
                        )}

                </div>
            </section>

        </main>
    );
};

export default Services;
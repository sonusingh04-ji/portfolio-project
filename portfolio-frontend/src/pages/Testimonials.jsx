import { useEffect, useState } from "react";

import {
    Quote,
    Sparkles
} from "lucide-react";

import { getTestimonials } from "../services/contentService";

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTestimonials = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getTestimonials();

                setTestimonials(
                    Array.isArray(response?.data)
                        ? response.data
                        : []
                );
            } catch (err) {
                console.error(
                    "Testimonials load error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load testimonials."
                );
            } finally {
                setLoading(false);
            }
        };

        loadTestimonials();
    }, []);

    return (
        <main className="bg-white text-slate-950">

            {/* Hero */}
            <section className="bg-slate-950 px-6 pb-20 pt-24 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Testimonials
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        What people say.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                        Feedback and recommendations published
                        through the Portfolio CMS.
                    </p>

                </div>
            </section>

            {/* Content */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">

                <div className="mx-auto max-w-7xl">

                    {/* Loading */}
                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500">
                            Loading testimonials...
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading &&
                        !error &&
                        testimonials.length === 0 && (
                            <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-14 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                                    <Quote size={30} />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold">
                                    Testimonials coming soon
                                </h2>

                                <p className="mt-3 leading-7 text-slate-500">
                                    Testimonials published through
                                    the Portfolio CMS will appear
                                    here automatically.
                                </p>

                                <Sparkles
                                    className="mx-auto mt-6 text-slate-300"
                                    size={20}
                                />

                            </div>
                        )}

                    {/* Testimonials */}
                    {!loading &&
                        !error &&
                        testimonials.length > 0 && (
                            <div className="grid gap-6 md:grid-cols-2">

                                {testimonials.map(
                                    (testimonial) => (
                                        <article
                                            key={
                                                testimonial.id
                                            }
                                            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
                                        >

                                            <Quote
                                                size={28}
                                                className="text-slate-300"
                                            />

                                            {/* We will map the exact
                                                fields after the first
                                                real API record exists. */}
                                            <div className="mt-6">

                                                <pre className="overflow-auto rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                                                    {JSON.stringify(
                                                        testimonial,
                                                        null,
                                                        2
                                                    )}
                                                </pre>

                                            </div>

                                        </article>
                                    )
                                )}

                            </div>
                        )}

                </div>
            </section>

        </main>
    );
};

export default Testimonials;
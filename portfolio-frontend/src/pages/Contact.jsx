import { useEffect, useState } from "react";

import {
    ArrowUpRight,
    CheckCircle2,
    Mail,
    MapPin,
    Phone
} from "lucide-react";

import {
    getAbout,
    submitContact
} from "../services/contentService";

const Contact = () => {
    const [about, setAbout] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAbout = async () => {
            try {
                const response = await getAbout();

                setAbout(
                    response?.data || null
                );
            } catch (err) {
                console.error(
                    "Contact about load error:",
                    err
                );
            }
        };

        loadAbout();
    }, []);

    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            await submitContact(form);

            setSuccess(
                "Your message has been sent successfully."
            );

            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (err) {
            console.error(
                "Contact submit error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to send your message."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-white text-slate-950">

            {/* Header */}
            <section className="bg-slate-950 px-6 pb-20 pt-24 text-white lg:px-8">

                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Contact
                    </p>

                    <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Let's build something
                        meaningful.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                        Have a project, opportunity or idea?
                        Send a message and I'll get back to you.
                    </p>

                </div>

            </section>

            {/* Content */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">

                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">

                    {/* Contact information */}
                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                            Get in touch
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            Contact information
                        </h2>

                        <p className="mt-4 max-w-md leading-7 text-slate-600">
                            I'm available for development
                            opportunities, collaborations and
                            interesting projects.
                        </p>

                        <div className="mt-8 space-y-4">

                            {about?.email && (
                                <a
                                    href={`mailto:${about.email}`}
                                    className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 transition hover:shadow-md"
                                >

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                                        <Mail size={19} />
                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Email
                                        </p>

                                        <p className="mt-1 break-all font-semibold">
                                            {about.email}
                                        </p>

                                    </div>

                                </a>
                            )}

                            {about?.phone && (
                                <a
                                    href={`tel:${about.phone}`}
                                    className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5 transition hover:shadow-md"
                                >

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                                        <Phone size={19} />
                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Phone
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {about.phone}
                                        </p>

                                    </div>

                                </a>
                            )}

                            {about?.location && (
                                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                                        <MapPin size={19} />
                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Location
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {about.location}
                                        </p>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                    {/* Form */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">

                        <div className="mb-8">

                            <h2 className="text-2xl font-bold">
                                Send a message
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Fill out the form and your message
                                will be delivered to the Portfolio CMS.
                            </p>

                        </div>

                        {success && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">

                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                {success}

                            </div>
                        )}

                        {error && (
                            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
                                        placeholder="you@example.com"
                                    />
                                </div>

                            </div>

                            <div>

                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Subject
                                </label>

                                <input
                                    id="subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
                                    placeholder="Project discussion"
                                />

                            </div>

                            <div>

                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Message
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    value={
                                        form.message
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    rows={7}
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
                                    placeholder="Tell me about your project..."
                                />

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send Message"}

                                <ArrowUpRight
                                    size={18}
                                />
                            </button>

                        </form>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Contact;